import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { PolaroidStrip } from "@/components/about/polaroid-strip";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "关于",
  description: "关于 FISHDI、视觉设计经验与 AI 内容创作方向。",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-312 pt-40 sm:pt-56">
        <PolaroidStrip />
      </section>

      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 sm:p-12">
            <h1 className="font-cjk-title text-foreground text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
              我是{" "}
              <span className="border-brand-line text-brand-strong border-b pb-0.5">
                于迪 / FISHDI
              </span>
              。
            </h1>
            <div className="text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
              <p>
                我是一名{" "}
                <strong className="text-brand-strong font-semibold">
                  视觉设计师与 AI 内容创作者
                </strong>
                ，长期关注品牌视觉、画册、海报、产品内容和数字页面。现在，我把{" "}
                <strong className="text-foreground font-semibold">
                  构图、信息层级与叙事节奏
                </strong>{" "}
                的经验带进 AI 视觉创作。
              </p>
              <p>
                我喜欢把模糊的想法整理成可被看见的作品：先确认内容要表达什么，再用版式、色彩、图像和动效建立清晰的观看路径。对我来说，AI
                不是替代审美判断的捷径，而是扩展创意探索的工具。
              </p>
              <p>
                接下来，我会围绕{" "}
                <strong className="text-brand-strong font-semibold">
                  AI 视觉、品牌设计、动漫、游戏、电影与未来科技
                </strong>{" "}
                持续创作，也开放品牌视觉、数字内容和个人实验相关合作。
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
