# FISHDI Portfolio

这是于迪 / FISHDI 的个人作品集网站，基于 React Bits Pro portfolio 模板调整而来。

当前方向：

- AI 视觉设计
- 品牌视觉
- 画册、海报与产品内容
- UI 概念
- 视频内容包装
- 个人品牌实验

## 本地预览

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## 常用检查

```bash
npm run lint
npm run typecheck
npm run build
```

## 作品数据

首页、`/projects` 和 `/projects/[slug]` 作品详情页共用：

```text
lib/projects.ts
```

后续替换真实作品时，优先修改这里的标题、简介、封面图、主图、详情图和简短说明。
详情页图片也在同一处维护：`heroImage` 和 `detailImages`。

## 仍需替换

- `public/josh.webp`
- `public/josh_wave.webp`
- 项目卡片图片
- 社交主页链接
- 如果不想公开 Gmail，请替换 `components/contact/contact-button.tsx` 和 `components/contact/contact-card.tsx` 中的邮箱
