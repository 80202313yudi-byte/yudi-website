import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xn--6kq660n.com";
  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/works/${project.slug}`,
    lastModified: new Date("2026-06-09"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-06-09"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectPages,
  ];
}
