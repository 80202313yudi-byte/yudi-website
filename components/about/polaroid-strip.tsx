"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

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
  rotate: number;
  kind: CapabilityKind;
};

const CAPABILITIES: Capability[] = [
  {
    number: "01",
    title: "构图",
    english: "Composition",
    description: "平衡画面重心",
    rotate: -6,
    kind: "composition",
  },
  {
    number: "02",
    title: "层级",
    english: "Hierarchy",
    description: "建立阅读顺序",
    rotate: 4,
    kind: "hierarchy",
  },
  {
    number: "03",
    title: "叙事",
    english: "Storytelling",
    description: "组织观看节奏",
    rotate: -3,
    kind: "storytelling",
  },
  {
    number: "04",
    title: "品牌",
    english: "Identity",
    description: "统一识别线索",
    rotate: 5,
    kind: "identity",
  },
  {
    number: "05",
    title: "AI 视觉",
    english: "AI Visual",
    description: "扩展视觉方向",
    rotate: -4,
    kind: "ai-visual",
  },
  {
    number: "06",
    title: "交付",
    english: "Delivery",
    description: "推进可用成果",
    rotate: 4,
    kind: "delivery",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_CLASS =
  "group relative aspect-[3/4] w-[clamp(8.4rem,14vw,11rem)] shrink-0 overflow-hidden rounded-2xl border-[5px] border-neutral-300/35 bg-white p-1.5 shadow-[0_12px_30px_rgba(10,10,10,0.035)] dark:border-white/12 dark:bg-neutral-900 dark:shadow-none";

function CapabilityArtwork({ kind }: { kind: CapabilityKind }): ReactNode {
  if (kind === "composition") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <span className="border-foreground/20 absolute inset-[18%] rounded-sm border" />
        <span className="border-foreground/10 absolute top-[18%] bottom-[18%] left-1/2 border-l" />
        <span className="border-foreground/10 absolute top-1/2 right-[18%] left-[18%] border-t" />
        <span className="border-brand-line bg-brand-soft absolute top-[28%] right-[25%] h-5 w-5 rounded-full border" />
      </div>
    );
  }

  if (kind === "hierarchy") {
    return (
      <div
        className="flex h-full w-full flex-col justify-center gap-2.5 px-[18%]"
        aria-hidden="true"
      >
        <span className="bg-foreground/70 h-1.5 w-4/5 rounded-full" />
        <span className="bg-foreground/20 h-px w-full" />
        <span className="bg-foreground/15 h-px w-3/4" />
        <span className="bg-brand h-px w-1/2" />
      </div>
    );
  }

  if (kind === "storytelling") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <span className="bg-foreground/15 absolute top-1/2 right-[18%] left-[18%] h-px -rotate-12" />
        <span className="border-foreground/35 absolute top-[34%] left-[20%] h-2.5 w-2.5 rounded-full border bg-white dark:bg-neutral-900" />
        <span className="bg-brand absolute top-[49%] left-[46%] h-2.5 w-2.5 rounded-full" />
        <span className="border-foreground/35 absolute right-[20%] bottom-[31%] h-2.5 w-2.5 rounded-full border bg-white dark:bg-neutral-900" />
      </div>
    );
  }

  if (kind === "identity") {
    return (
      <div className="relative h-full w-full" aria-hidden="true">
        <span className="border-foreground/25 absolute top-[27%] left-[27%] h-[38%] w-[38%] rounded-sm border" />
        <span className="border-brand-line bg-brand-soft absolute right-[25%] bottom-[26%] h-[34%] w-[34%] rounded-sm border" />
        <span className="bg-brand absolute top-[32%] left-[32%] h-2 w-2" />
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
              className="bg-foreground/35 m-auto h-1 w-1 rounded-full"
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
        className="text-brand-strong absolute h-5 w-5 translate-x-6 -translate-y-7"
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
        <p className="text-foreground/48 group-hover:text-foreground/68 mt-1 hidden min-h-4 text-[11px] leading-4 transition-colors duration-300 lg:block">
          {capability.description}
        </p>
      </div>
    </div>
  );
}

function MotionCapabilityCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}): ReactNode {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: -90,
        filter: "blur(14px)",
        rotate: capability.rotate,
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        rotate: capability.rotate,
      }}
      whileHover={{ y: -6, rotate: capability.rotate * 0.65 }}
      transition={{
        duration: 0.8,
        delay: 0.04 + index * 0.07,
        ease: EASE,
      }}
      className={CARD_CLASS}
    >
      <CapabilityCardContent capability={capability} />
    </motion.article>
  );
}

function StaticCapabilityCard({
  capability,
}: {
  capability: Capability;
}): ReactNode {
  return (
    <article
      style={{ transform: `rotate(${capability.rotate}deg)` }}
      className={CARD_CLASS}
    >
      <CapabilityCardContent capability={capability} />
    </article>
  );
}

export function PolaroidStrip(): ReactNode {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const prefersReducedMotion = useReducedMotion();

  if (!mounted) {
    return (
      <div aria-hidden="true" className="h-[clamp(17rem,18vw,21rem)] w-full" />
    );
  }

  return (
    <div
      className="flex w-full flex-wrap items-start justify-center gap-x-1.5 gap-y-8 px-5 sm:gap-x-2 sm:gap-y-10 sm:px-8"
      aria-label="创作能力"
    >
      {CAPABILITIES.map((capability, index) =>
        prefersReducedMotion ? (
          <StaticCapabilityCard
            key={capability.number}
            capability={capability}
          />
        ) : (
          <MotionCapabilityCard
            key={capability.number}
            capability={capability}
            index={index}
          />
        )
      )}
    </div>
  );
}
