import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ProjectCardLink } from "@/components/ProjectCardLink";
import { ProjectMedia } from "@/components/ProjectMedia";
import { ProjectReturnRestorer } from "@/components/ProjectReturnRestorer";
import { getProjectCardId } from "@/data/projectNavigation";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "全部作品 | FISHDI",
  description: "持续整理品牌视觉、AI 内容、界面设计与数字创作相关项目。",
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    title: "全部作品 | FISHDI",
    description: "持续整理品牌视觉、AI 内容、界面设计与数字创作相关项目。",
    url: "/works",
  },
};

export default function WorksPage() {
  return (
    <>
      <main className="pb-12 pt-32 md:pb-20 md:pt-36">
        <section className="section-shell">
          <div className="works-archive-hero">
            <Link href="/#works" className="case-back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              返回首页项目案例
            </Link>
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <span className="eyebrow">Works Archive</span>
                <h1 className="heading-balance mt-6 text-5xl font-semibold leading-tight text-text md:text-6xl">
                  全部作品
                </h1>
              </div>
              <p className="copy-pretty max-w-[34em] text-base leading-8 text-[#bdbdbd] lg:ml-auto">
                持续整理品牌视觉、AI 内容、界面设计与数字创作相关项目。
              </p>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <div className="works-archive-grid grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.slug}
                  id={getProjectCardId(project.slug)}
                  className="project-card-anchor"
                >
                  <ProjectCardLink
                    href={`/works/${project.slug}`}
                    slug={project.slug}
                    label={`查看 ${project.caseTitle} 案例`}
                    className="project-card group flex h-full min-h-[430px] flex-col overflow-hidden rounded-[20px] border border-line bg-card"
                  >
                    <ProjectMedia
                      media={project.cover}
                      variant="cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="flex flex-1 flex-col gap-5 border-t border-white/[0.07] bg-card p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="project-type">{project.type}</span>
                        <span className="text-xs text-[#9f9f9f]">{project.year}</span>
                      </div>
                      <div>
                        <h2 className="heading-balance text-2xl font-semibold text-text">
                          {project.caseTitle}
                        </h2>
                        <p className="copy-pretty mt-3 text-[15px] leading-7 text-[#adadad]">
                          {project.caseDescription}
                        </p>
                        <p className="copy-pretty mt-4 border-t border-white/[0.07] pt-4 text-xs leading-6 text-[#929292]">
                          {project.caseMeta}
                        </p>
                      </div>
                      <span className="project-cta mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d2d2d2]">
                        查看案例
                        <ArrowUpRight
                          className="project-cta-icon"
                          size={17}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </ProjectCardLink>
                </article>
              ))}
            </div>
            <ProjectReturnRestorer />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
