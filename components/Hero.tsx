"use client";

import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticLink } from "@/components/MagneticLink";
import { TypewriterIntro } from "@/components/TypewriterIntro";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";

export function Hero() {
  const reduceMotion = useHydratedReducedMotion();

  return (
    <section
      id="home"
      className="hero-section relative overflow-hidden"
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] xl:gap-14">
        <div className="relative z-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase text-accent"
          >
            FISHDI · AI × DESIGN · CREATION
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="hero-heading max-w-3xl font-semibold text-text"
          >
            <span className="block">把想法，</span>
            <span className="block">变成可以被</span>
            <span className="block whitespace-nowrap">
              <span className="text-accent">看见</span>的作品。
            </span>
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl"
          >
            <TypewriterIntro />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <MagneticLink href="#works">
              查看作品
              <ArrowRight size={18} aria-hidden="true" />
            </MagneticLink>
            <a className="btn-secondary" href="#about">
              <Play size={17} aria-hidden="true" />
              了解更多
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.64, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[560px]"
        >
          <div className="visual-shell w-full">
            <Image
              src="/images/hero-visual.svg"
              alt="抽象黑白 AI 视觉图形"
              width={720}
              height={720}
              priority
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
