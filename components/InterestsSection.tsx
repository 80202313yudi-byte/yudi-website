import { interests } from "@/data/site";
import { MotionReveal } from "@/components/MotionReveal";
import { SectionHeading } from "@/components/SectionHeading";

export function InterestsSection() {
  return (
    <section className="section-pad research-section">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Research Directions"
          title="我正在研究的内容方向"
          subtitle={
            <>
              它们持续影响我的视觉判断与叙事方式，也构成下一阶段
              <span className="phrase-nowrap">内容创作的线索。</span>
            </>
          }
        />

        <div className="interest-list border-y border-white/10">
          {interests.map((item, index) => (
            <MotionReveal
              key={item.title}
              delay={index * 0.05}
              className="interest-row grid gap-4 border-b border-white/[0.08] py-7 last:border-b-0 md:grid-cols-[96px_0.65fr_1.35fr] md:items-center md:gap-7 md:py-9"
            >
              <span className="text-4xl font-semibold text-[#c1d994]">
                0{index + 1}
              </span>
              <h3 className="heading-balance text-2xl font-semibold text-text">{item.title}</h3>
              <p className="copy-pretty max-w-[34em] text-[15px] leading-7 text-[#b5b5b5]">
                {item.description}
              </p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
