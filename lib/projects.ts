export type ProjectIcon =
  | "brand-system"
  | "editorial"
  | "ai-visual"
  | "ui-concept"
  | "motion-content"
  | "personal-brand";

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  icon: ProjectIcon;
  iconLabel: string;
  title: string;
  category: string;
  year: string;
  description: string;
  meta: string;
  cover: string;
  coverAlt: string;
  coverRatio: number;
  heroImage: ProjectImage;
  detailImages: ProjectImage[];
  roles?: string[];
  deliverables?: string[];
  summary?: string;
};

const VISUALS = {
  brand:
    "https://cdn.dribbble.com/userupload/46128964/file/b92b9d268dd928642ca94bd49e32923a.jpg?resize=752x497&vertical=center",
  editorial:
    "https://cdn.dribbble.com/userupload/24599416/file/original-1ae5075dcd129aebb16bdbca24b41ac7.png?resize=1024x768&vertical=center",
  ai:
    "https://cdn.dribbble.com/userupload/47357856/file/75841fa59f32f05ca6c5ddf02d08dfe6.png?resize=1024x768&vertical=center",
  ui:
    "https://cdn.dribbble.com/userupload/43955214/file/original-d4cde1de803e84b97d8892e3444c04b0.png?resize=1024x768&vertical=center",
  motion:
    "https://cdn.dribbble.com/userupload/30310902/file/original-621e7fe47be9d11ee14544456c693bec.png?resize=1024x768&vertical=center",
  personal:
    "https://cdn.dribbble.com/userupload/16560717/file/original-c6f745d50302d66609bfe080f99f5396.png?resize=1024x768&vertical=center",
} as const;

const detailSet = (
  first: ProjectImage,
  second: ProjectImage,
  third: ProjectImage,
  fourth: ProjectImage
): ProjectImage[] => [first, second, third, fourth];

