import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCardLink } from "@/components/ProjectCardLink";
import { ProjectMedia } from "@/components/ProjectMedia";
import { ProjectReturnRestorer } from "@/components/ProjectReturnRestorer";
import { getProjectCardId } from "@/data/projectNavigation";

const projectSpan = [
  "lg:col-span-8",
  "lg:col-span-4",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-6",
];

export function FeaturedWorks() {
  return (
    <section id="works" className="section-pad">
      <div className="section-shell">
        <div className="section-heading mb-8 grid gap-5 md:mb-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,430px)] md:items-end md:gap-10 lg:gap-20">
          <div>
            <span className="eyebrow">Case Studies</span>
            <h2 className="heading-balance section-title mt-5 font-semibold text-text">
              项目案例
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-start">
            <p className="copy-pretty section-description">
              从概念到落地，记录我如何把想法推进成真实作品。
            </p>
          </div>
        </div>

        <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-12">
          {projects.map((project, index) => (
            <MotionReveal
              key={project.title}
              as="article"
              id={getProjectCardId(project.slug)}
              delay={index * 0.04}
              className={`project-card-anchor ${projectSpan[index]}`}
            >
              <ProjectCardLink
                href={`/works/${project.slug}`}
                className={`project-card group flex h-full min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-line bg-card ${
                  index === 0 ? "project-card-primary" : index === 1 ? "project-card-secondary" : ""
                }`}
                label={`查看 ${project.caseTitle} 案例`}
                slug={project.slug}
              >
                <ProjectMedia
                  media={project.cover}
                  variant="cover"
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  }
                />
                <div className="project-card-info flex flex-1 flex-col gap-5 border-t border-white/[0.07] bg-card p-6 md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="project-type">{project.type}</span>
                    <span className="text-xs text-[#9f9f9f]">{project.nature}</span>
                  </div>
                  <div>
                    <h3
                      className={`heading-balance font-semibold text-text ${
                        index === 0 ? "text-3xl" : "text-2xl"
                      }`}
                    >
                      {project.caseTitle}
                    </h3>
                    <p className="copy-pretty mt-3 text-[15px] leading-7 text-[#adadad]">
                      {project.caseDescription}
                    </p>
                    {index < 2 ? (
                      <p className="copy-pretty mt-4 border-t border-white/[0.07] pt-4 text-xs leading-6 text-[#929292]">
                        {project.caseMeta} · {project.year}
                      </p>
                    ) : null}
                  </div>
                  <span className="project-cta mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d2d2d2]">
                    查看案例
                    <ArrowUpRight className="project-cta-icon" size={17} aria-hidden="true" />
                  </span>
                </div>
              </ProjectCardLink>
            </MotionReveal>
          ))}
        </div>

        <div className="case-studies-footer">
          <p className="case-studies-footer-text">已展示 6 个代表项目</p>
          <Link href="/works" className="case-studies-all-link">
            查看全部作品
            <ArrowUpRight className="case-studies-all-link-icon" size={16} aria-hidden="true" />
          </Link>
        </div>
        <ProjectReturnRestorer />
      </div>
    </section>
  );
}
