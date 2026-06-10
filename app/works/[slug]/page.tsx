import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ProjectDetailIntro } from "@/components/ProjectDetailIntro";
import { ProjectDetailTransition } from "@/components/ProjectDetailTransition";
import { ProjectMedia } from "@/components/ProjectMedia";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "项目不存在 | FISHDI" };
  }

  return {
    title: `${project.title} | FISHDI`,
    description: project.description,
    openGraph: {
      title: `${project.title} | FISHDI`,
      description: project.description,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <>
      <ProjectDetailTransition className="pb-12 pt-32 md:pb-20 md:pt-36">
        <ScrollToTop pathKey={project.slug} />
        <ProjectDetailIntro project={project} />

        <section className="section-pad">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
            <div>
              <span className="eyebrow">Context</span>
              <h2 className="mt-5 text-3xl font-semibold text-text md:text-4xl">项目为什么做</h2>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <article>
                <h3 className="text-xl font-semibold text-text">项目背景</h3>
                <p className="mt-4 text-base leading-8 text-[#b8b8b8]">{project.background}</p>
              </article>
              <article>
                <h3 className="text-xl font-semibold text-text">核心问题</h3>
                <p className="mt-4 text-base leading-8 text-[#b8b8b8]">{project.challenge}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <div className="mb-9 max-w-2xl">
              <span className="eyebrow">Creative Process</span>
              <h2 className="mt-5 text-4xl font-semibold text-text md:text-5xl">如何推进与解决</h2>
              <p className="mt-5 text-base leading-8 text-[#b8b8b8]">
                从方向判断开始，把探索过程逐步收敛为可以验证、复用和交付的设计结果。
              </p>
            </div>
            <ol className="grid gap-5 md:grid-cols-3">
              {project.process.map((step, index) => (
                <li
                  key={step}
                  className="process-step min-h-56 rounded-[18px] bg-white/[0.03] p-7"
                >
                  <span className="text-2xl font-semibold text-[#c2d994]">0{index + 1}</span>
                  <div className="my-6 h-px w-full bg-white/[0.08]" />
                  <p className="text-base leading-8 text-[#b8b8b8]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
              <div className="flex flex-col justify-center">
                <span className="eyebrow">Final Outcome</span>
                <h2 className="mt-6 text-4xl font-semibold text-text md:text-5xl">最终成果与交付</h2>
                <p className="mt-5 text-base leading-8 text-[#b8b8b8]">{project.outcome}</p>
                <ul className="mt-7 space-y-3 text-[15px] text-[#b8b8b8]">
                  {project.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-center gap-3">
                      <Check size={17} className="text-accent" aria-hidden="true" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {project.gallery.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-[20px] bg-card-soft">
                    <ProjectMedia
                      media={image}
                      variant="gallery"
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                    {image.label ? (
                      <figcaption className="border-t border-white/[0.07] px-5 py-4 text-xs leading-6 text-[#989898]">
                        {image.label}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <div className="case-summary rounded-[22px] bg-white/[0.035] p-7 md:p-10">
              <span className="eyebrow">Project Summary</span>
              <h2 className="mt-6 text-3xl font-semibold text-text md:text-4xl">项目总结</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#c0c0c0]">{project.summary}</p>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <nav aria-label="项目切换" className="grid gap-4 md:grid-cols-2">
              <Link
                href={`/works/${previousProject.slug}`}
                className="case-navigation rounded-[18px] border border-line bg-card p-6"
              >
                <span className="flex items-center gap-2 text-sm text-[#b9c996]">
                  <ArrowLeft size={16} aria-hidden="true" />
                  上一个项目
                </span>
                <strong className="mt-4 block text-xl text-text">{previousProject.title}</strong>
              </Link>
              <Link
                href={`/works/${nextProject.slug}`}
                className="case-navigation rounded-[18px] border border-line bg-card p-6 md:text-right"
              >
                <span className="flex items-center gap-2 text-sm text-[#b9c996] md:justify-end">
                  下一个项目
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
                <strong className="mt-4 block text-xl text-text">{nextProject.title}</strong>
              </Link>
            </nav>

            <div className="contact-panel mt-8 rounded-[22px] border border-white/10 p-7 shadow-panel md:p-10">
              <span className="eyebrow">Contact</span>
              <h2 className="mt-6 text-4xl font-semibold text-text md:text-5xl">想做类似的项目？</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#bcbcbc]">
                欢迎聊聊项目目标、视觉方向和内容需求，一起把想法推进成可见的作品。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/#contact" className="btn-primary">
                  <Mail size={18} aria-hidden="true" />
                  联系合作
                </Link>
                <Link href="/#works" className="btn-secondary">
                  查看更多作品
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ProjectDetailTransition>
      <Footer />
    </>
  );
}
