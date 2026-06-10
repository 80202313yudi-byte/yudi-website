import { Clapperboard, ImageIcon, LayoutPanelTop, Sparkles } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { MotionReveal } from "@/components/MotionReveal";
import { SectionHeading } from "@/components/SectionHeading";

const iconMap = {
  sparkles: Sparkles,
  image: ImageIcon,
  layout: LayoutPanelTop,
  play: Clapperboard,
};

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Capabilities"
          title="能力与服务"
          subtitle="围绕品牌、AI 图像、产品内容和视频策划，把创意从概念推进到可交付作品。"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];

            return (
              <MotionReveal
                key={item.title}
                delay={index * 0.05}
                className="capability-card surface-card flex min-h-[260px] flex-col rounded-[18px] bg-white/[0.035] p-7 md:p-8"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-white/[0.055] text-[#c0d98a]">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="heading-balance mt-8 text-xl font-semibold text-text">
                  {item.title}
                </h3>
                <p className="copy-pretty mt-4 text-[15px] leading-7 text-[#b5b5b5]">
                  {item.description}
                </p>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
