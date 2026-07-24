"use client";

import { Mesh, Program, Renderer, Transform, Triangle } from "ogl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";
import { supportsWebGL } from "@/lib/webgl";

export type ShaderFlowProps = {
  className?: string;
  flowSpeed?: [number, number];
  iterations?: number;
  scale?: number;
  brightness?: number;
  colorLowA?: [number, number, number];
  colorHighA?: [number, number, number];
  fadeRx?: number;
  fadeRy?: number;
  fadeCx?: number;
  fadeCy?: number;
};

const VS = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;

const FS = `precision highp float;
uniform vec2 uR;
uniform float uT;
uniform vec2 uV;
uniform float uS;
uniform float uTw;
uniform float uDe;
uniform float uMs;
uniform float uB;
uniform int uIt;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uBgColor;
uniform vec4 uFadeShape;

float h(vec2 p){
  return sin(p.x+sin(p.y+uT*uV.x))*sin(p.y*p.x*0.1+uT*uV.y);
}

float fadeAlpha(float d){
  float t=clamp(1.0-d,0.0,1.0);
  return t*t*(3.0-2.0*t);
}

void main(){
  vec2 frag=gl_FragCoord.xy/uR;
  vec2 p=frag-0.5;
  p.x*=uR.x/uR.y;
  p*=uS;

  float ms=uT*uMs*0.1;
  vec2 d=vec2(sin(ms),cos(ms))*0.1;
  float kt=uTw*0.01;
  float kd=1.0/uDe;

  vec2 e=vec2(0.05,0.);
  vec2 r=vec2(0.);
  for(int i=0;i<24;i++){
    if(i>=uIt)break;
    float a=h(p);
    float b=h(p+e.xy);
    float c=h(p+e.yx);
    vec2 q=vec2(b-a,c-a)*20.;
    p+=vec2(-q.y,q.x)*kt+q*kd+d;
    r=q;
  }

  float t=clamp(length(r)*0.5,0.0,1.0);
  vec3 col=mix(uColorLow,uColorHigh,t)*uB;

  vec2 ndc=vec2(frag.x,1.0-frag.y);
  float aspect=uR.x/uR.y;
  float dx=((ndc.x-uFadeShape.x)*aspect)/uFadeShape.z;
  float dy=(ndc.y-uFadeShape.y)/uFadeShape.w;
  float fa=fadeAlpha(sqrt(dx*dx+dy*dy));

  vec3 outColor=mix(uBgColor,col,fa);
  gl_FragColor=vec4(outColor,1.0);
}`;

const D = {
  flowSpeed: [0.1, 0.2] as [number, number],
  iterations: 14,
  scale: 6,
  brightness: 1,
  colorLowA: [0.18, 0.2, 0.3] as [number, number, number],
  colorHighA: [0.55, 0.38, 0.32] as [number, number, number],
  fadeRx: 1.4,
  fadeRy: 0.6,
  fadeCx: 0.5,
  fadeCy: 0.0,
};

function parseColor(input: string): [number, number, number] | null {
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    if (Number.isNaN(n)) return null;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = s.match(/(\d+(?:\.\d+)?)/g);
  if (!m || m.length < 3) return null;
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
}

function readBgColor(el: HTMLElement): [number, number, number] {
  const styles = getComputedStyle(el);
  const varVal = styles.getPropertyValue("--background").trim();
  const parsed = varVal ? parseColor(varVal) : null;
  if (parsed) return parsed;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;width:0;height:0;background:var(--background);";
  el.appendChild(probe);
  const raw = getComputedStyle(probe).backgroundColor;
  el.removeChild(probe);
  return parseColor(raw) ?? [1, 1, 1];
}

