export type ProjectMediaAspect = "16/9" | "4/3" | "3/4" | "9/16" | "1/1" | "long";

export type ProjectMedia = {
  src: string;
  alt: string;
  objectPosition: string;
  coverFit?: "cover" | "contain";
  surface?: "default" | "dark";
  aspectRatio?: ProjectMediaAspect;
  label?: string;
};

export type Project = {
  slug: string;
  title: string;
  caseTitle: string;
  caseMeta: string;
  caseDescription: string;
  type: string;
  year: string;
  description: string;
  cover: ProjectMedia;
  size: "large" | "medium" | "standard";
  nature: "自主项目" | "概念项目" | "个人实验";
  meta: string;
  role: string;
  background: string;
  challenge: string;
  process: string[];
  deliverables: string[];
  outcome: string;
  summary: string;
  gallery: ProjectMedia[];
};

export const projects: Project[] = [
  {
    slug: "brand-visual-system",
    title: "品牌视觉系统",
    caseTitle: "VERDE 茶饮品牌视觉系统",
    caseMeta: "品牌设计 / 包装延展 / 视觉系统",
    caseDescription: "为茶饮品牌建立从主视觉到包装、物料和线上内容的完整识别系统。",
    type: "品牌视觉",
    year: "2026",
    description: "围绕标志、字体、色彩与版式建立可延展的品牌视觉框架。",
    cover: {
      src: "/images/project-brand.svg",
      alt: "品牌视觉系统的标志、版式与色彩应用",
      objectPosition: "center center",
    },
    size: "large",
    nature: "自主项目",
    meta: "视觉策略 / 品牌识别 / 应用规范 · 2026",
    role: "视觉策略、品牌识别、版式系统与交付规范",
    background:
      "项目需要在保持品牌辨识度的同时，建立一套能够覆盖多种内容场景的统一视觉语言。",
    challenge: "如何让标志、字体、色彩与版式在不同触点中保持一致，同时为后续内容保留足够的延展空间。",
    process: [
      "梳理品牌关键词与视觉差异点",
      "探索标志、字体、色彩和图形语言",
      "建立版式规则并验证多场景延展",
    ],
    deliverables: ["品牌主视觉", "识别与版式规范", "传播物料模板"],
    outcome: "形成了一套可用于品牌传播、产品内容和数字界面的基础视觉系统。",
    summary: "系统化不是增加规则，而是让团队在更多场景里仍能做出一致、清晰的视觉判断。",
    gallery: [
      {
        src: "/images/project-brand.svg",
        alt: "品牌视觉系统的标志、版式与色彩方向",
        objectPosition: "center center",
        aspectRatio: "4/3",
        label: "品牌识别与应用方向 / 当前整理版本",
      },
    ],
  },
  {
    slug: "product-catalog-design",
    title: "产品画册设计",
    caseTitle: "自然与共品牌画册",
    caseMeta: "Editorial Design / 画册设计 / 信息编排",
    caseDescription: "通过图文节奏、版式层级和纸质媒介，呈现品牌与自然主题的内容叙事。",
    type: "产品画册",
    year: "2025",
    description: "用强网格和黑白灰画面组织产品信息、卖点和视觉节奏。",
    cover: {
      src: "/images/project-catalog.svg",
      alt: "产品画册的封面与跨页版式",
      objectPosition: "center center",
      coverFit: "contain",
      surface: "dark",
    },
    size: "medium",
    nature: "自主项目",
    meta: "信息架构 / 画册版式 / 印刷交付 · 2025",
    role: "信息架构、版式设计、产品内容与印刷交付",
    background:
      "面对内容密度较高的产品信息，需要在阅读效率、品牌质感和视觉节奏之间取得平衡。",
    challenge: "如何把复杂产品信息转化为客户能够快速理解、销售能够顺畅讲解的阅读路径。",
    process: [
      "重新组织产品层级与阅读顺序",
      "建立画册网格、字体和图片规范",
      "通过重点跨页强化产品卖点",
    ],
    deliverables: ["画册信息架构", "重点跨页版式", "印刷交付文件"],
    outcome: "完成一套结构清晰、便于销售沟通并可持续更新的产品画册。",
    summary: "好的画册不是把信息排整齐，而是帮助读者在正确的顺序里理解产品价值。",
    gallery: [
      {
        src: "/images/project-catalog.svg",
        alt: "产品画册的封面与跨页版式方向",
        objectPosition: "center center",
        coverFit: "contain",
        surface: "dark",
        aspectRatio: "3/4",
        label: "画册版式与阅读节奏 / 当前整理版本",
      },
    ],
  },
  {
    slug: "ai-visual-experiment",
    title: "AI 视觉实验",
    caseTitle: "赛博视觉海报实验",
    caseMeta: "AI Visual / 视觉实验 / 系列海报",
    caseDescription: "结合 AI 生成与视觉后期，探索人物、材质和未来感图像的表达方式。",
    type: "AI 视觉",
    year: "2026",
    description: "以生成式图像探索角色、场景和概念视觉的多种方向。",
    cover: {
      src: "/images/project-ai.svg",
      alt: "AI 视觉实验的概念场景与生成方向",
      objectPosition: "center center",
    },
    size: "medium",
    nature: "个人实验",
    meta: "概念设定 / 生成探索 / 视觉后期 · 2026",
    role: "概念设定、提示词设计、图像筛选与视觉后期",
    background:
      "围绕生成式图像在创意发散和概念表达中的价值，探索稳定且具个人审美的创作流程。",
    challenge: "如何在大量生成结果中建立稳定审美标准，并让最终画面具有一致的叙事方向。",
    process: [
      "定义概念方向与视觉约束",
      "进行多轮生成、筛选与方向收敛",
      "统一构图、色彩和细节完成后期",
    ],
    deliverables: ["概念视觉方向", "提示词与筛选流程", "后期统一规范"],
    outcome: "沉淀了一套从概念发散到视觉定稿的 AI 图像创作方法。",
    summary: "AI 提高了探索速度，但真正形成作品的仍是方向设定、筛选判断与细节控制。",
    gallery: [
      {
        src: "/images/project-ai.svg",
        alt: "AI 视觉实验的概念生成方向",
        objectPosition: "center center",
        aspectRatio: "4/3",
        label: "生成式视觉实验方向 / 当前整理版本",
      },
    ],
  },
  {
    slug: "interface-concept-exploration",
    title: "界面概念探索",
    caseTitle: "SaaS 数据中台界面设计",
    caseMeta: "UI/UX Design / 数据可视化 / 后台系统",
    caseDescription: "为复杂业务数据建立清晰的信息结构和可读的深色界面体验。",
    type: "UI 设计",
    year: "2025",
    description: "为数字产品建立深色界面、信息层级和交互状态。",
    cover: {
      src: "/images/project-ui.svg",
      alt: "深色数字产品界面与组件状态",
      objectPosition: "center top",
    },
    size: "standard",
    nature: "概念项目",
    meta: "信息层级 / 界面系统 / 交互状态 · 2025",
    role: "界面概念、信息层级、组件状态与交互方向",
    background:
      "项目希望用克制的深色视觉建立未来感，同时保证内容扫描效率和核心操作的清晰度。",
    challenge: "如何避免深色科技界面沦为装饰风格，并让关键任务、状态与操作始终清晰。",
    process: [
      "梳理核心任务与页面信息层级",
      "建立深色界面视觉和组件规则",
      "验证关键操作、响应式和状态反馈",
    ],
    deliverables: ["关键页面概念", "组件与状态规则", "响应式方向"],
    outcome: "输出了一套覆盖主要页面与关键交互状态的界面概念方案。",
    summary: "视觉风格只有服务任务时才有价值，清晰的信息层级是未来感成立的基础。",
    gallery: [
      {
        src: "/images/project-ui.svg",
        alt: "深色数字产品界面概念",
        objectPosition: "center top",
        aspectRatio: "16/9",
        label: "界面系统与状态方向 / 当前整理版本",
      },
    ],
  },
  {
    slug: "short-video-content-packaging",
    title: "短片内容包装",
    caseTitle: "概念短片关键帧设计",
    caseMeta: "Motion Design / Key Visual / 内容包装",
    caseDescription: "为短片内容构建视觉基调、关键画面和可延展的动态包装方向。",
    type: "视频内容",
    year: "2025",
    description: "为短视频与动态内容设计标题、封面和视觉包装系统。",
    cover: {
      src: "/images/project-video.svg",
      alt: "短片内容包装的封面与动态视觉",
      objectPosition: "center center",
    },
    size: "standard",
    nature: "自主项目",
    meta: "内容策划 / 分镜 / 动态包装 · 2025",
    role: "内容策划、封面系统、动态标题与视觉包装",
    background:
      "短视频内容需要在有限时间内快速建立识别度，并让封面、标题和画面保持一致。",
    challenge: "如何让不同主题的内容在快速更新中仍保持统一识别，同时兼顾点击与观看节奏。",
    process: [
      "分析内容主题与传播场景",
      "设计封面、标题和动态元素规则",
      "通过多期内容验证系统稳定性",
    ],
    deliverables: ["内容选题与脚本", "关键帧与分镜", "封面与动态包装"],
    outcome: "建立了一套适合持续更新的短片内容包装和封面体系。",
    summary: "内容包装的价值不只是吸引点击，也要让观众快速识别主题并建立长期记忆。",
    gallery: [
      {
        src: "/images/project-video.svg",
        alt: "短片内容包装的封面与关键帧方向",
        objectPosition: "center center",
        aspectRatio: "16/9",
        label: "短片封面与动态包装方向 / 当前整理版本",
      },
    ],
  },
  {
    slug: "personal-brand-experiment",
    title: "个人品牌实验",
    caseTitle: "个人品牌实验",
    caseMeta: "Personal Brand / 网站设计 / 视觉系统",
    caseDescription: "围绕个人创作者身份，探索网站、标识和内容表达的一体化视觉系统。",
    type: "个人实验",
    year: "2026",
    description: "结合动漫、游戏、电影与未来科技的视觉练习。",
    cover: {
      src: "/images/project-experiment.svg",
      alt: "FISHDI 个人品牌的标志与视觉规范",
      objectPosition: "center center",
    },
    size: "standard",
    nature: "个人实验",
    meta: "个人识别 / 网站 / 视觉规范 · 2026",
    role: "创意方向、视觉实验、内容编辑与个人表达",
    background:
      "这是一个持续更新的个人项目，用于观察兴趣、工具和视觉判断如何逐步形成个人表达。",
    challenge: "如何把分散的兴趣与创作方式整理成可持续迭代、能够被他人理解的个人识别。",
    process: [
      "收集跨领域视觉与叙事参考",
      "进行短周期主题实验和风格测试",
      "复盘结果并沉淀可复用的视觉方法",
    ],
    deliverables: ["个人识别方向", "作品集网站", "字体与视觉规则"],
    outcome: "形成一组持续演进的个人视觉实验，并为后续内容创作提供方向。",
    summary: "个人品牌不是固定风格，而是一套能持续承载作品、观点与成长轨迹的表达系统。",
    gallery: [
      {
        src: "/images/project-experiment.svg",
        alt: "FISHDI 个人品牌实验视觉",
        objectPosition: "center center",
        aspectRatio: "4/3",
        label: "个人识别与作品集方向 / 当前整理版本",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
