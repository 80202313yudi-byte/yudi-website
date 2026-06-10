export default function ProjectLoading() {
  return (
    <main className="pb-12 pt-32 md:pb-20 md:pt-36" aria-busy="true" aria-label="正在加载作品详情">
      <span className="sr-only">正在加载作品详情</span>
      <section className="case-loading-content section-shell" aria-hidden="true">
        <div className="case-skeleton h-11 w-32 rounded-lg" />

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="case-skeleton h-14 w-4/5 max-w-3xl rounded-lg md:h-20" />
            <div className="mt-7 flex gap-3">
              <div className="case-skeleton h-8 w-24 rounded-full" />
              <div className="case-skeleton h-8 w-20 rounded-full" />
            </div>
            <div className="case-skeleton mt-6 h-4 w-full max-w-2xl rounded-md" />
            <div className="case-skeleton mt-3 h-4 w-4/5 max-w-xl rounded-md" />
          </div>

          <div className="case-loading-meta border-y border-white/10 py-2">
            <div className="case-skeleton my-4 h-5 w-full rounded-md" />
            <div className="case-skeleton my-4 h-5 w-4/5 rounded-md" />
            <div className="case-skeleton my-4 h-5 w-full rounded-md" />
          </div>
        </div>

        <div className="case-skeleton mt-12 aspect-[16/9] w-full rounded-[22px]" />
      </section>
    </main>
  );
}
