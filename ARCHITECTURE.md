# Architecture

The portfolio is a scene-led Next.js App Router experience. `app/page.tsx` composes the page; `components/` owns visual scenes; `data/` and `types/` keep content replaceable; `animations/` owns GSAP timelines; `app/globals.css` owns the small semantic color and typography system.

Illustrations are React SVG components with `data-*` targets so artwork can be replaced without changing scene composition. Unknown profile facts remain TODO markers rather than invented content.
