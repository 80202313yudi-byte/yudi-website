import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ProjectCardLink } from "@/components/ProjectCardLink";
import { featuredWorkRows, type FeaturedWork } from "@/data/featuredWorks";

const cardSizeClass: Record<FeaturedWork["sizeVariant"], string> = {
  small: "hero-work-card-small",
  medium: "hero-work-card-medium",
  wide: "hero-work-card-wide",
};

type HeroWorkCardProps = {
  item: FeaturedWork;
  decorative?: boolean;
};

function HeroWorkCard({ item, decorative = false }: HeroWorkCardProps) {
  const contained = item.cover.coverFit === "contain";
  const darkSurface = contained || item.cover.surface === "dark";

  return (
    <ProjectCardLink
      href={item.href}
      slug={item.slug}
      label={`查看${item.title}详情`}
      ariaHidden={decorative}
      tabIndex={decorative ? -1 : undefined}
      className={`hero-work-card group ${cardSizeClass[item.sizeVariant]}`}
    >
      <div className={`hero-work-card-image ${darkSurface ? "hero-work-card-image-dark" : ""}`}>
        <Image
          src={item.cover.src}
          alt={decorative ? "" : item.cover.alt}
          width={960}
          height={720}
          sizes="(max-width: 768px) 72vw, (max-width: 1280px) 28vw, 360px"
          style={{ objectPosition: item.cover.objectPosition }}
          className={contained ? "object-contain p-5" : "object-cover"}
        />
      </div>
      <div className="hero-work-card-copy">
        <span>{item.category}</span>
        <strong>{item.title}</strong>
        <em>{item.subtitle}</em>
      </div>
      <span className="hero-work-card-arrow" aria-hidden="true">
        <ArrowUpRight size={16} />
      </span>
    </ProjectCardLink>
  );
}

type HeroWorkTrackProps = {
  items: FeaturedWork[];
  direction: "left" | "right";
};

function HeroWorkTrack({ items, direction }: HeroWorkTrackProps) {
  return (
    <div className={`hero-work-track hero-work-track-${direction}`}>
      <div className="hero-work-track-strip">
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            className="hero-work-track-set"
            aria-hidden={setIndex === 1 ? "true" : undefined}
          >
            {items.map((item) => (
              <HeroWorkCard
                key={`${item.slug}-${setIndex}`}
                item={item}
                decorative={setIndex === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroWorksWall() {
  return (
    <aside className="hero-works-wall" aria-label="精选作品碎片墙">
      <div className="hero-works-wall-header">
        <div>
          <span>作品碎片墙</span>
          <strong>Selected Works</strong>
        </div>
      </div>

      <div className="hero-works-wall-stage">
        <HeroWorkTrack items={featuredWorkRows.top} direction="left" />
        <HeroWorkTrack items={featuredWorkRows.bottom} direction="right" />
      </div>
    </aside>
  );
}
