import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createSectionReveal(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-section] > .eyebrow, [data-reveal-section] > h2, [data-reveal-section] > .section-lede, [data-reveal-section] > .section-heading, [data-reveal-section] > .experience-list, [data-reveal-section] > .skill-map, [data-reveal-section] > .skill-grid, [data-reveal-section] > .about-layout, [data-reveal-section] > .contact-intro, [data-reveal-section] > .contact-links')
  if (!targets.length) return []
  const motions: gsap.core.Tween[] = []
  targets.forEach((target, index) => {
    motions.push(gsap.fromTo(target, { y: 36, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      delay: index * 0.04,
      ease: 'power3.out',
      scrollTrigger: { trigger: target, start: 'top 88%', once: true },
    }))
  })
  return motions
}

export function createParallaxLayers(root: HTMLElement) {
  const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'))
  if (!layers.length) return []
  return layers.map((layer) => gsap.to(layer, {
    yPercent: Number(layer.dataset.parallax ?? 8),
    ease: 'none',
    scrollTrigger: { trigger: layer, scrub: true, start: 'top bottom', end: 'bottom top' },
  }))
}

export function createUnderlineSweep(root: HTMLElement) {
  const targets = root.querySelectorAll<HTMLElement>('[data-sweep]')
  if (!targets.length) return null
  return gsap.fromTo(targets, { scaleX: 0, transformOrigin: 'left center' }, {
    scaleX: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: root, start: 'top 78%', once: true },
  })
}

export function createMotionContext(root: HTMLElement, setup: () => void) {
  const media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', setup)
  return () => media.revert()
}

export function createProjectSwap(target: Element) {
  return gsap.fromTo(target, { y: 28, opacity: 0, clipPath: 'inset(0 0 12% 0)' }, {
    y: 0,
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    duration: 0.65,
    ease: 'power3.out',
  })
}

export function createProgressBar(root: HTMLElement) {
  const bar = root.querySelector<HTMLElement>('[data-progress-bar]')
  if (!bar) return null
  return gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } })
}