export function ShaderFlow(props: ShaderFlowProps): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const pr = useRef(props);
  const prefersReducedMotion = useReducedMotion();
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    pr.current = props;
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;
    let effectActive = true;

    const setStaticFallback = () => {
      queueMicrotask(() => {
        if (!effectActive) return;
        setWebglUnavailable(true);
      });
    };

    if (!supportsWebGL()) {
      setStaticFallback();
      return () => {
        effectActive = false;
      };
    }

    let renderer: Renderer | null = null;
    let gl: Renderer["gl"] | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;
    const cleanup: Array<() => void> = [];

    const cleanupWebGL = (): void => {
      cancelAnimationFrame(raf);
      for (const fn of cleanup) fn();
      if (canvas?.parentElement === el) el.removeChild(canvas);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };

    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1),
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
      gl = renderer.gl;
      canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      el.appendChild(canvas);

      const geo = new Triangle(gl);
      const p = new Program(gl, {
        vertex: VS,
        fragment: FS,
        uniforms: {
          uT: { value: 0 },
          uR: { value: [1, 1] },
          uV: { value: [...D.flowSpeed] },
          uS: { value: D.scale },
          uTw: { value: 50 },
          uDe: { value: 200 },
          uMs: { value: 2.5 },
          uB: { value: D.brightness },
          uIt: { value: D.iterations },
          uColorLow: { value: [...D.colorLowA] },
          uColorHigh: { value: [...D.colorHighA] },
          uBgColor: { value: readBgColor(document.documentElement) },
          uFadeShape: {
            value: [D.fadeCx, D.fadeCy, D.fadeRx, D.fadeRy],
          },
        },
      });

      if (!p.uniformLocations) {
        throw new Error("ShaderFlow program failed to link.");
      }

      const mesh = new Mesh(gl, { geometry: geo, program: p });
      const scene = new Transform();
      mesh.setParent(scene);

      const onResize = (): void => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer?.setSize(w, h);
        if (gl) {
          p.uniforms.uR.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
        }
      };

      onResize();
      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      cleanup.push(() => ro.disconnect());

      let visible = true;
      let onScreen = true;
      const t0 = performance.now();

      const onVisibility = (): void => {
        visible = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVisibility);
      cleanup.push(() =>
        document.removeEventListener("visibilitychange", onVisibility)
      );

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) onScreen = e.isIntersecting;
        },
        { rootMargin: "100px" }
      );
      io.observe(el);
      cleanup.push(() => io.disconnect());

      const syncBg = (): void => {
        p.uniforms.uBgColor.value = readBgColor(document.documentElement);
      };
      const themeObserver = new MutationObserver(syncBg);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      });
      cleanup.push(() => themeObserver.disconnect());
      syncBg();

      const sync = (): void => {
        const c = pr.current;
        p.uniforms.uV.value = [...(c.flowSpeed ?? D.flowSpeed)];
        p.uniforms.uS.value = c.scale ?? D.scale;
        p.uniforms.uB.value = c.brightness ?? D.brightness;
        p.uniforms.uIt.value = c.iterations ?? D.iterations;
        p.uniforms.uColorLow.value = [...(c.colorLowA ?? D.colorLowA)];
        p.uniforms.uColorHigh.value = [...(c.colorHighA ?? D.colorHighA)];
        p.uniforms.uFadeShape.value = [
          c.fadeCx ?? D.fadeCx,
          c.fadeCy ?? D.fadeCy,
          c.fadeRx ?? D.fadeRx,
          c.fadeRy ?? D.fadeRy,
        ];
      };

      const tick = (): void => {
        if (visible && onScreen && renderer) {
          p.uniforms.uT.value = (performance.now() - t0) / 1000;
          sync();
          renderer.render({ scene });
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      setWebglUnavailable(false);

      return () => {
        effectActive = false;
        cleanupWebGL();
      };
    } catch {
      cleanupWebGL();
      setStaticFallback();
      return () => {
        effectActive = false;
      };
    }
  }, [prefersReducedMotion]);

  const fallback = prefersReducedMotion || webglUnavailable;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-webgl-fallback={fallback ? "" : undefined}
      className={props.className ?? "absolute inset-0 h-full w-full grayscale"}
      style={
        fallback
          ? {
              background:
                "radial-gradient(ellipse 90% 70% at 50% 0%, color-mix(in srgb, var(--brand) 16%, transparent), transparent 68%)",
            }
          : undefined
      }
    />
  );
}
