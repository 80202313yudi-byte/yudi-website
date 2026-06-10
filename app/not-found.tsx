import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-20">
      <section className="glass-panel w-full max-w-2xl rounded-[22px] p-8 text-center md:p-12">
        <span className="eyebrow">404 · Not Found</span>
        <h1 className="mt-6 text-5xl font-semibold text-text md:text-7xl">项目不存在</h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#b8b8b8]">
          这个作品地址可能已经变更，或项目尚未发布。你可以返回作品列表继续浏览。
        </p>
        <Link href="/#works" className="btn-primary mx-auto mt-8 w-fit">
          <ArrowLeft size={18} aria-hidden="true" />
          返回作品列表
        </Link>
      </section>
    </main>
  );
}
