import gsap from 'gsap'

export const createHeroTimeline = (root: HTMLElement) => {
  const q = gsap.utils.selector(root)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(q('[data-hero-eyebrow]'), { y: 16, opacity: 0, duration: 0.5 })
    .from(q('[data-hero-line]'), { y: 70, opacity: 0, rotate: 2, stagger: 0.08, duration: 0.8 }, '-=0.25')
    .from(q('[data-hero-copy]'), { y: 20, opacity: 0, duration: 0.5 }, '-=0.35')
    .from(q('[data-character]'), { x: 80, y: 36, opacity: 0, rotate: 5, duration: 1 }, '-=0.55')
    .from(q('[data-doodle]'), { scale: 0, opacity: 0, stagger: 0.08, duration: 0.35 }, '-=0.65')
  return tl
}

export const breatheCharacter = (root: HTMLElement) => {
  const target = root.querySelector('[data-character-body]')
  return target ? gsap.to(target, { y: -4, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }) : gsap.timeline()
}
