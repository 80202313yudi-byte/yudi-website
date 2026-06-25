"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import {
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/motion";

type CapabilityKind =
  | "composition"
  | "hierarchy"
  | "storytelling"
  | "identity"
  | "ai-visual"
  | "delivery";

type Capability = {
  number: string;
  title: string;
  english: string;
  description: string;
  detail: string;
  rotate: number;
  kind: CapabilityKind;
};

const CAPABILITIES: Capability[] = [
  {
    number: "01",
    title: "构图",
    english: "Composition",
    description: "平衡画面重心",
    detail: "组织画面比例、视觉重心和留白。",
    rotate: -6,
    kind: "composition",
  },
  {
    number: "02",
    title: "层级",
    english: "Hierarchy",
    description: "建立阅读顺序",
    detail: "让标题、图像和信息按顺序被看见。",
    rotate: 4,
    kind: "hierarchy",
  },
  {
    number: "03",
    title: "叙事",
    english: "Storytelling",
    description: "组织观看节奏",
    detail: "把一个想法整理成可阅读的视觉线索。",
    rotate: -3,
    kind: "storytelling",
  },
  {
    number: "04",
    title: "品牌",
    english: "Identity",
    description: "统一识别线索",
    detail: "统一色彩、字体、图形和内容气质。",
    rotate: 5,
    kind: "identity",
  },
  {
    number: "05",
    title: "AI 视觉",
    english: "AI Visual",
    description: "扩展视觉方向",
    detail: "生成、筛选、修正并统一系列图像。",
    rotate: -4,
    kind: "ai-visual",
  },
  {
    number: "06",
    title: "交付",
    english: "Delivery",
    description: "推进可用成果",
    detail: "输出封面、海报、页面、物料和视觉系统。",
    rotate: 4,
    kind: "delivery",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_CLASS =
  "capability-card-button focus-ring group relative aspect-[3/4] w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border-[5px] border-neutral-300/35 bg-white p-1.5 text-left shadow-[0_12px_30px_rgba(10,10,10,0.035)] sm:w-[clamp(8.4rem,14vw,11rem)] dark:border-white/12 dark:bg-neutral-900 dark:shadow-none";
const WAKE_OFFSETS = [
  { x: -6, y: -2 },
  { x: -3, y: 3 },
  { x: 0, y: -4 },
  { x: 3, y: 2 },
  { x: 5, y: -3 },
  { x: 7, y: 2 },
];

type CapabilityCardStyle = CSSProperties & {
  "--tilt-x"?: string;
  "--tilt-y"?: string;
};

function CapabilityArtwork({ kind }: { kind: CapabilityKind }): ReactNode {
  if (kind === "composition") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <span className="border-foreground/20 absolute inset-[18%] rounded-sm border" />
        <span className="border-foreground/10 absolute top-[18%] bottom-[18%] left-1/2 border-l" />
        <span className="border-foreground/10 absolute top-1/2 right-[18%] left-[18%] border-t" />
        <span className="capability-art__composition-dot border-brand-line bg-brand-soft absolute top-[28%] right-[25%] h-5 w-5 rounded-full border" />
      </div>
    );
  }

  if (kind === "hierarchy") {
    return (
      <div
        className="flex h-full w-full flex-col justify-center gap-2.5 px-[18%]"
        aria-hidden="true"
      >
        <span className="capability-art__hierarchy-line bg-foreground/70 h-1.5 w-4/5 rounded-full" />
        <span className="capability-art__hierarchy-line bg-foreground/20 h-px w-full" />
        <span className="capability-art__hierarchy-line bg-foreground/15 h-px w-3/4" />
        <span className="capability-art__hierarchy-line bg-brand h-px w-1/2" />
      </div>
    );
  }

  if (kind === "storytelling") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <svg className="absolute inset-[18%] h-[64%] w-[64%]" viewBox="0 0 100 100">
          <path
            className="capability-art__story-path"
            d="M8 58 C28 48 39 66 54 50 S78 32 92 43"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        <span className="border-foreground/35 absolute top-[34%] left-[20%] h-2.5 w-2.5 rounded-full border bg-white dark:bg-neutral-900" />
        <span className="bg-brand absolute top-[49%] left-[46%] h-2.5 w-2.5 rounded-full" />
        <span className="border-foreground/35 absolute right-[20%] bottom-[31%] h-2.5 w-2.5 rounded-full border bg-white dark:bg-neutral-900" />
      </div>
    );
  }

  if (kind === "identity") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <span className="capability-art__identity-block border-foreground/25 absolute top-[27%] left-[27%] h-[38%] w-[38%] rounded-sm border" />
        <span className="capability-art__identity-block border-brand-line bg-brand-soft absolute right-[25%] bottom-[26%] h-[34%] w-[34%] rounded-sm border" />
        <span className="capability-art__identity-block bg-brand absolute top-[32%] left-[32%] h-2 w-2" />
      </div>
    );
  }

  if (kind === "ai-visual") {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute inset-[20%] grid grid-cols-4 gap-2 opacity-35">
          {Array.from({ length: 16 }, (_, index) => (
            <span
              key={index}
              className="capability-art__ai-dot bg-foreground/35 m-auto h-1 w-1 rounded-full"
              style={{ animationDelay: `${index * 70}ms` }}
            />
          ))}
        </div>
        <Sparkles
          className="text-brand-strong relative h-9 w-9"
          strokeWidth={1.35}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      aria-hidden="true"
    >
      <span className="border-foreground/20 h-[48%] w-[42%] rounded-sm border" />
      <span className="border-brand-line absolute h-[34%] w-[30%] translate-x-2 translate-y-2 rounded-sm border" />
      <ArrowUpRight
        className="capability-art__delivery-arrow text-brand-strong absolute h-5 w-5 translate-x-6 -translate-y-7"
        strokeWidth={1.5}
      />
    </div>
  );
}

