"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Renderer, Program, Mesh, Triangle, Transform, Texture } from "ogl";

import { useReducedMotion } from "@/lib/motion";
import { supportsWebGL } from "@/lib/webgl";

export type PortraitMorphProps = {
  srcA: string;
  srcB: string;
  alt: string;
  className?: string;
};

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uOrigin;
uniform vec2 uDirection;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageSize.y / uImageSize.x), 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 baseUv = coverUv(uv);

  float p = uProgress;
  float bell = 4.0 * p * (1.0 - p);

  vec2 dir = normalize(uDirection + vec2(0.0001));
  float along = dot(uv - uOrigin, dir);
  float distGradient = (along + 1.4) / 2.8;

  float warpLow = fbm(uv * 1.8 + uTime * 0.05) - 0.5;
  float warpHi = fbm(uv * 5.5 - uTime * 0.04 + 13.0) - 0.5;
  float warp = warpLow * 0.55 + warpHi * 0.18;

  float field = distGradient + warp;

  float remapped = mix(-0.25, 1.25, p);
  float edgeWidth = 0.07;
  float mask = smoothstep(remapped - edgeWidth, remapped + edgeWidth, field);
  mask = 1.0 - mask;

  vec2 perp = vec2(-dir.y, dir.x);
  float ripplePhase = (field - remapped) * 14.0;
  float ripple = sin(ripplePhase) * 0.5 + 0.5;
  float edgeBand = 1.0 - smoothstep(0.0, edgeWidth * 1.6, abs(field - remapped));
  float pushAmount = ripple * edgeBand * 0.025 * bell;
  vec2 pushUv = uv + perp * pushAmount;
  vec2 baseUvA = coverUv(pushUv);
  vec2 baseUvB = coverUv(pushUv);

  vec4 texA = texture2D(uTexA, baseUvA);
  vec4 texB = texture2D(uTexB, baseUvB);

  vec4 color = mix(texA, texB, mask);

  float darken = edgeBand * 0.35 * bell;
  color.rgb *= 1.0 - darken;

  gl_FragColor = color;
}
`;

export function PortraitMorph({
  srcA,
  srcB,
  alt,
  className,
}: PortraitMorphProps): ReactNode {
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [ready, setReady] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const hoverRef = useRef(false);
  const progressRef = useRef(0);
  const originRef = useRef<[number, number]>([0.5, 0.5]);
  const directionRef = useRef<[number, number]>([1, 0]);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const image = new window.Image();
    image.src = srcB;
    return () => {
      image.src = "";
    };
  }, [srcB]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let effectActive = true;

    const setStaticFallback = () => {
      queueMicrotask(() => {
        if (!effectActive) return;
        setReady(false);
        setWebglUnavailable(true);
      });
    };

    hoverRef.current = false;
    progressRef.current = 0;
    lastPointerRef.current = null;

    if (prefersReducedMotion) return;
    if (!supportsWebGL()) {
      setStaticFallback();
      return () => {
        effectActive = false;
      };
    }

    const supportsFineHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    let renderer: Renderer;
    let gl: Renderer["gl"];
    let canvas: HTMLCanvasElement;
    let scene: Transform;
    let texA: Texture;
    let texB: Texture;
    let program: Program;

    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      gl = renderer.gl;
      canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);

      scene = new Transform();

      texA = new Texture(gl, { generateMipmaps: false });
      texB = new Texture(gl, { generateMipmaps: false });
    } catch {
      setStaticFallback();
      return () => {
        effectActive = false;
      };
    }

    const imageSize: [number, number] = [1, 1];

    const loadImage = (src: string, target: Texture): Promise<void> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          target.image = img;
          imageSize[0] = img.naturalWidth;
          imageSize[1] = img.naturalHeight;
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });

    try {
      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: FRAGMENT_SHADER,
        uniforms: {
          uTexA: { value: texA },
          uTexB: { value: texB },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uResolution: { value: [1, 1] as [number, number] },
          uImageSize: { value: imageSize },
          uOrigin: { value: [0.5, 0.5] as [number, number] },
          uDirection: { value: [1, 0] as [number, number] },
        },
        transparent: true,
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
    } catch {
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setStaticFallback();
      return () => {
        effectActive = false;
      };
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      program.uniforms.uResolution.value = [
        w * renderer.dpr,
        h * renderer.dpr,
      ];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let running = true;
    let intersectionObserver: IntersectionObserver | null = null;
    let demoDelay = 0;
    let demoRelease = 0;
    let touchDemoRequested = false;
    let texturesReady = false;
    let touchDemoPlayed = false;

    const tick = () => {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      time += dt;

      const target = hoverRef.current ? 1 : 0;
      const stiffness = hoverRef.current ? 2.4 : 2.0;
      const k = 1 - Math.exp(-stiffness * dt);
      progressRef.current += (target - progressRef.current) * k;

      program.uniforms.uTime.value = time;
      program.uniforms.uProgress.value = progressRef.current;
      program.uniforms.uOrigin.value = originRef.current;
      program.uniforms.uDirection.value = directionRef.current;
      program.uniforms.uImageSize.value = imageSize;

      renderer.render({ scene });
      raf = requestAnimationFrame(tick);
    };

    const playTouchDemo = () => {
      if (
        supportsFineHover ||
        !touchDemoRequested ||
        !texturesReady ||
        touchDemoPlayed
      ) {
        return;
      }
      touchDemoPlayed = true;
      demoDelay = window.setTimeout(() => {
        if (!running) return;
        originRef.current = [0.58, 0.5];
        directionRef.current = [-1, 0];
        hoverRef.current = true;
        demoRelease = window.setTimeout(() => {
          hoverRef.current = false;
        }, 900);
      }, 280);
    };

    Promise.all([loadImage(srcA, texA), loadImage(srcB, texB)])
      .then(() => {
        setReady(true);
        setWebglUnavailable(false);
        last = performance.now();
        tick();
        texturesReady = true;
        playTouchDemo();
      })
      .catch(() => {
        setReady(false);
      });

    const computeEdgeDirection = (x: number, y: number): [number, number] => {
      const dxLeft = x;
      const dxRight = 1 - x;
      const dyBottom = y;
      const dyTop = 1 - y;
      const minDist = Math.min(dxLeft, dxRight, dyBottom, dyTop);
      if (minDist === dxLeft) return [1, 0];
      if (minDist === dxRight) return [-1, 0];
      if (minDist === dyBottom) return [0, 1];
      return [0, -1];
    };

    const onPointerEnter = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      originRef.current = [x, y];
      directionRef.current = computeEdgeDirection(x, y);
      lastPointerRef.current = { x, y, t: performance.now() };
      hoverRef.current = true;
    };
    const onPointerLeave = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      originRef.current = [x, y];
      directionRef.current = computeEdgeDirection(x, y).map((v) => -v) as [
        number,
        number,
      ];
      hoverRef.current = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      const last = lastPointerRef.current;
      if (last && performance.now() - last.t < 80 && progressRef.current < 0.15) {
        const vx = x - last.x;
        const vy = y - last.y;
        const mag = Math.hypot(vx, vy);
        if (mag > 0.01) {
          directionRef.current = [vx / mag, vy / mag];
        }
      }
      lastPointerRef.current = { x, y, t: performance.now() };
    };

    const setOriginFromPoint = (clientX?: number, clientY?: number) => {
      const rect = container.getBoundingClientRect();
      const hasPoint =
        typeof clientX === "number" &&
        typeof clientY === "number" &&
        Number.isFinite(clientX) &&
        Number.isFinite(clientY);
      const x = hasPoint ? (clientX - rect.left) / rect.width : 0.56;
      const y = hasPoint ? 1 - (clientY - rect.top) / rect.height : 0.52;
      const clampedX = Math.min(Math.max(x, 0.08), 0.92);
      const clampedY = Math.min(Math.max(y, 0.08), 0.92);
      originRef.current = [clampedX, clampedY];
      directionRef.current = computeEdgeDirection(clampedX, clampedY);
    };

    const onClick = (e: MouseEvent) => {
      if (supportsFineHover && e.detail !== 0) return;
      setOriginFromPoint(e.clientX, e.clientY);
      hoverRef.current = !(hoverRef.current || progressRef.current > 0.5);
    };

    if (supportsFineHover) {
      container.addEventListener("pointerenter", onPointerEnter);
      container.addEventListener("pointerleave", onPointerLeave);
      container.addEventListener("pointermove", onPointerMove);
    } else {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          intersectionObserver?.disconnect();
          touchDemoRequested = true;
          playTouchDemo();
        },
        { threshold: 0.45 }
      );
      intersectionObserver.observe(container);
    }

    container.addEventListener("click", onClick);

    return () => {
      effectActive = false;
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(demoDelay);
      window.clearTimeout(demoRelease);
      intersectionObserver?.disconnect();
      ro.disconnect();
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      const ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [srcA, srcB, prefersReducedMotion]);

  const showFallback = !ready || prefersReducedMotion || webglUnavailable;

  return (
    <button
      ref={containerRef}
      type="button"
      data-webgl-fallback={showFallback ? "" : undefined}
      aria-label={
        prefersReducedMotion ? alt : `${alt}，点击可切换头像状态`
      }
      className={`focus-ring ${className ?? ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        filter: "grayscale(100%)",
        display: "block",
        cursor: prefersReducedMotion || webglUnavailable ? "default" : "pointer",
        appearance: "none",
        border: 0,
        padding: 0,
        background: "transparent",
      }}
    >
      {showFallback ? (
        <img
          src={srcA}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
      ) : null}
    </button>
  );
}
