import gsap from 'gsap'

export function animateProjectScene(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  return gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: root, start: 'top 78%', once: true },
  })
    .from(q('[data-scene-environment]'), { scale: 0.96, opacity: 0, duration: 0.55 })
    .from(q('[data-scene-character]'), { x: 28, y: 18, opacity: 0, duration: 0.65 }, '-=0.3')
    .from(q('[data-scene-object]'), { scale: 0.82, opacity: 0, duration: 0.55 }, '-=0.4')
    .from(q('[data-scene-copy] > *'), { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.35')
}
