import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "于迪 FISHDI｜AI 视觉设计师与品牌内容创作者",
  titleAbsolute: true,
  description:
    "于迪 FISHDI 的个人作品集，展示 AI 视觉设计、品牌内容设计、封面主视觉、页面与内容包装项目，关注把角色设定、品牌信息和内容创意整理成可发布的视觉系统。",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <Hero />
      <Projects withHeadline viewMoreVisible source="home" />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
