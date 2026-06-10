import Image from "next/image";
import type { ProjectMedia as ProjectMediaData, ProjectMediaAspect } from "@/data/projects";

type ProjectMediaProps = {
  media: ProjectMediaData;
  variant: "cover" | "hero" | "gallery";
  sizes: string;
  priority?: boolean;
};

const aspectClasses: Record<ProjectMediaAspect, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
  "1/1": "aspect-square",
  long: "aspect-[3/5]",
};

export function ProjectMedia({ media, variant, sizes, priority = false }: ProjectMediaProps) {
  const aspectClass =
    variant === "cover"
      ? "aspect-[4/3]"
      : variant === "hero"
        ? "aspect-[16/9]"
        : aspectClasses[media.aspectRatio ?? "4/3"];
  const contained = media.coverFit === "contain";
  const darkSurface = contained || media.surface === "dark";

  return (
    <div
      className={`project-media project-media-${variant} ${aspectClass} ${
        darkSurface ? "project-media-dark" : ""
      }`}
    >
      <Image
        src={media.src}
        alt={media.alt}
        width={1600}
        height={1200}
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: media.objectPosition }}
        className={`project-media-image ${contained ? "object-contain" : "object-cover"} ${
          contained ? "project-media-contained" : ""
        }`}
      />
    </div>
  );
}
