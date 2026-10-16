# Jitesh Sen Portfolio

Illustrated, responsive developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and GSAP. An editorial, cinematic single-page experience: pinned project storytelling, dark/light editorial themes with View Transitions, and an SVG-illustrated technical hero.

## Development

```bash
pnpm install
pnpm dev
```

## Structure

- `data/portfolio.ts` — single source of truth for all copy, projects, and links
- `components/` — hero, pinned project stage + SVG system views, editorial sections, header
- `animations/` — GSAP scroll/reveal systems (scroll storytelling, staged entrances)
- `app/globals.css` — design tokens (light/dark), responsive breakpoints, media visual loops

## Verification

The production build is exercised end-to-end with a headless-browser suite (overflow at 10 widths, pinned-stage sequencing, accordion/declining-motion behavior, both themes):

```bash
pnpm build && pnpm start
VERIFY_URL=http://localhost:3000 node scripts/verify.mjs
```

Screenshots land in `verification/` (gitignored).
