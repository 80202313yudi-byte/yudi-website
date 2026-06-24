# FISHDI Portfolio - Codex Handoff

Last updated: 2026-06-24

Read this before modifying the project. Keep it current when architecture,
content, deployment, routes, assets, dependencies, or known issues change.

## Project Summary

This is the current FISHDI / 于迪 personal portfolio site based on the
`rbp-portfolio-main` template. It presents:

- AI visual design
- Brand visual work
- Catalog, poster, UI, video, and content creation directions
- A compact homepage with selected projects and a contact card
- A projects index and lightweight project detail pages

Preserve the current template visual structure unless the user asks for a
redesign.

## Current Visual Direction

- Minimal portfolio language from the React Bits Pro portfolio template
- Light/dark theme support, centered capsule navigation, generous spacing
- Large serif headings, restrained cards, subtle borders, soft motion
- A restrained FISHDI brand signal color is defined globally in
  `app/globals.css` as `--brand`, `--brand-strong`, `--brand-soft`, and
  `--brand-line`. Use it for navigation active states, small keyword emphasis,
  button hover/focus states, project tags, and fine dividers only. Keep the
  color local and restrained; do not turn the whole site into a high-saturation
  black-green style.
- Chinese headings and body copy use global `text-wrap` / `line-break` rules in
  `app/globals.css`. For dynamic project titles or descriptions, use
  `components/ui/no-orphan-text.tsx` to keep the final phrase together and avoid
  single-character orphan lines.
- Chinese page-level titles use the local `.font-cjk-title` utility from
  `app/globals.css`, backed by a stable system sans-serif CJK stack. This avoids
  mixed Fraunces/CJK fallback runs in mobile WebViews. Keep `font-serif` for
  Latin editorial text rather than applying it to Chinese title strings. Do not
  add remote CJK font dependencies unless the user explicitly asks.
- Current project images are placeholders and should be replaced later
- Real project images should preserve original color, not be forced through a
  green or grayscale filter

Avoid turning this back into a dashboard, resume page, or heavy case-study
system unless explicitly requested.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Motion
- Lucide Icons
- next-themes
- Lenis
- OGL

No environment variables are required for local development.

## Repository And Deployment

- GitHub repository: `https://github.com/80202313yudi-byte/yudi-website`
- Default branch: `main`
- Production domain: `https://xn--6kq660n.com/` / `https://于迪.com/`
- Deployment: GitHub Pages through `.github/workflows/deploy-pages.yml`
- Static export is enabled in `next.config.ts`
- Production URLs are generated without trailing slashes. Use `/projects` and
  `/projects/[slug]` rather than `/projects/`.
- Custom domain file: `public/CNAME`

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Local preview:

```text
http://127.0.0.1:3000/
```

## Main Routes

- `/` homepage
- `/projects` project index
- `/about` about page
- `/projects/[slug]` lightweight project detail pages

Project detail pages are intentionally simple:

1. title and basic info
2. one main image
3. several detail images
4. short summary
5. previous / next project
6. return to all projects
7. contact card

Do not add `/works` routes to this template version unless the user explicitly
asks.

## Important Files

```text
app/page.tsx
app/globals.css
app/about/page.tsx
app/projects/page.tsx
app/projects/[slug]/page.tsx
components/projects/projects.tsx
components/hero/hero.tsx
components/hero/portrait-morph.tsx
components/contact/contact-button.tsx
components/contact/contact-card.tsx
components/layout/nav.tsx
components/ui/gradual-blur.tsx
components/ui/no-orphan-text.tsx
components/ui/rotating-text.tsx
lib/projects.ts
lib/metadata.ts
public/CNAME
.github/workflows/deploy-pages.yml
```

Homepage SEO metadata lives in `app/page.tsx` and uses an absolute title:
`于迪 FISHDI｜AI 视觉设计师与品牌内容创作者`. Shared defaults and Open Graph /
Twitter helpers live in `lib/metadata.ts`.

