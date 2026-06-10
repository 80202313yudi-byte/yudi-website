import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCardLink } from "@/components/ProjectCardLink";
import { ProjectMedia } from "@/components/ProjectMedia";
import { SectionHeading } from "@/components/SectionHeading";

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
        <SectionHeading
          eyebrow="Selected Works"
          title="精选作品"
          subtitle="从品牌视觉到 AI 内容，以下项目记录了我如何把概念推进为可落地的成果。"
        />

        <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-12">
          {projects.map((project, index) => (
            <MotionReveal
              key={project.title}
              as="article"
              delay={index * 0.04}
              className={projectSpan[index]}
            >
              <ProjectCardLink
                href={`/works/${project.slug}`}
                className={`project-card group flex h-full min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-line bg-card ${
                  index === 0 ? "project-card-primary" : index === 1 ? "project-card-secondary" : ""
                }`}
                label={`查看 ${project.title} 案例`}
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
                    <h3 className={`font-semibold text-text ${index === 0 ? "text-3xl" : "text-2xl"}`}>
                      {project.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#adadad]">{project.description}</p>
                    {index < 2 ? (
                      <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-6 text-[#929292]">
                        {project.meta}
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
      </div>
    </section>
  );
}
