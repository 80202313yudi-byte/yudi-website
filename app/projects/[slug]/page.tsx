import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Layers,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { ProjectImageLightbox } from "@/components/projects/project-image-lightbox";
import { ProjectReturnLink } from "@/components/projects/project-return-link";
import { FadeIn } from "@/components/ui/motion-primitives";
import { NoOrphanText } from "@/components/ui/no-orphan-text";
import { createMetadata } from "@/lib/metadata";
import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
  type Project,
} from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createMetadata({
      title: "项目不存在",
      description: "没有找到对应的作品项目。",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: project.category,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.cover,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { previous, next } = getAdjacentProjects(project.slug);
  const galleryImages = [project.heroImage, ...project.detailImages];

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ProjectHeader project={project} galleryImages={galleryImages} />
      <ProjectDetails project={project} galleryImages={galleryImages} />
      <ProjectPager previous={previous} next={next} />
      <section className="mx-auto flex w-full max-w-275 justify-center px-6 pb-12 sm:px-10 sm:pb-16">
        <ProjectReturnLink slug={project.slug} placement="bottom" />
      </section>
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

function ProjectHeader({
  project,
  galleryImages,
}: {
  project: Project;
  galleryImages: Project["detailImages"];
}): ReactNode {
  return (
    <article className="mx-auto w-full max-w-275 px-6 pt-40 pb-10 sm:px-10 sm:pt-48 sm:pb-14 lg:pt-56">
      <FadeIn className="flex flex-col gap-8">
        <ProjectReturnLink slug={project.slug} placement="top" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="text-brand-strong text-sm font-medium tracking-tight">
              {project.iconLabel} / {project.year}
            </p>
            <h1 className="font-cjk-title text-foreground text-[2.75rem] leading-[1.08] font-medium tracking-tight sm:text-[3.5rem] lg:text-[4.5rem]">
              <NoOrphanText text={project.title} />
            </h1>
            <p className="text-foreground/65 max-w-[42rem] text-[17px] leading-[1.65] tracking-tight sm:text-[19px]">
              <NoOrphanText text={project.description} tailLength={5} />
            </p>
          </div>

          <dl className="border-foreground/8 bg-background grid gap-3 rounded-3xl border p-4 shadow-sm sm:p-5">
            <ProjectMetaItem
              icon={Layers}
              label="项目类型"
              value={project.category}
            />
            <ProjectMetaItem
              icon={UserRound}
              label="我的职责"
              value={project.roles?.join(" / ") ?? "视觉设计"}
            />
            <ProjectMetaItem
              icon={CalendarDays}
              label="项目时间"
              value={project.year}
            />
          </dl>
        </div>

        <ProjectImageLightbox
          image={project.heroImage}
          galleryImages={galleryImages}
          galleryIndex={0}
          priority
          large
          edgeBlur
        />
      </FadeIn>
    </article>
  );
}

function ProjectDetails({
  project,
  galleryImages,
}: {
  project: Project;
  galleryImages: Project["detailImages"];
}): ReactNode {
  return (
    <section className="mx-auto w-full max-w-275 px-6 pb-12 sm:px-10 sm:pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.45fr_1fr] lg:gap-10">
        <FadeIn className="border-foreground/8 bg-background flex flex-col gap-5 rounded-3xl border p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-brand-strong text-sm font-medium tracking-tight">
              Project Note
            </p>
            <h2 className="text-foreground mt-2 text-[26px] leading-tight font-medium tracking-tight sm:text-[32px]">
              简短项目说明
            </h2>
          </div>
          <p className="text-foreground/65 text-[15px] leading-[1.75] tracking-tight sm:text-[16px]">
            <NoOrphanText
              text={project.summary ?? project.description}
              tailLength={5}
            />
          </p>
          {project.deliverables?.length ? (
            <ul className="border-brand-line/60 mt-auto flex flex-wrap gap-2 border-t pt-5">
              {project.deliverables.map((item) => (
                <li
                  key={item}
                  className="border-brand-line bg-brand-soft text-brand-strong rounded-full border px-3 py-1.5 text-sm tracking-tight"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2">
          {project.detailImages.map((image, index) => (
            <FadeIn
              key={`${image.src}-${image.alt}-${index}`}
              delay={Math.min(index * 0.06, 0.24)}
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <ProjectImageLightbox
                image={image}
                galleryImages={galleryImages}
                galleryIndex={index + 1}
                large={index === 0}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectMetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}): ReactNode {
  return (
    <div className="border-foreground/6 bg-foreground/[0.025] flex gap-3 rounded-2xl border p-3">
      <span className="border-brand-line bg-brand-soft inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
        <Icon className="text-brand-strong h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-brand-strong text-[12px] tracking-tight">
          {label}
        </dt>
        <dd className="text-foreground/80 mt-1 text-sm leading-snug tracking-tight">
          {value}
        </dd>
      </div>
    </div>
  );
}

function ProjectPager({
  previous,
  next,
}: {
  previous: Project | null;
  next: Project | null;
}): ReactNode {
  return (
    <section className="mx-auto w-full max-w-275 px-6 pb-4 sm:px-10 sm:pb-8">
      <FadeIn className="grid gap-4 sm:grid-cols-2">
        <ProjectPagerLink project={previous} direction="previous" />
        <ProjectPagerLink project={next} direction="next" />
      </FadeIn>
    </section>
  );
}

function ProjectPagerLink({
  project,
  direction,
}: {
  project: Project | null;
  direction: "previous" | "next";
}): ReactNode {
  if (!project) {
    return (
      <div className="border-foreground/6 bg-foreground/[0.02] text-foreground/35 rounded-3xl border p-5 text-sm tracking-tight sm:p-6">
        {direction === "previous" ? "已经是第一个项目" : "已经是最后一个项目"}
      </div>
    );
  }

  const isPrevious = direction === "previous";

  return (
    <Link
      href={`/projects/${project.slug}?from=projects`}
      scroll={true}
      className="project-card focus-ring group border-foreground/8 bg-background flex min-h-34 flex-col justify-between rounded-3xl border p-5 no-underline shadow-sm sm:p-6"
    >
      <span className="text-foreground/55 group-hover:text-brand-strong inline-flex items-center gap-2 text-sm font-medium tracking-tight transition-colors">
        {isPrevious ? (
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        ) : null}
        {isPrevious ? "上一个项目" : "下一个项目"}
        {!isPrevious ? (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        ) : null}
      </span>
      <span className="text-foreground mt-5 text-[20px] leading-tight font-medium tracking-tight sm:text-[22px]">
        <NoOrphanText text={project.category} />
      </span>
    </Link>
  );
}
