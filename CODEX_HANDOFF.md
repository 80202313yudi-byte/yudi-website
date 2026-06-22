# FISHDI Portfolio - Codex Handoff

Last updated: 2026-06-22

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
app/about/page.tsx
app/projects/page.tsx
app/projects/[slug]/page.tsx
components/projects/projects.tsx
components/hero/hero.tsx
components/contact/contact-card.tsx
components/layout/nav.tsx
lib/projects.ts
lib/metadata.ts
public/CNAME
.github/workflows/deploy-pages.yml
```

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

- 2026-06-22: Added lightweight `/projects/[slug]` project detail pages, shared
  project data in `lib/projects.ts`, static GitHub Pages deployment config,
  `public/CNAME`, and this handoff file.
- 2026-06-22: Published through GitHub Pages and aligned static export URLs to
  no-trailing-slash paths for the production domain.
