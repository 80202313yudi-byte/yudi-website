"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ProjectMedia } from "@/components/ProjectMedia";
import { useProjectDetailTransition } from "@/components/ProjectDetailTransition";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";
import type { Project } from "@/data/projects";

type ProjectDetailIntroProps = {
  project: Pick<
    Project,
    "cover" | "description" | "nature" | "role" | "title" | "type" | "year"
  >;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectDetailIntro({ project }: ProjectDetailIntroProps) {
  const reduceMotion = useHydratedReducedMotion();
  const { exiting, returnToWorks } = useProjectDetailTransition();
  const initial = reduceMotion ? false : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };
  const transition = (delay: number) => ({
    duration: reduceMotion ? 0.08 : 0.36,
    delay: reduceMotion ? 0 : delay,
    ease,
  });

  return (
    <section className="section-shell">
      <button
        type="button"
        className="case-back-link"
        aria-label="返回之前浏览的作品位置"
        disabled={exiting}
        onClick={returnToWorks}
      >
        <ArrowLeft size={17} aria-hidden="true" />
        返回作品列表
      </button>

      <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <motion.h1
            className="max-w-4xl text-5xl font-semibold leading-tight text-text md:text-7xl"
            initial={initial}
            animate={animate}
            transition={transition(0)}
          >
            {project.title}
          </motion.h1>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={initial}
            animate={animate}
            transition={transition(0.05)}
          >
            <span className="eyebrow">{project.type}</span>
            <span className="text-sm text-[#a9a9a9]">{project.nature}</span>
          </motion.div>

          <motion.p
            className="mt-6 max-w-3xl text-base leading-8 text-[#bdbdbd] md:text-lg"
            initial={initial}
            animate={animate}
            transition={transition(0.1)}
          >
            {project.description}
          </motion.p>
        </div>

        <motion.dl
          className="case-meta border-y border-white/10 py-2"
          initial={initial}
          animate={animate}
          transition={transition(0.05)}
        >
          <div className="grid grid-cols-[84px_1fr] gap-5 border-b border-white/[0.07] py-4">
            <dt className="text-sm text-[#949494]">年份</dt>
            <dd className="text-sm font-semibold text-text">{project.year}</dd>
          </div>
          <div className="grid grid-cols-[84px_1fr] gap-5 border-b border-white/[0.07] py-4">
            <dt className="text-sm text-[#949494]">类型</dt>
            <dd className="text-sm font-semibold text-text">{project.nature}</dd>
          </div>
          <div className="grid grid-cols-[84px_1fr] gap-5 py-4">
            <dt className="text-sm text-[#949494]">职责</dt>
            <dd className="text-sm font-semibold leading-6 text-text">{project.role}</dd>
          </div>
        </motion.dl>
      </div>

      <motion.div
        className="mt-12"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.08 : 0.4, delay: reduceMotion ? 0 : 0.04, ease }}
      >
        <ProjectMedia
          media={project.cover}
          variant="hero"
          sizes="(max-width: 1152px) 100vw, 1152px"
          priority
        />
      </motion.div>
    </section>
  );
}
