# FISHDI Portfolio - Codex Handoff

Last updated: 2026-06-10

This document is the persistent project context for Codex sessions on different devices. Read it before making changes and keep it updated after every completed modification.

## Project Summary

FISHDI is a personal portfolio and homepage for presenting:

- Personal introduction
- AI visual and brand design work
- Posters, product catalogs, UI, video, and content creation
- Interests in animation, games, film, AI, and future technology
- Contact information

The goal is to feel like a mature creative designer portfolio rather than a resume site, dashboard, or generic portfolio template.

## Current Visual Direction

- Black background, dark gray surfaces, and restrained fluorescent green accents
- Minimal, premium, future-facing technology aesthetic
- Strong typography, editorial hierarchy, fine borders, and controlled soft lighting
- Open layouts mixed with selected card-based areas
- Real work and project evidence should remain the visual priority
- Fluorescent green is reserved mainly for navigation state, primary actions, key words, focus, and hover feedback
- Real project images must preserve their original colors

Avoid:

- Excessive neon decoration or green filters
- Making every section a bordered card
- Dashboard or component-library aesthetics
- Tiny, dark, difficult-to-read body text
- Repeated meaningless English micro-labels
- Heavy or distracting animation

## Technology

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Next/Image

No environment variables are currently required.

## Repository And Deployment

- GitHub repository: `https://github.com/80202313yudi-byte/yudi-website`
- Remote default branch: `main`
- Current custom domain: `于迪.com` (`xn--6kq660n.com`)
- Production site: `https://于迪.com/`
- The Next.js application uses `output: "export"` and deploys through GitHub Actions to GitHub Pages
- The deployment workflow is `.github/workflows/deploy-pages.yml`
- The exported custom-domain file is `public/CNAME`

## Start And Verify

Install and run:

```bash
npm install
npm run dev
```

Local preview:

```text
http://localhost:3000
```

Before handing off a change:

```bash
npm run lint
npm run build
```

For frontend changes, also inspect desktop and mobile layouts and check the browser console.

## Important Project Structure

```text
app/
  page.tsx                  Homepage composition
  globals.css               Global design system and responsive styles
  layout.tsx                Root layout and homepage metadata
  works/[slug]/page.tsx     Dynamic project detail template
  opengraph-image.tsx       Open Graph image
  robots.ts                 Robots configuration
  sitemap.ts                Sitemap

components/
  Navbar.tsx                Shared navigation and active-section logic
  Hero.tsx                  Homepage hero
  TypewriterIntro.tsx       Hero keyword typewriter
  StatsSection.tsx          Data overview
  FeaturedWorks.tsx         Homepage project grid
  ProjectMedia.tsx          Unified project image display system
  ProjectCardLink.tsx       Whole-card project link and return-state capture
  ProjectReturnRestorer.tsx Homepage history and scroll-position restoration
  ProjectDetailTransition.tsx Detail-page return behavior and route transition
  ProjectReturnToWorksButton.tsx Detail-page bottom CTA using shared return logic
  ProjectHomeLink.tsx       Explicit detail-page links that clear return state
  AboutSection.tsx          About area
  CapabilitiesSection.tsx   Services and deliverables
  InterestsSection.tsx      Long-term content directions
  ContactSection.tsx        Homepage contact area
  MagneticLink.tsx          Magnetic effect for selected primary buttons
  ScrollProgress.tsx        Navigation-bottom page progress line

data/
  projects.ts               Project data, slugs, covers, galleries, and detail content
  projectNavigation.ts      Project card IDs and session return-state helpers
  site.ts                   Navigation, stats, tags, and contact links
  capabilities.ts           Capability card content

public/images/               Local website and project placeholder images
```

## Homepage Order And Anchors

The homepage section order is:

1. Hero: `#home`
2. Selected works: `#works`
3. About: `#about`
4. Capabilities: `#capabilities`
5. Research interests, not included in main navigation
6. Contact: `#contact`

Desktop and mobile navigation must use the same `navItems` data from `data/site.ts`.

Detail-page navigation must link back to homepage sections using paths such as `/#works`, not local detail-page hashes.

## Existing Interactions

- Fixed blurred navigation with active-section highlighting
- Thin fluorescent-green scroll progress line under the navigation
- Smooth homepage anchor navigation
- Hero typewriter rotates only the first-line keyword
- Project cards use one whole-card link and navigate to unique detail routes
- Opening a project records its slug and homepage scroll position in `sessionStorage`
- The detail-page top return button, bottom "继续看作品" CTA, and browser back restore the exact prior homepage position
- Directly opened detail pages fall back to the matching `#project-{slug}` card anchor
- Returned cards receive a brief restrained highlight, disabled with `prefers-reduced-motion`
- Project cover images subtly enlarge on hover
- Selected primary buttons use a restrained magnetic effect:
  - Desktop fine-pointer devices only
  - Maximum visual displacement: 5px
  - Inner text/icon displacement is smaller
  - Disabled on narrow screens and with `prefers-reduced-motion`
- Mouse spotlight effects were deliberately removed because they did not add enough value
- Motion is reduced when `prefers-reduced-motion` is enabled

Do not apply magnetic behavior to every button. It is currently limited to:

- Top navigation contact button
- Hero primary button
- Homepage contact primary button

## Project Routes

Each project has a unique stable route:

| Project | Slug |
| --- | --- |
| 品牌视觉系统 | `brand-visual-system` |
| 产品画册设计 | `product-catalog-design` |
| AI 视觉实验 | `ai-visual-experiment` |
| 界面概念探索 | `interface-concept-exploration` |
| 短片内容包装 | `short-video-content-packaging` |
| 个人品牌实验 | `personal-brand-experiment` |