## Project Data

All project cards and detail pages share one source:

```text
lib/projects.ts
```

Each project currently uses:

- `slug`
- `title`
- `category`
- `year`
- `description`
- `cover`
- `coverAlt`
- `coverRatio`
- `heroImage`
- `detailImages`
- optional `roles`, `deliverables`, and `summary`

When real project assets are ready, replace images and captions there first.

Homepage selected projects and the `/projects` index both render through
`components/projects/projects.tsx`. The list uses CSS Grid
(`grid-cols-1`, `md:grid-cols-2`) rather than CSS columns so visual reading
order always matches the project data and DOM order.

The homepage portrait morph lives in `components/hero/portrait-morph.tsx`.
Desktop fine-pointer devices use hover. Touch/no-hover devices get a single
IntersectionObserver-triggered demo when the portrait enters view, plus tap to
toggle the morph state. `prefers-reduced-motion` disables the WebGL morph and
falls back to the static portrait image.

The top of the About page uses `components/about/polaroid-strip.tsx` as a
six-card creative-capability strip rather than empty placeholder polaroids. The
cards cover composition, hierarchy, storytelling, identity, AI visual work,
and delivery with restrained line-art details and the local brand accent.
Desktop hover only adds a small lift; reduced-motion users receive static,
rotated cards.

The homepage Hero uses `components/ui/rotating-text.tsx` only for the small
positioning keyword capsule. It rotates the lines `AI 视觉系统`, `品牌识别设计`,
`内容封面包装`, and `作品页面设计` at a restrained pace. Do not reuse this
component in navigation, project cards, footers, or multiple section headings
unless the user explicitly asks.

`components/ui/gradual-blur.tsx` is a local React Bits-style GradualBlur
adaptation. It is currently used only on the homepage Hero bottom edge and the
project detail hero image edge. It uses global styles in `app/globals.css`,
does not import `mathjs`, does not inject CSS at runtime, and should not be
applied to every project card or as a page-wide overlay.

Hero and contact-card email actions share `components/contact/contact-button.tsx`.
It uses the original `rbp-portfolio-main (1).zip` morphing email-copy effect:
one `motion.button` with `layout` and `AnimatePresence`, hover/focus reveal from
`联系我` to the email state, and click-to-copy feedback. Do not replace this
with custom CSS width animations unless the user explicitly asks.

Reduced motion is centralized in `lib/motion.tsx` through
`ReducedMotionProvider`. Components that create sustained or complex animation
must call `useReducedMotion()`:

- `ShaderFlow` renders a static gradient and does not create OGL/WebGL or RAF.
- `Stack` renders a static tool-tag layout and does not import Matter.js.
- `FadeIn` / `ScaleUnblur` render static wrappers.
- `PolaroidStrip`, `Experience`, `Nav`, `SmoothScroll`, and contact CTA layout
  effects disable transform, spring, view, or layout animation while preserving
  content and interaction.
- The About `Stack` tool chips use local text badges (`Ps`, `Ai`, `GPT`, etc.)
  instead of external icon hotlinks to avoid broken image requests and console
  404s.
- `GradualBlur` removes backdrop-filter layers for reduced-motion users and
  falls back to a subtle background-color gradient.

## Current Project Slugs

- `brand-system`
- `editorial-product-content`
- `ai-visual-experiment`
- `ui-concept-exploration`
- `motion-content-packaging`
- `fishdi-personal-brand`

## Known Follow-Ups

- Replace `public/josh.webp` and `public/josh_wave.webp`
- Replace remote Dribbble placeholder project images with owned project assets
- Replace placeholder social links in `components/contact/contact-card.tsx`
- Replace public Gmail if the user does not want it visible
- Existing lint warnings come from template `<img>` usage in About/hero helper
  components. They are warnings, not build blockers.

## Change Log

- 2026-06-24: Replaced Fraunces-backed Chinese page title styling with a stable
  local CJK sans-serif title utility across homepage projects, project archive,
  project detail, About, and contact headings to prevent mixed glyph weight and
  font fallback in mobile WebViews.
