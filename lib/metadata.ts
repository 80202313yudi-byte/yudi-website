import type { Metadata } from "next";

export const siteConfig = {
  name: "FISHDI",
  description:
    "于迪 / FISHDI 的个人作品集，聚焦 AI 视觉设计、品牌视觉、内容包装、封面与页面设计，记录从概念到可发布视觉作品的项目实践。",
  url: "https://xn--6kq660n.com",
  ogImage: "/og-image.svg",
  creator: "@FISHDI",
  authors: [
    {
      name: "于迪 / FISHDI",
      url: "https://xn--6kq660n.com",
    },
  ],
  keywords: [
    "FISHDI",
    "于迪",
    "AI 视觉",
    "品牌设计",
    "视觉设计",
    "画册设计",
    "内容创作",
    "个人作品集",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export function createMetadata({
  title,
  titleAbsolute = false,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  titleAbsolute?: boolean;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;
  const resolvedTitle = title ?? siteConfig.name;

  return {
    title: title && titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: description ?? siteConfig.description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: description ?? siteConfig.description,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
