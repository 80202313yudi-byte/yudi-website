import Image from "next/image";
import { skillTags } from "@/data/site";
import { MotionReveal } from "@/components/MotionReveal";

export function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="section-shell">
        <MotionReveal className="about-layout grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="flex h-full flex-col justify-center">
            <span className="eyebrow">About FISHDI</span>
            <h2 className="about-title heading-balance mt-6 font-semibold text-text">
              <span className="title-line">
                把<span className="phrase-nowrap">设计经验，</span>
              </span>
              <span className="title-line">
                带进 <span className="phrase-nowrap">AI 内容创作。</span>
              </span>
            </h2>
            <p className="about-copy copy-pretty mt-6 text-[#b8b8b8]">
              我是 FISHDI。过去几年，我持续从事品牌视觉、画册、海报与产品内容设计。现在，我把构图、信息层级与叙事节奏的经验，带进 AI 视觉创作。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="about-visual relative min-h-[420px] overflow-hidden rounded-[22px] bg-card-soft lg:min-h-[500px]">
            <Image
              src="/images/portrait-placeholder.svg"
              alt=""
              width={820}
              height={980}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 border-t border-white/15 pt-4 text-xs text-[#bcbcbc]">
              <strong className="text-sm tracking-normal text-text">FISHDI</strong>
              <span className="leading-5 text-left">
                Visual systems
                <br />
                AI narratives
              </span>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
