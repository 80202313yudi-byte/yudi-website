# Codex Collaboration Instructions

Before modifying this project, read `CODEX_HANDOFF.md`.

After every completed project change:

1. Update `CODEX_HANDOFF.md` if architecture, behavior, design, content,
   routes, assets, dependencies, deployment, or known issues changed.
2. Add a concise dated entry to the `Change Log` section.
3. Run the checks appropriate to the change. For frontend changes, normally run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
4. Do not publish or deploy unless the user explicitly asks.

Preserve the current template visual direction unless the user explicitly asks
for a redesign:

- Minimal React Bits Pro portfolio style
- Centered capsule navigation
- Large serif typography and generous whitespace
- Subtle borders, restrained cards, and soft motion
- Project evidence and real images should remain the visual priority
- Real project images must keep original color; do not apply green filters

Avoid:

- Dashboard or resume-site aesthetics
- Heavy neon effects
- Overly complex case-study pages unless requested
- Tiny low-contrast Chinese body text
- Reintroducing `/works` routes; this version uses `/projects/[slug]`
