# FISHDI Portfolio - Codex Handoff

Last updated: 2026-07-24

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
- The theme toggle keeps the source `rbp-portfolio-main` 700ms circular reveal
  from the toggle button using `cubic-bezier(0.22, 1, 0.36, 1)`. Safari keeps
  the template CSS animation. Chrome and Edge use a Chromium-specific WAAPI
  animation on `::view-transition-new(root)` to avoid the CSS clip-path
  compositing hitch. During the 700ms Chromium reveal, `ShaderFlow` remains
  live at a stable 30fps while the visually static `PortraitMorph` render loop
  yields GPU time to the transition. Outside that brief window, both WebGL
  effects run normally. Keep both browser paths visually synchronized.
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
  Latin editorial text rather than applying it to Chinese title strings. The
  project uses local system font stacks only and must not depend on
  `next/font/google` or other remote font fetches unless the user explicitly
  asks.
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

Project detail images use `components/projects/project-image-lightbox.tsx`.
The detail page remains a server component for metadata/static params, while
the image frame is a client component. It renders `project.heroImage` and
`project.detailImages` as clickable frames, opens a portal-based full-screen
lightbox, and cycles only through the current project's gallery in the order
`[project.heroImage, ...project.detailImages]`. The lightbox supports close,
previous/next buttons, Escape, keyboard arrow navigation, mouse-wheel zoom
from the cursor position up to 4x, drag-to-pan when zoomed, a zoom percentage,
and a reset control. Keep future zoom/pan changes inside the client component;
do not convert the route page itself to a client component.

Project detail links preserve their browsing context with a `from` query:
homepage selected-project cards link to `/projects/[slug]?from=home` and the
project archive links to `/projects/[slug]?from=projects`. Because the site is
statically exported for GitHub Pages, the detail return buttons are implemented
as a client component in `components/projects/project-return-link.tsx`; it reads
`window.location.search` and uses query targets
(`/?returnTo=featured-project-[slug]` or
`/projects?returnTo=all-project-[slug]`) so users land near the card they
opened without triggering native hash-anchor scrolling. Entering a project
detail page must not include a hash and must scroll to the top; only leaving a
detail page uses `returnTo` query params to restore the original card context.
The homepage "查看全部" button links to `/projects?scroll=top` with
`scroll={false}`; `SmoothScroll` performs one top reset and then removes the
temporary query param so entering the archive starts at the top without hash
or double-scroll jitter.

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
components/projects/project-image-lightbox.tsx
components/ui/gradual-blur.tsx
components/ui/no-orphan-text.tsx
components/ui/rotating-text.tsx
components/ui/typewriter-rotating-text.tsx
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
Desktop fine-pointer users get a light inspiration-card interaction: hover
lifts the focused card, applies cursor-based tilt, wakes the group with tiny
offsets, reveals one short explanation, and runs small line-art micro-motion.
Mobile keeps only the first four cards in a 2x2 grid and uses tap-to-toggle for
the same explanation. Reduced-motion users keep static transforms with simple
focus/active highlighting and no tilt or icon animation.

The homepage Hero uses `components/ui/typewriter-rotating-text.tsx` only for
the small positioning keyword after `聚焦`. It types, holds, deletes, and cycles
through `内容封面包装`, `AI 视觉系统`, `品牌识别设计`, and `作品页面设计` without
the old RotatingText pill background, border, or shadow. Reduced-motion users
see the first keyword statically.

`components/ui/gradual-blur.tsx` is a local React Bits-style GradualBlur
adaptation. It is currently used only on the homepage Hero bottom edge and the
project detail hero image edge. It uses global styles in `app/globals.css`,
does not import `mathjs`, does not inject CSS at runtime, and should not be
applied to every project card or as a page-wide overlay.

Hero and contact-card email actions share `components/contact/contact-button.tsx`.
It uses the original `rbp-portfolio-main (1).zip` morphing email-copy effect:
one `motion.button` with `layout` and `AnimatePresence`, hover/focus reveal from
`联系我` to the email state, and click-to-copy feedback on desktop-sized
fine-pointer viewports. On small or touch-like viewports, the button does not
expand to the long email address; tap/click copies the email and shows the
fixed-width `邮箱已复制` state to avoid mobile flicker and layout jitter. Do not
replace this with custom CSS width animations unless the user explicitly asks.

