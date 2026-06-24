"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/motion";

type BlurPosition = "top" | "bottom" | "left" | "right";
type BlurTarget = "parent" | "page";
type BlurCurve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type BlurPreset =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "subtle"
  | "smooth";

type GradualBlurProps = {
  position?: BlurPosition;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: BlurCurve;
  target?: BlurTarget;
  preset?: BlurPreset;
  className?: string;
  style?: CSSProperties;
  onAnimationComplete?: () => void;
};

type ResolvedConfig = Required<
  Pick<
    GradualBlurProps,
    | "position"
    | "strength"
    | "height"
    | "divCount"
    | "exponential"
    | "zIndex"
    | "animated"
    | "duration"
    | "easing"
    | "opacity"
    | "curve"
    | "target"
    | "className"
    | "style"
  >
> &
  Pick<GradualBlurProps, "width" | "onAnimationComplete">;

type GradualBlurStyle = CSSProperties & Record<`--${string}`, string | number>;

const DEFAULT_CONFIG: ResolvedConfig = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  target: "parent",
  className: "",
  style: {},
};

const PRESETS = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.72, divCount: 3 },
  smooth: { height: "7rem", curve: "bezier", divCount: 6 },
} satisfies Record<BlurPreset, Partial<GradualBlurProps>>;

const CURVE_FUNCTIONS: Record<BlurCurve, (progress: number) => number> = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - Math.pow(1 - progress, 2),
  "ease-in-out": (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2,
};

const GRADIENT_DIRECTIONS: Record<BlurPosition, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

function useCoarsePointer(): boolean {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(max-width: 767px), (hover: none), (pointer: coarse)"
    );

    const update = () => setIsCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isCoarsePointer;
}

function useIntersectionVisibility(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve: boolean
): boolean {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

function buildMaskGradient(position: BlurPosition, index: number, total: number) {
  const increment = 100 / total;
  const p1 = Math.round((increment * index - increment) * 10) / 10;
  const p2 = Math.round(increment * index * 10) / 10;
  const p3 = Math.round((increment * index + increment) * 10) / 10;
  const p4 = Math.round((increment * index + increment * 2) * 10) / 10;

  let gradient = `transparent ${p1}%, black ${p2}%`;
  if (p3 <= 100) gradient += `, black ${p3}%`;
  if (p4 <= 100) gradient += `, transparent ${p4}%`;

  return `linear-gradient(${GRADIENT_DIRECTIONS[position]}, ${gradient})`;
}

function buildFallbackGradient(position: BlurPosition) {
  const color = "color-mix(in srgb, var(--background) 92%, transparent)";
  return `linear-gradient(${GRADIENT_DIRECTIONS[position]}, transparent, ${color})`;
}

function resolveConfig(props: GradualBlurProps): ResolvedConfig {
  const presetConfig = props.preset ? PRESETS[props.preset] : {};

  return {
    ...DEFAULT_CONFIG,
    ...presetConfig,
    ...props,
    style: props.style ?? {},
    className: props.className ?? "",
  };
}

function GradualBlur(props: GradualBlurProps): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const config = useMemo(() => resolveConfig(props), [props]);
  const shouldObserve = config.animated === "scroll" && !prefersReducedMotion;
  const isVisible = useIntersectionVisibility(containerRef, shouldObserve);

  const effectiveDivCount = prefersReducedMotion
    ? 0
    : isCoarsePointer
      ? Math.min(Math.max(config.divCount, 2), 4)
      : config.divCount;
  const effectiveStrength = isCoarsePointer
    ? config.strength * 0.62
    : config.strength;
  const effectiveOpacity = isCoarsePointer
    ? config.opacity * 0.72
    : config.opacity;
  const isVertical = config.position === "top" || config.position === "bottom";
  const effectiveHeight =
    isCoarsePointer && isVertical ? `min(${config.height}, 4.5rem)` : config.height;
  const effectiveWidth =
    config.width ?? (isVertical ? "100%" : effectiveHeight);

  const layers = useMemo(() => {
    if (effectiveDivCount <= 0) return [];

    const curve = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear;

    return Array.from({ length: effectiveDivCount }, (_, index) => {
      const layerIndex = index + 1;
      const progress = curve(layerIndex / effectiveDivCount);
      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * effectiveStrength
        : 0.0625 * (progress * effectiveDivCount + 1) * effectiveStrength;

      const style = {
        "--gb-blur": `${blurValue.toFixed(3)}rem`,
        "--gb-mask": buildMaskGradient(
          config.position,
          layerIndex,
          effectiveDivCount
        ),
        "--gb-layer-opacity": effectiveOpacity,
      } as GradualBlurStyle;

      return (
        <div
          key={`${config.position}-${layerIndex}`}
          className="gradual-blur-layer"
          style={style}
        />
      );
    });
  }, [
    config.curve,
    config.exponential,
    config.position,
    effectiveDivCount,
    effectiveOpacity,
    effectiveStrength,
  ]);

  useEffect(() => {
    if (
      isVisible &&
      config.animated === "scroll" &&
      config.onAnimationComplete &&
      !prefersReducedMotion
    ) {
      const timeout = window.setTimeout(
        config.onAnimationComplete,
        Number.parseFloat(config.duration) * 1000
      );

      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [
    config.animated,
    config.duration,
    config.onAnimationComplete,
    isVisible,
    prefersReducedMotion,
  ]);

  const containerStyle = {
    "--gb-height": effectiveHeight,
    "--gb-width": effectiveWidth,
    "--gb-z-index": config.zIndex,
    "--gb-duration": prefersReducedMotion ? "0s" : config.duration,
    "--gb-easing": config.easing,
    "--gb-fallback": buildFallbackGradient(config.position),
    "--gb-fallback-opacity": prefersReducedMotion
      ? Math.min(config.opacity * 0.28, 0.24)
      : Math.min(effectiveOpacity * 0.46, 0.42),
    opacity: prefersReducedMotion || isVisible ? 1 : 0,
    ...config.style,
  } as GradualBlurStyle;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={[
        "gradual-blur",
        `gradual-blur-${config.target}`,
        `gradual-blur-${config.position}`,
        config.className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      data-animated={config.animated && !prefersReducedMotion ? "true" : "false"}
      style={containerStyle}
    >
      <div className="gradual-blur-inner">
        {layers}
        <div className="gradual-blur-fallback" />
      </div>
    </div>
  );
}

export default memo(GradualBlur);
