import { ArrowLeft, ArrowRight, CalendarDays, Layers, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import GradualBlur from "@/components/ui/gradual-blur";
import { FadeIn } from "@/components/ui/motion-primitives";
import { NoOrphanText } from "@/components/ui/no-orphan-text";
import { createMetadata } from "@/lib/metadata";
import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
  type Project,
  type ProjectImage,
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

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ProjectHeader project={project} />
      <ProjectDetails project={project} />
      <ProjectPager previous={previous} next={next} />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

function ProjectHeader({ project }: { project: Project }): ReactNode {
  return (
    <article className="mx-auto w-full max-w-275 px-6 pt-40 pb-10 sm:px-10 sm:pt-48 sm:pb-14 lg:pt-56">
      <FadeIn className="flex flex-col gap-8">
        <Link
          href="/projects"
          className="focus-ring group inline-flex w-fit items-center gap-2 rounded-xl border border-foreground/8 bg-background px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-brand-line hover:bg-brand-soft hover:text-brand-strong"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          返回全部作品
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium tracking-tight text-brand-strong">
              {project.iconLabel} / {project.year}
            </p>
            <h1 className="font-serif text-[2.75rem] font-medium leading-[1.02] tracking-tight text-foreground sm:text-[3.5rem] lg:text-[4.5rem]">
              <NoOrphanText text={project.title} />
            </h1>
            <p className="max-w-[42rem] text-[17px] leading-[1.65] tracking-tight text-foreground/65 sm:text-[19px]">
              <NoOrphanText text={project.description} tailLength={5} />
            </p>
          </div>

          <dl className="grid gap-3 rounded-3xl border border-foreground/8 bg-background p-4 shadow-sm sm:p-5">
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

        <ProjectImageFrame image={project.heroImage} priority large edgeBlur />
      </FadeIn>
    </article>
  );
}

function ProjectDetails({ project }: { project: Project }): ReactNode {
  return (
    <section className="mx-auto w-full max-w-275 px-6 pb-12 sm:px-10 sm:pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.45fr_1fr] lg:gap-10">
        <FadeIn className="flex flex-col gap-5 rounded-3xl border border-foreground/8 bg-background p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-sm font-medium tracking-tight text-brand-strong">
              Project Note
            </p>
            <h2 className="mt-2 text-[26px] font-medium leading-tight tracking-tight text-foreground sm:text-[32px]">
              简短项目说明
            </h2>
          </div>
          <p className="text-[15px] leading-[1.75] tracking-tight text-foreground/65 sm:text-[16px]">
            <NoOrphanText
              text={project.summary ?? project.description}
              tailLength={5}
            />
          </p>
          {project.deliverables?.length ? (
            <ul className="mt-auto flex flex-wrap gap-2 border-t border-brand-line/60 pt-5">
              {project.deliverables.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-brand-line bg-brand-soft px-3 py-1.5 text-sm tracking-tight text-brand-strong"
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
              <ProjectImageFrame image={image} large={index === 0} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectImageFrame({
  image,
  priority = false,
  large = false,
  edgeBlur = false,
}: {
  image: ProjectImage;
  priority?: boolean;
  large?: boolean;
  edgeBlur?: boolean;
}): ReactNode {
  return (
    <figure className="overflow-hidden rounded-3xl border border-foreground/8 bg-background p-2 shadow-sm">
      <div
        className={`ring-foreground/5 relative overflow-hidden rounded-[1.35rem] bg-foreground/5 ring-1 ${
          large ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized
          priority={priority}
          sizes={
            large
              ? "(min-width: 1280px) 1100px, 100vw"
              : "(min-width: 1024px) 520px, (min-width: 768px) 48vw, 100vw"
          }
          className="object-cover"
        />
        {edgeBlur ? (
          <GradualBlur
            target="parent"
            position="bottom"
            height="4.25rem"
            strength={0.85}
            divCount={4}
            curve="bezier"
            exponential={false}
            opacity={0.48}
            zIndex={2}
          />
        ) : null}
      </div>
      {image.caption ? (
        <figcaption className="px-2 pt-3 pb-1 text-[13px] leading-relaxed tracking-tight text-foreground/50">
          <NoOrphanText text={image.caption} tailLength={5} />
        </figcaption>
      ) : null}
    </figure>
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
    <div className="flex gap-3 rounded-2xl border border-foreground/6 bg-foreground/[0.025] p-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-line bg-brand-soft">
        <Icon className="h-4 w-4 text-brand-strong" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-[12px] tracking-tight text-brand-strong">
          {label}
        </dt>
        <dd className="mt-1 text-sm leading-snug tracking-tight text-foreground/80">
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
      <div className="rounded-3xl border border-foreground/6 bg-foreground/[0.02] p-5 text-sm tracking-tight text-foreground/35 sm:p-6">
        {direction === "previous" ? "已经是第一个项目" : "已经是最后一个项目"}
      </div>
    );
  }

  const isPrevious = direction === "previous";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card focus-ring group flex min-h-34 flex-col justify-between rounded-3xl border border-foreground/8 bg-background p-5 no-underline shadow-sm sm:p-6"
    >
      <span className="inline-flex items-center gap-2 text-sm font-medium tracking-tight text-foreground/55 transition-colors group-hover:text-brand-strong">
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
      <span className="mt-5 text-[20px] font-medium leading-tight tracking-tight text-foreground sm:text-[22px]">
        <NoOrphanText text={project.category} />
      </span>
    </Link>
  );
}
