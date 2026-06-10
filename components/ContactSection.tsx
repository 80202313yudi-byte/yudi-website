import { ArrowRight, Mail } from "lucide-react";
import { contactLinks } from "@/data/site";
import { MagneticLink } from "@/components/MagneticLink";
import { MotionReveal } from "@/components/MotionReveal";

export function ContactSection() {
  return (
    <section id="contact" className="section-pad">
      <div className="section-shell">
        <MotionReveal>
          <div className="contact-panel relative overflow-hidden rounded-[22px] border border-white/10 p-7 shadow-panel md:p-12">
            <div className="relative z-10 max-w-3xl">
              <span className="eyebrow">Contact</span>
              <h2 className="heading-balance mt-6 text-4xl font-semibold leading-tight text-text md:text-5xl">
                有想法，一起把它做出来。
              </h2>
              <p className="copy-pretty mt-6 max-w-[36em] text-base leading-8 text-[#bcbcbc]">
                开放品牌视觉、AI 内容和
                <span className="phrase-nowrap">数字产品合作，</span>
                欢迎聊聊有趣的想法。
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <MagneticLink href={contactLinks[0].href}>
                  <Mail size={18} aria-hidden="true" />
                  {contactLinks[0].label}
                </MagneticLink>
                <a className="btn-secondary" href={contactLinks[1].href}>
                  {contactLinks[1].label}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
