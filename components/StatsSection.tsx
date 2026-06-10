import { stats } from "@/data/site";
import { MotionReveal } from "@/components/MotionReveal";

export function StatsSection() {
  return (
    <section aria-label="数据概览" className="relative py-8 md:py-10">
      <div className="section-shell">
        <MotionReveal className="stats-grid grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="stat-item surface-card flex min-h-36 flex-col justify-end rounded-[16px] bg-white/[0.025] p-5 md:min-h-40 md:p-6"
            >
              <strong className="block text-3xl font-semibold text-accent md:text-4xl">
                {item.value}
              </strong>
              <span className="mt-4 block text-[15px] leading-7 text-[#b8b8b8]">{item.label}</span>
            </div>
          ))}
        </MotionReveal>
      </div>
    </section>
  );
}
