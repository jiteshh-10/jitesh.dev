# Illustration System

The portfolio uses one reusable master Jitesh character in `components/illustrations/Character.tsx`. Variants render from the same semantic SVG structure: `idle`, `typing`, `walking`, `phone`, `thinking`, `building`, `reading`, and `exploring`.

## Stable targets

`#character`, `#head`, `#face`, `#hair`, `#left-eye`, `#right-eye`, `#mouth`, `#body`, `#left-arm`, `#right-arm`, `#left-hand`, `#right-hand`, `#left-leg`, `#right-leg`, `#left-shoe`, `#right-shoe`, `#laptop`, `#phone`, and `#watch` are intentionally stable and can be targeted by GSAP helpers.

## Asset architecture

Illustration assets live under `public/illustrations/` and are organized by `character`, `hero`, `projects/ecodrop`, and `experience`. The current story scenes are lightweight inline SVG compositions so they remain crisp and easy to animate. External SVGs can replace them without changing the component API.

## Accessibility and motion

Communicative illustrations expose an `aria-label`; decorative background art is hidden. Reduced motion is handled by the existing GSAP `matchMedia` setup and global media query. IDs inside reusable SVG instances are generated with React `useId` to avoid collisions.

## Scene vocabulary

EchoDrop uses physical phone nodes, a dashed relay route, and a message packet. Contexta uses a book-to-meaning relationship. Habitualz uses a growing streak calendar. MinimizUrl uses a folded ribbon becoming a short token. These metaphors are intentionally semantic rather than decorative.

## Figma handoff

Organize source artwork as: `00 Design System`, `01 Character`, `02 Hero`, `03 EchoDrop`, `04 Contexta`, `05 Habitualz`, `06 MinimizUrl`, `07 Cognizant`, and `08 Transitions`. Preserve semantic IDs when exporting SVG and remove generic generated definitions such as `clip0` or `paint0` unless scoped uniquely.
