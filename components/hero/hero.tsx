import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import GradualBlur from "@/components/ui/gradual-blur";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import RotatingText from "@/components/ui/rotating-text";
import { PortraitMorph } from "./portrait-morph";

const PORTRAIT_SRC = "/josh.webp";
const PORTRAIT_HOVER_SRC = "/josh_wave.webp";
const POSITIONING_KEYWORDS = [
  "AI 视觉系统",
  "品牌识别设计",
  "内容封面包装",
  "作品页面设计",
];

export function Hero(): ReactNode {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto w-full max-w-275 px-6 pt-44 pb-24 sm:px-10 sm:pt-56 sm:pb-32">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <p className="text-[20px] leading-tight tracking-tight font-medium text-foreground">
              你好
              <span aria-hidden="true" className="mx-0.5">
                👋
              </span>
              ，我是于迪 /{" "}
              <span className="text-brand-strong">FISHDI</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[15px] leading-none tracking-tight text-foreground/55">
              <span>聚焦</span>
              <RotatingText
                texts={POSITIONING_KEYWORDS}
                splitBy="lines"
                staggerDuration={0}
                rotationInterval={2700}
                srText={`定位关键词：${POSITIONING_KEYWORDS.join("、")}`}
                mainClassName="hero-positioning-keyword min-h-8 items-center overflow-hidden rounded-full border border-foreground/10 bg-background/75 px-3 py-1 font-medium text-brand-strong shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.035]"
                splitLevelClassName="overflow-hidden pb-0.5"
                elementLevelClassName="leading-none"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ type: "spring", damping: 32, stiffness: 360 }}
              />
            </div>

            <h1 className="text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block whitespace-nowrap">
                <span className="text-brand-strong">AI 视觉</span>设计 /
              </span>
              <span className="block whitespace-nowrap">品牌内容设计</span>
            </h1>

            <p className="max-w-[34ch] text-[22px] leading-[1.4] tracking-tight text-foreground/65">
              把角色设定、品牌信息和<span className="whitespace-nowrap">内容创意</span>，整理成可发布的图像、页面与封面系统。
            </p>

            <HeroCtas />

            <p className="max-w-[38ch] text-[14px] leading-[1.55] tracking-tight text-foreground/52">
              项目覆盖封面主视觉、页面设计、品牌延展与{" "}
              <span className="whitespace-nowrap">AI 图像探索</span>。
            </p>
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <div className="relative aspect-square w-full md:max-w-105 overflow-hidden rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm">
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt="FISHDI 个人视觉肖像"
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </div>
      <GradualBlur
        target="parent"
        position="bottom"
        height="5.5rem"
        strength={1.2}
        divCount={5}
        curve="bezier"
        exponential={false}
        opacity={0.7}
        zIndex={10}
      />
    </section>
  );
}