- 2026-06-24: Replaced the About page's empty dotted polaroids with six
  lightweight creative-capability cards for composition, hierarchy,
  storytelling, identity, AI visual work, and delivery, including restrained
  brand-accent line art, responsive bilingual labels, desktop-only hover lift,
  and a static reduced-motion fallback.
- 2026-06-24: Added a local `GradualBlur` client component with global CSS,
  integrated it only into the homepage Hero bottom edge and project detail hero
  image edge, lowered the effect on coarse-pointer/mobile devices, and disabled
  blur layers for reduced-motion users.
- 2026-06-24: Added a local React Bits-style `RotatingText` client component
  using the existing `motion` dependency, integrated it only into the homepage
  Hero positioning capsule, disabled automatic rotation for reduced-motion
  users, and kept the styling as a restrained border/backdrop pill.
- 2026-06-24: Adjusted the Hero RotatingText capsule so the pill width follows
  the active keyword instead of using a fixed minimum width, matching the React
  Bits interaction more closely without adding layout overflow.
- 2026-06-24: Connected reduced-motion handling across motion primitives,
  ShaderFlow, Matter.js tool stack, PolaroidStrip, Experience, Nav, Lenis
  smooth scroll, and contact CTA layout effects so complex RAF/WebGL/physics
  animation is replaced with static or instant states for users who prefer
  reduced motion. Also replaced external Stack tool icons with local text badges
  to remove broken icon requests.
- 2026-06-24: Restored the restrained FISHDI brand-color token system after
  clarifying that only the old full black-green visual direction should be
  avoided, not the local brand accent itself.
- 2026-06-24: Changed the `/projects` archive page hero heading from
  `近期作品` to `全部作品`.
- 2026-06-24: Strengthened homepage SEO metadata with a full absolute Chinese
  title, more specific description, and shared Open Graph / Twitter basics from
  `lib/metadata.ts`.
- 2026-06-24: Restored the contact email reveal/copy interaction directly from
  `rbp-portfolio-main (1).zip`, keeping only the real email address and Chinese
  labels while removing the custom CSS width-animation version.
- 2026-06-24: Added a mobile/touch fallback for the homepage portrait morph:
  no-hover devices get one restrained in-view demo plus tap-to-toggle, while
  desktop hover remains unchanged and `prefers-reduced-motion` stays static.
- 2026-06-24: Replaced the shared project-list CSS columns waterfall with a
  stable one-column/mobile and two-column/desktop CSS Grid layout so homepage
  selected projects and the `/projects` index read in strict data order.
- 2026-06-24: Stabilized `font-serif` title typography by wiring Fraunces to a
  local Chinese serif fallback stack and verifying all current page/detail
  headings compute to the same family chain without remote font dependencies.
- 2026-06-24: Added global Chinese typography wrapping rules and a reusable
  `NoOrphanText` helper, then applied it to project cards, detail pages, contact
  headings, hero helper copy, project index copy, and About list metadata to
  prevent single-character orphan lines across desktop and mobile widths.
- 2026-06-24: Refined homepage Hero copy from generic role labels to a more
  specific portfolio positioning: `AI 视觉设计 / 品牌内容设计`, with supporting
  copy about turning role settings, brand information, and content ideas into
  publishable images, pages, and cover systems.
- 2026-06-24: Added a restrained FISHDI brand color system through global CSS
  tokens and applied it consistently to navigation active states, key homepage
  emphasis, project labels, detail metadata, button hovers, contact links, and
  subtle dividers without changing the overall template structure.
- 2026-06-22: Added lightweight `/projects/[slug]` project detail pages, shared
  project data in `lib/projects.ts`, static GitHub Pages deployment config,
  `public/CNAME`, and this handoff file.
- 2026-06-22: Published through GitHub Pages and aligned static export URLs to
  no-trailing-slash paths for the production domain.
