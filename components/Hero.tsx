"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { HeroWorksWall } from "@/components/HeroWorksWall";
import { MagneticLink } from "@/components/MagneticLink";
import { TypewriterIntro } from "@/components/TypewriterIntro";

export function Hero() {
  return (
    <section
      id="home"
      className="hero-section relative overflow-hidden"
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="section-shell hero-grid grid items-center">
        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase text-accent">
            设计 × 创意 × 科技
          </div>

          <h1 className="hero-heading max-w-3xl font-semibold text-text">
            <span className="block">把想法，</span>
            <span className="block">变成可以被</span>
            <span className="block whitespace-nowrap">
              <span className="text-accent">看见</span>的作品。
            </span>
          </h1>

          <div className="mt-6 grid max-w-[34em] gap-5">
            <TypewriterIntro />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href="#works">
              查看我的作品
              <ArrowRight size={18} aria-hidden="true" />
            </MagneticLink>
            <a className="btn-secondary" href="#about">
              了解更多关于我
            </a>
          </div>

          <p className="hero-scroll-cue mt-10 inline-flex items-center gap-2 text-xs font-semibold text-[#8e8e8e]">
            向下滚动，探索更多
            <ArrowDown size={14} aria-hidden="true" />
          </p>
        </div>

        <div className="hero-works-wall-frame relative z-10 mx-auto w-full">
          <HeroWorksWall />
        </div>
      </div>
    </section>
  );
}