export const projects: Project[] = [
  {
    slug: "brand-system",
    icon: "brand-system",
    iconLabel: "Brand System",
    title: "为茶饮品牌建立完整视觉识别系统。",
    category: "品牌视觉设计",
    year: "2026",
    description:
      "从标志、色彩、包装到传播物料，整理一套能够持续延展的品牌视觉语言。",
    meta: "品牌视觉设计，2026",
    cover: VISUALS.brand,
    coverAlt: "品牌视觉系统项目封面",
    coverRatio: 752 / 497,
    heroImage: {
      src: VISUALS.brand,
      alt: "品牌视觉系统主图占位",
      caption: "主图占位：后续替换为真实品牌视觉总览。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.editorial,
        alt: "品牌视觉版式细节占位",
        caption: "品牌规则和版式方向。",
      },
      {
        src: VISUALS.ui,
        alt: "品牌视觉应用细节占位",
        caption: "品牌在数字页面里的应用。",
      },
      {
        src: VISUALS.motion,
        alt: "品牌内容延展细节占位",
        caption: "传播内容和封面延展。",
      },
      {
        src: VISUALS.personal,
        alt: "品牌视觉局部细节占位",
        caption: "标志、色彩和图形局部。",
      }
    ),
    roles: ["视觉方向", "标志延展", "包装与物料"],
    deliverables: ["品牌识别", "主视觉", "包装方向", "传播物料"],
    summary:
      "这个详情页先保留轻量结构，后续可以把真实 Logo、包装、海报和品牌手册页面替换进来。",
  },
  {
    slug: "editorial-product-content",
    icon: "editorial",
    iconLabel: "Editorial",
    title: "用版式节奏呈现产品与品牌内容。",
    category: "画册与海报设计",
    year: "2025",
    description:
      "围绕画册、海报和产品内容，建立清晰的信息层级和更有质感的阅读路径。",
    meta: "画册与海报设计，2025",
    cover: VISUALS.editorial,
    coverAlt: "产品画册和版式设计项目封面",
    coverRatio: 1024 / 768,
    heroImage: {
      src: VISUALS.editorial,
      alt: "产品画册跨页主图占位",
      caption: "主图占位：后续替换为真实画册跨页或海报组合。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.brand,
        alt: "画册内容结构细节占位",
        caption: "内容层级和版面节奏。",
      },
      {
        src: VISUALS.personal,
        alt: "画册网格细节占位",
        caption: "网格、标题和正文比例。",
      },
      {
        src: VISUALS.ui,
        alt: "产品内容数字页面占位",
        caption: "数字页面中的内容延展。",
      },
      {
        src: VISUALS.motion,
        alt: "海报局部细节占位",
        caption: "标题、裁切和信息标注。",
      }
    ),
    roles: ["版式设计", "信息层级", "视觉延展"],
    deliverables: ["产品画册", "海报", "版式系统", "内容页面"],
    summary:
      "后续可以把真实跨页、海报单张、局部版式和落地展示放进这里。",
  },
  {
    slug: "ai-visual-experiment",
    icon: "ai-visual",
    iconLabel: "AI Visual",
    title: "探索 AI 图像里的角色、场景与氛围。",
    category: "AI 视觉实验",
    year: "2026",
    description:
      "结合生成式图像与后期判断，把灵感、构图和叙事方向收敛成系列视觉作品。",
    meta: "AI 视觉实验，2026",
    cover: VISUALS.ai,
    coverAlt: "AI 视觉实验项目封面",
    coverRatio: 1024 / 768,
    heroImage: {
      src: VISUALS.ai,
      alt: "AI 视觉系列主图占位",
      caption: "主图占位：后续替换为 AI 视觉系列代表图。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.personal,
        alt: "AI 视觉关键词细节占位",
        caption: "主题关键词和氛围方向。",
      },
      {
        src: VISUALS.brand,
        alt: "AI 图像筛选细节占位",
        caption: "生成结果筛选和统一。",
      },
      {
        src: VISUALS.motion,
        alt: "AI 内容封面细节占位",
        caption: "内容封面或故事氛围图。",
      },
      {
        src: VISUALS.editorial,
        alt: "AI 视觉局部细节占位",
        caption: "角色、材质和光影细节。",
      }
    ),
    roles: ["概念设定", "图像生成", "筛选与后期"],
    deliverables: ["角色方向", "场景氛围", "系列图像", "视觉关键词"],
    summary:
      "后续可以把真实生成结果、提示词方向、筛选版本和最终系列图放进这里。",
  },
  {
    slug: "ui-concept-exploration",
    icon: "ui-concept",
    iconLabel: "UI Concept",
    title: "为数字产品整理深色界面体验。",
    category: "UI 概念设计",
    year: "2025",
    description:
      "从信息结构、视觉层级到关键状态，探索兼具科技感和可读性的界面方向。",
    meta: "UI 概念设计，2025",
    cover: VISUALS.ui,
    coverAlt: "深色界面概念设计项目封面",
    coverRatio: 1024 / 768,
    heroImage: {
      src: VISUALS.ui,
      alt: "深色界面概念主图占位",
      caption: "主图占位：后续替换为真实桌面端或移动端界面。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.editorial,
        alt: "界面信息结构细节占位",
        caption: "页面信息结构和内容层级。",
      },
      {
        src: VISUALS.brand,
        alt: "UI 组件状态细节占位",
        caption: "组件、按钮和状态反馈。",
      },
      {
        src: VISUALS.personal,
        alt: "移动端界面细节占位",
        caption: "移动端或局部页面延展。",
      },
      {
        src: VISUALS.motion,
        alt: "UI 视觉细节占位",
        caption: "数据、卡片和界面细节。",
      }
    ),
    roles: ["界面方向", "信息结构", "视觉规范"],
    deliverables: ["首页概念", "功能页面", "组件状态", "深色视觉规范"],
    summary:
      "后续可以把真实 UI 页面、移动端截图、组件状态和视觉规范放进这里。",
  },
  {
    slug: "motion-content-packaging",
    icon: "motion-content",
    iconLabel: "Motion",
    title: "为短片内容建立封面与视觉包装。",
    category: "视频内容包装",
    year: "2025",
    description:
      "围绕选题、关键帧、标题和封面系统，让内容在更新中保持识别度。",
    meta: "视频内容包装，2025",
    cover: VISUALS.motion,
    coverAlt: "短片内容包装项目封面",
    coverRatio: 1024 / 768,
    heroImage: {
      src: VISUALS.motion,
      alt: "短片视觉包装主图占位",
      caption: "主图占位：后续替换为真实封面系列或关键帧。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.ai,
        alt: "短片内容方向细节占位",
        caption: "选题、关键词和视觉氛围。",
      },
      {
        src: VISUALS.editorial,
        alt: "短片封面版式细节占位",
        caption: "标题、画面和封面版式。",
      },
      {
        src: VISUALS.ui,
        alt: "短片发布页面细节占位",
        caption: "发布页或频道页延展。",
      },
      {
        src: VISUALS.brand,
        alt: "短片视觉局部细节占位",
        caption: "标题、光影和画面裁切。",
      }
    ),
    roles: ["封面系统", "标题包装", "关键帧设计"],
    deliverables: ["视频封面", "标题样式", "关键帧", "内容包装规则"],
    summary:
      "后续可以把真实短片封面、关键帧、分镜和标题包装放进这里。",
  },
  {
    slug: "fishdi-personal-brand",
    icon: "personal-brand",
    iconLabel: "FISHDI",
    title: "把个人兴趣整理成持续创作系统。",
    category: "个人品牌实验",
    year: "2026",
    description:
      "围绕动漫、游戏、电影和未来科技，沉淀个人网站、视觉符号和内容表达方式。",
    meta: "个人品牌实验，2026",
    cover: VISUALS.personal,
    coverAlt: "FISHDI 个人品牌实验项目封面",
    coverRatio: 1024 / 768,
    heroImage: {
      src: VISUALS.personal,
      alt: "FISHDI 个人品牌主图占位",
      caption: "主图占位：后续替换为个人网站、标志或视觉系统总览。",
    },
    detailImages: detailSet(
      {
        src: VISUALS.brand,
        alt: "个人品牌视觉符号细节占位",
        caption: "个人符号和视觉关键词。",
      },
      {
        src: VISUALS.ai,
        alt: "个人内容方向细节占位",
        caption: "内容方向和长期兴趣。",
      },
      {
        src: VISUALS.ui,
        alt: "个人品牌数字页面细节占位",
        caption: "个人网站或数字页面延展。",
      },
      {
        src: VISUALS.editorial,
        alt: "个人品牌规范细节占位",
        caption: "Logo、字体和内容栏目细节。",
      }
    ),
    roles: ["个人网站", "视觉符号", "内容方向"],
    deliverables: ["个人网站", "视觉语言", "内容方向", "创作系统"],
    summary:
      "后续可以把 FISHDI 的真实网站迭代、个人视觉符号和内容栏目截图放进这里。",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  };
}
