type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-text md:text-5xl">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="max-w-lg text-base leading-8 text-[#bdbdbd] md:text-right">{subtitle}</p>
      ) : null}
    </div>
  );
}