Reduced motion is centralized in `lib/motion.tsx` through
`ReducedMotionProvider`. Components that create sustained or complex animation
must call `useReducedMotion()`:

- `ShaderFlow` renders a static gradient and does not create OGL/WebGL or RAF
  when reduced motion is enabled or WebGL is unavailable.
- `PortraitMorph` falls back to the static `/josh.webp` portrait if WebGL or
  OGL initialization fails, so the page must not crash on no-WebGL devices.
- `Stack` keeps the Matter.js physics tag layout for normal-motion users and
  falls back to static wrapped tool tags for reduced-motion or narrow screens.
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

- 2026-08-14: Added a Chromium-only WAAPI driver for the light/dark circular
  reveal while retaining the existing Safari CSS path. Chrome and Edge now
  animate the same button-centered circle directly on the view-transition
  pseudo-element. Follow-up tuning promotes the clip to its own compositor
  layer, keeps the flowing shader live at a stable 30fps, pauses the static
  portrait renderer only during the 700ms reveal, and avoids redundant shader
  color reads caused by transition-coordinate style mutations.
- 2026-08-04: Replaced only the light/dark theme toggle behavior and button
  styling with the exact `rbp-portfolio-main.zip` implementation: restored its
  700ms reveal curve, native `startViewTransition` call, and neutral toggle
  hover style. All other site behavior and visuals remain unchanged.
- 2026-07-24: Removed the theme-transition WebGL freeze and static canvas
  capture fallbacks so the original flowing background and portrait rendering
  remain active. Kept the 700ms linear circular reveal.
- 2026-07-24: Changed the theme reveal timing function from the template's
  ease-out curve to `linear`, so the circle radius expands at a constant speed
  without the visible mid-animation slowdown.
- 2026-07-24: Moved the theme performance optimization ahead of the native View
  Transition snapshot: WebGL canvases now freeze and use static capture
  fallbacks before the old/new root images are created. Restored the template's
  original 700ms reveal curve and removed the extra full-screen compositor
  hints that increased texture pressure on high-resolution displays.
- 2026-07-24: Optimized the circular light/dark theme reveal without changing
  its visual direction: shortened it from 700ms to 520ms, added compositor
  hints to the clipped snapshot, and paused background/portrait WebGL rendering
  during the transition to reduce GPU contention.
- 2026-06-26: Removed `next/font/google` so offline/static builds use only local
  system font stacks, and added WebGL capability/error fallbacks so
  `ShaderFlow` and `PortraitMorph` degrade to static visuals instead of
  throwing a Next.js application error on no-WebGL devices.
- 2026-06-26: Applied the scoped FISHDI bugfix prompt: corrected the projects
  archive top spacing class, restored About page FadeIn reading order, rendered
  external contact social links as plain anchors, preloaded the portrait hover
  image, fixed the Experience collapsed peek height, and documented the
  project-specific `detailImages` asset follow-up.
- 2026-06-25: Re-copied the About `常用工具` Stack behavior from the original
  template's Matter.js implementation, including the compact rounded frame,
  falling chips, drag interaction, and reset button, while keeping text-badge
  icons instead of remote logo images to avoid broken images.
- 2026-06-25: Restored Matter.js physics in the About `常用工具` Stack while
  removing all image-based tool icons. Tool badges now use local text
  abbreviations only, preventing broken image icons and external logo requests.
- 2026-06-25: Rebuilt the About `常用工具` Stack as a static scattered tool
  tag wall with colorful local text-badge pills, a wide rounded container,
  reset-triggered entrance animation, desktop hover lift, and mobile flex-wrap
  fallback without external logo images or Matter.js physics.
- 2026-06-25: Updated the About `创作工具` Stack chips to mirror the original
  template's Stack demo labels and color rhythm while keeping stable local text
  badges instead of remote logo images.
- 2026-06-25: Split the contact email button into a desktop-only implementation
  that matches the original template's Motion layout reveal and a separate
  mobile-only copy button, removing the old fine-pointer runtime branch that
  could make the reveal timing inconsistent.