function CapabilityCardContent({
  capability,
}: {
  capability: Capability;
}): ReactNode {
  return (
    <div className="border-foreground/6 bg-background/45 flex h-full flex-col rounded-xl border px-3.5 py-3.5 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between">
        <span className="text-brand-strong font-mono text-[11px] font-semibold sm:text-xs">
          {capability.number}
        </span>
        <span
          className="bg-brand h-1.5 w-1.5 rounded-full"
          aria-hidden="true"
        />
      </div>

      <div className="min-h-0 flex-1">
        <CapabilityArtwork kind={capability.kind} />
      </div>

      <div className="border-foreground/8 border-t pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[19px]">
            {capability.title}
          </p>
          <span className="text-foreground/38 hidden text-[9px] tracking-[0.08em] uppercase sm:inline">
            {capability.english}
          </span>
        </div>
        <p className="capability-card-summary text-foreground/48 mt-1 hidden min-h-4 text-[11px] leading-4 transition-colors duration-300 lg:block">
          {capability.description}
        </p>
        <p className="capability-card-detail text-foreground/62 mt-1.5 text-[10px] leading-[1.55] sm:text-[11px]">
          {capability.detail}
        </p>
      </div>
    </div>
  );
}

function CapabilityCardShell({
  capability,
  index,
  active,
  muted,
  awake,
  reducedMotion,
  onActivate,
  onHoverChange,
}: {
  capability: Capability;
  index: number;
  active: boolean;
  muted: boolean;
  awake: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onHoverChange: (index: number | null) => void;
}): ReactNode {
  const wakeOffset = WAKE_OFFSETS[index] ?? { x: 0, y: 0 };
  const initial = reducedMotion
    ? { opacity: 1, y: 0, filter: "blur(0px)", rotate: capability.rotate }
    : {
        opacity: 0,
        y: -90,
        filter: "blur(14px)",
        rotate: capability.rotate,
      };
  const animate = reducedMotion
    ? {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        rotate: capability.rotate,
      }
    : {
        opacity: muted ? 0.74 : 1,
        y: awake ? wakeOffset.y : 0,
        x: awake ? wakeOffset.x : 0,
        filter: "blur(0px)",
        rotate: capability.rotate,
      };
  const buttonStyle: CapabilityCardStyle = {
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
  };

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>): void {
    if (reducedMotion || event.pointerType === "touch") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 7;

    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${(-relativeY * maxTilt).toFixed(2)}deg`
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${(relativeX * maxTilt).toFixed(2)}deg`
    );
  }

  function resetTilt(event: PointerEvent<HTMLButtonElement>): void {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <motion.div
      className={`capability-card-shell ${index >= 4 ? "max-sm:hidden" : ""}`}
      initial={initial}
      animate={animate}
      transition={{
        duration: reducedMotion ? 0.01 : 0.8,
        delay: 0.04 + index * 0.07,
        ease: EASE,
      }}
      data-muted={muted ? "true" : undefined}
      style={{ zIndex: active || !muted ? 2 : 1 }}
    >
      <button
        type="button"
        className={CARD_CLASS}
        style={buttonStyle}
        aria-pressed={active}
        aria-label={`${capability.number} ${capability.title}，${capability.detail}`}
        data-active={active ? "true" : undefined}
        data-kind={capability.kind}
        onClick={onActivate}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") {
            onHoverChange(index);
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") {
            onHoverChange(null);
          }
          resetTilt(event);
        }}
        onFocus={() => onHoverChange(index)}
        onBlur={() => onHoverChange(null)}
      >
        <CapabilityCardContent capability={capability} />
      </button>
    </motion.div>
  );
}

export function PolaroidStrip(): ReactNode {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [awake, setAwake] = useState(false);

  if (!mounted) {
    return (
      <div aria-hidden="true" className="h-[clamp(17rem,18vw,21rem)] w-full" />
    );
  }

  return (
    <div
      className="capability-strip grid w-full grid-cols-2 items-start justify-center gap-x-4 gap-y-7 px-6 sm:flex sm:flex-wrap sm:gap-x-2 sm:gap-y-10 sm:px-8"
      aria-label="创作能力"
      onPointerEnter={(event) => {
        if (!prefersReducedMotion && event.pointerType !== "touch") {
          setAwake(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") {
          setAwake(false);
          setHoveredIndex(null);
        }
      }}
    >
      {CAPABILITIES.map((capability, index) => {
        const isActive = activeIndex === index;
        const isHovered = hoveredIndex === index;
        const muted =
          hoveredIndex !== null && !isHovered && activeIndex !== index;

        return (
          <CapabilityCardShell
            key={capability.number}
            capability={capability}
            index={index}
            active={isActive}
            muted={muted}
            awake={awake}
            reducedMotion={prefersReducedMotion}
            onActivate={() =>
              setActiveIndex((current) => (current === index ? null : index))
            }
            onHoverChange={setHoveredIndex}
          />
        );
      })}
    </div>
  );
}
