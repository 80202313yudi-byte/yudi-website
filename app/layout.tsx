import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "FISHDI | AI Visual Designer & Content Creator",
  description:
    "FISHDI 的个人作品集，展示品牌视觉、AI 内容、产品设计与动态影像项目。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FISHDI | AI Visual Designer & Content Creator",
    description:
      "把多年的视觉设计经验带进 AI 内容创作。",
    type: "website",
    url: "/",
    siteName: "FISHDI",
  },
  twitter: {
    card: "summary_large_image",
    title: "FISHDI | AI Visual Designer & Content Creator",
    description: "把多年的视觉设计经验带进 AI 内容创作。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
