import { getProjectBySlug, type ProjectMedia } from "@/data/projects";

export type FeaturedWork = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  category: string;
  cover: ProjectMedia;
  row: "top" | "bottom";
  sizeVariant: "small" | "medium" | "wide";
};

type FeaturedWorkInput = Omit<FeaturedWork, "href" | "cover">;

const featuredWorkInputs: FeaturedWorkInput[] = [
  {
    slug: "brand-visual-system",
    category: "Brand Design",
    title: "品牌视觉设计",
    subtitle: "VERDE 茶饮品牌",
    row: "top",
    sizeVariant: "wide",
  },
  {
    slug: "product-catalog-design",
    category: "Editorial Design",
    title: "画册设计",
    subtitle: "自然与共 · 品牌画册",
    row: "top",
    sizeVariant: "medium",
  },
  {
    slug: "interface-concept-exploration",
    category: "UI/UX Design",
    title: "界面设计",
    subtitle: "SaaS 数据中台系统",
    row: "top",
    sizeVariant: "medium",
  },
  {
    slug: "ai-visual-experiment",
    category: "AI Visual",
    title: "AI 视觉创作",
    subtitle: "赛博海报 · 系列海报",
    row: "bottom",
    sizeVariant: "medium",
  },
  {
    slug: "short-video-content-packaging",
    category: "Motion Design",
    title: "视频设计",
    subtitle: "概念短片 · 关键帧",
    row: "bottom",
    sizeVariant: "wide",
  },
];

export const featuredWorks: FeaturedWork[] = featuredWorkInputs.map((item) => {
  const project = getProjectBySlug(item.slug);

  if (!project) {
    throw new Error(`Missing featured project: ${item.slug}`);
  }

  return {
    ...item,
    href: `/works/${item.slug}`,
    cover: project.cover,
  };
});

export const featuredWorkRows = {
  top: featuredWorks.filter((item) => item.row === "top"),
  bottom: featuredWorks.filter((item) => item.row === "bottom"),
};
