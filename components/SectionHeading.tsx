import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
};

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="section-heading mb-8 grid gap-5 md:mb-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,430px)] md:items-end md:gap-10 lg:gap-20">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="heading-balance section-title mt-5 font-semibold text-text">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="copy-pretty section-description">{subtitle}</p>
      ) : null}
    </div>
  );
}
