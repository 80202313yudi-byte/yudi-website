import {
  ArrowRight,
  Bot,
  Compass,
  Layers,
  LineChart,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";
import { NoOrphanText } from "@/components/ui/no-orphan-text";
import { projects, type Project, type ProjectIcon } from "@/lib/projects";

export type ProjectsProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const items = viewMoreVisible ? projects.slice(0, 4) : projects;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="font-cjk-title text-foreground text-[2.5rem] leading-[1.08] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
              精选项目
            </h2>
            <p className="text-foreground/65 max-w-[33ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
              从品牌视觉到{" "}
              <span className="text-brand-strong font-medium">AI 内容</span>
              ，记录我如何把概念推进成
              <span className="whitespace-nowrap">可见的作品</span>。
            </p>
          </FadeIn>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="focus-ring group border-foreground/8 bg-background text-foreground hover:border-brand-line hover:bg-brand-soft hover:text-brand-strong inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              查看全部
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}): ReactNode {
  const Icon = PROJECT_ICONS[project.icon];
  return (
    <FadeIn delay={Math.min(index * 0.06, 0.3)} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        data-project-card={project.slug}
        className="project-card focus-ring border-foreground/8 bg-background flex h-full cursor-pointer flex-col gap-4 rounded-3xl border p-3 text-left no-underline sm:p-3.5"
        aria-label={`查看${project.category}项目详情`}
      >
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="border-brand-line bg-brand-soft inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
            <Icon
              className="text-brand-strong h-3.5 w-3.5"
              aria-hidden="true"
            />
          </span>
          <span className="text-brand-strong text-sm font-medium tracking-tight">
            {project.iconLabel}
          </span>
        </header>

        <div
          className="project-card__image ring-foreground/5 bg-foreground/5 relative w-full overflow-hidden rounded-2xl ring-1"
          style={{ aspectRatio: project.coverRatio }}
        >
          <div className="project-card__image-inner">
            <Image
              src={project.cover}
              alt={project.coverAlt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw"
              className="object-cover"
              priority={index < 2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-foreground text-[20px] leading-[1.2] font-medium tracking-tight sm:text-[22px]">
            <NoOrphanText text={project.title} />
          </h3>
          <p className="text-foreground/65 text-[14px] leading-normal tracking-tight sm:text-[15px]">
            <NoOrphanText text={project.description} tailLength={5} />
          </p>
        </div>

        <p className="border-brand-line/60 text-foreground/50 mt-auto border-t px-1 pt-3 pb-2 text-[12px] tracking-tight">
          {project.meta}
        </p>
      </Link>
    </FadeIn>
  );
}

const PROJECT_ICONS: Record<
  ProjectIcon,
  ComponentType<{ className?: string }>
> = {
  "brand-system": Sparkles,
  editorial: Compass,
  "ai-visual": LineChart,
  "ui-concept": Wand2,
  "motion-content": Layers,
  "personal-brand": Bot,
};