- 2026-06-25: Restored the desktop contact email reveal timing and layout
  structure to match the original `rbp-portfolio-main (1).zip` button more
  closely, while keeping the mobile/touch fallback as a fixed-width copy state.
- 2026-06-25: Restored desktop contact-card CTA alignment to the previous
  left-aligned layout while keeping the mobile CTA buttons in one centered,
  no-wrap horizontal row.
- 2026-06-25: Changed the contact-card CTA layout back to a single horizontal
  row on mobile as well as desktop, keeping `联系我` and `查看项目` centered,
  no-wrap, and width-to-content now that the mobile email button no longer
  expands.
- 2026-06-25: Updated the contact-card headline rhythm to a fixed two-line
  phrase, `一起` / `把想法做出来。`, so mobile no longer relies on natural line
  breaking for the title.
- 2026-06-25: Centered the contact-card CTA stack on mobile so the middle
  `查看项目` button keeps its natural content width instead of inheriting the
  desktop left-aligned wrapping layout; desktop still returns to the horizontal
  CTA row from the `sm` breakpoint up.
- 2026-06-25: Fixed the contact card headline on mobile by splitting
  `一起把想法` and `做出来` into responsive no-wrap title lines, preventing the
  Chinese word `想法` from being split across lines while preserving the wider
  desktop layout.
- 2026-06-25: Split the contact email-copy button behavior by interaction
  context: desktop/fine-pointer keeps the original hover/focus email reveal,
  while mobile/small viewports use a fixed-width click-to-copy state that
  changes from `联系我` to `邮箱已复制` without expanding the email or shifting
  neighboring CTA buttons.
- 2026-06-25: Upgraded the About-page creative-capability cards into a
  restrained inspiration-card interaction with desktop hover lift/tilt, group
  wake offsets, muted sibling cards, short detail reveals, line-art micro-motion,
  mobile tap-to-toggle for the first four cards, keyboard activation, and
  reduced-motion static fallbacks.
- 2026-06-25: Extended the project detail Lightbox with mouse-wheel zoom,
  cursor-centered scaling, drag-to-pan for zoomed images, a zoom percentage,
  and a reset control while preserving the server-rendered detail page and
  existing gallery carousel behavior.
- 2026-06-25: Added a portal-based project image lightbox for
  `/projects/[slug]`. The hero image and all detail images are clickable,
  cycle within the current project gallery, and support close, previous/next,
  Escape, and keyboard arrow navigation while keeping the detail page server
  rendered for metadata and static export.
- 2026-06-25: Replaced the homepage Hero RotatingText pill with a lightweight
  text-only typewriter keyword loop after `聚焦`, using the keyword order
  `内容封面包装`, `AI 视觉系统`, `品牌识别设计`, `作品页面设计`, a subtle green
  cursor, and a static reduced-motion fallback.
- 2026-06-24: Replaced Fraunces-backed Chinese page title styling with a stable
  local CJK sans-serif title utility across homepage projects, project archive,
  project detail, About, and contact headings to prevent mixed glyph weight and
  font fallback in mobile WebViews.
- 2026-06-24: Updated project-card detail links and detail-page return buttons
  to preserve homepage-selected versus `/projects` archive context through
  `from` query params and card-specific return targets. Added a second return
  button below the previous/next pager and a Lenis-safe hash scroll fallback so
  returns land near the opened card instead of the archive top.
- 2026-06-24: Made project-detail entry links explicitly use normal top-scroll
  navigation and added a Lenis-safe top reset for `/projects/[slug]` routes with
  no hash, keeping the rule clear: entering details starts at the top, returning
  from details uses card-specific return targets.
- 2026-06-24: Replaced detail-page return hash anchors with `returnTo` query
  params and a single Lenis-aware layout scroll, preventing native hash scroll
  and custom offset correction from double-running and causing visible jitter.
  The `returnTo` param is removed after the one-time positioning so returned
  URLs stay clean.
- 2026-06-24: Updated the homepage "查看全部" archive entry to use a temporary
  `/projects?scroll=top` query plus a single Lenis-aware top reset, then clear
  the query so the projects archive opens at the true page top without affecting
  project-detail return positioning.
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
