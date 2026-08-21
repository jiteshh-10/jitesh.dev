# Animation Guide

GSAP is isolated in `animations/hero.ts` and mounted only from the client Hero via `useGSAP`. Use `gsap.matchMedia()` for responsive behavior, return cleanup through the GSAP context, and animate transforms/opacity for frequent motion. `prefers-reduced-motion` skips the timeline and leaves the complete hierarchy visible.
