import gsap from 'gsap'

export const createHeroTimeline = (root: HTMLElement) => {
  const q = gsap.utils.selector(root)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(q('[data-hero-environment]'), { opacity: 0, scale: 1.03, duration: 0.55 })
    .from(q('[data-hero-tech]'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.4 }, '-=0.25')
    .from(q('[data-character]'), { x: 80, y: 36, opacity: 0, rotate: 5, duration: 0.9 }, '-=0.15')
    .from(q('[data-hero-eyebrow]'), { y: 16, opacity: 0, duration: 0.45 }, '-=0.4')
    .from(q('[data-hero-line]'), { y: 70, opacity: 0, rotate: 2, stagger: 0.08, duration: 0.72 }, '-=0.25')
    .from(q('[data-hero-copy]'), { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from(q('[data-doodle]'), { scale: 0, opacity: 0, stagger: 0.08, duration: 0.35 }, '-=0.45')
  return tl
}

export const breatheCharacter = (root: HTMLElement) => gsap.to(root.querySelector('[data-character-part="body"]'), { y: -4, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