Routes use:

```text
/works/[slug]
```

Unknown slugs must use `notFound()` and must never redirect to the contact area.

## Project Image System

Project media data is defined in `data/projects.ts`.

Each media item supports:

```ts
type ProjectMedia = {
  src: string;
  alt: string;
  objectPosition: string;
  coverFit?: "cover" | "contain";
  surface?: "default" | "dark";
  aspectRatio?: "16/9" | "4/3" | "3/4" | "9/16" | "1/1" | "long";
  label?: string;
};
```

Rules:

- Homepage covers use a consistent container ratio and separated dark information area
- Real project images preserve original colors
- Homepage images may use only a very light dark display overlay, removed on hover
- Bright or white work can use `coverFit: "contain"` and `surface: "dark"`
- Detail pages display original project colors without a green filter
- Use Next/Image with dimensions and responsive `sizes`
- Keep meaningful alt text for content images and empty alt text for decorative images

## Current Content And Design Decisions

- Hero headline: `把想法，变成可以被看见的作品。`
- `看见` is the key fluorescent-green phrase and must not split awkwardly
- Typewriter keywords:
  - AI 视觉
  - 品牌设计
  - 数字内容创作
  - 动态影像
  - AI 内容策划
- Fixed typewriter second line:
  - `持续探索技术、审美与叙事之间的可能性。`
- About headline:
  - `把设计经验，带进 AI 内容创作。`
- Featured works description:
  - `这些项目记录了我如何把概念，推进为可落地成果。`
- Interests description:
  - `它们持续影响我的视觉判断与叙事方式，也构成下一阶段内容创作的线索。`
- Interests section is framed as long-term research directions, not a skill grid
- Capabilities describe what can be delivered, not only what tools are known

## Chinese Typography Rules

- Keep Chinese body copy left-aligned. A text block may sit on the right side of a layout, but the copy itself should not be right-aligned or justified.
- Use `.heading-balance` for large headings and `.copy-pretty` for paragraphs that need stable Chinese wrapping.
- Protect important short phrases with `.phrase-nowrap` instead of adding many `<br>` tags.
- Keep ordinary body copy near `36em`; section descriptions use `width: min(100%, 34em)` and About copy uses `width: min(100%, 38em)`.
- Avoid `word-break: break-all`, fixed paragraph heights, invisible spacing, or overflow clipping as text-layout fixes.

## Responsive And Accessibility Requirements

Check at least:

- 1440px
- 1280px
- 1024px
- 768px
- 390px

Maintain:

- No horizontal overflow
- No awkward isolated Chinese characters in headings
- Mobile menu closes after navigation and locks background scrolling while open
- Fixed navigation does not cover section headings
- Interactive elements are semantic links or buttons
- Clear `focus-visible` states
- Mobile tap targets of at least 44px
- Accurate image alt text
- Motion reduction support

## Known Placeholders And Future Work

The site is structurally complete, but these items still need the owner's real content:

- Replace the six placeholder project cover and gallery images with real work
- Expand project detail narratives with real project context, process, deliverables, and outcomes
- Replace `hello@example.com` with the real contact email
- Replace placeholder social links in `data/site.ts`
- Optionally replace the abstract About portrait while preserving the current layout

Do not invent commercial clients, project results, metrics, or testimonials.

## Cross-Device Transfer

All required source code, configuration, and local website assets are inside this project folder. There are currently no external absolute-path asset dependencies.

The following generated folders do not need to be transferred because they can be recreated:

```text
node_modules/
.next/
.playwright-cli/
out/
```

Transfer the remaining project folder contents, then run `npm install`.

## Change Log

### 2026-06-10

- Refined Chinese copy and typography across the homepage and project details: removed right-aligned body copy, added balanced heading and pretty paragraph wrapping, tightened section descriptions, and protected key phrases from awkward splitting.
- Loosened the About headline line-height so the two-line Chinese title has more breathing room without affecting the Hero headline.
- Changed the detail-page bottom CTA from a fixed `/#works` link to a shared return button, with the label `继续看作品`.
- Reworked project-detail return navigation to prefer browser history, restore the originating card scroll position, and fall back to the matching project-card anchor for direct detail-page visits.
- Added per-card `project-{slug}` anchors, temporary session return state, reduced-motion-safe return feedback, and protection against stale return state during explicit detail-page navigation.
- Added `AGENTS.md` and this persistent handoff document for cross-device Codex collaboration.
- Added instructions requiring future Codex sessions to update this document after completed changes.
- Connected the project context to `80202313yudi-byte/yudi-website` and documented the existing GitHub Pages domain setup.
- Confirmed the Chinese custom domain is `于迪.com`, represented by `xn--6kq660n.com`.
- Configured Next.js static export and GitHub Actions deployment so the new version can fully replace the previous GitHub Pages site.
- Fully replaced the previous static website on `main` and verified the new homepage and project detail pages live at `于迪.com`.

### 2026-06-09

- Added restrained magnetic interaction to the top contact button, hero primary button, and homepage contact primary button.
- Removed mouse spotlight effects from the hero visual, About illustration, and contact panel.
- Added a thin page-scroll progress line beneath the fixed navigation.
- Established a flexible project media system supporting original-color covers, multiple aspect ratios, contain/cover modes, and bright-image surfaces.
- Refined project cards, detail routes, responsive layouts, typography, content hierarchy, accessibility, and SEO.
