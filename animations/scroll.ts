import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Section scaffolding: everything inside [data-reveal-section] enters as it scrolls into view. */
export function createSectionReveal(root: HTMLElement) {
  const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
  if (targets.length) {
    targets.forEach((target) => gsap.fromTo(target, { y: 60, autoAlpha: 0, scale: 0.985 }, {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: { trigger: target, start: 'top 84%', once: true },
      immediateRender: false,
    }))
  }
  return []
}

/* Thin rules sweep open as sections arrive. */
export function createRuleSweep(root: HTMLElement) {
  const targets = gsap.utils.toArray<HTMLElement>('[data-sweep]', root)
  if (!targets.length) return gsap.timeline()
  return gsap.fromTo(targets, { scaleX: 0, transformOrigin: 'left center' }, {
    scaleX: 1,
    duration: 0.85,
    stagger: 0.08,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    immediateRender: false,
  })
}

/* Story: the connecting line draws while each step activates, dims previous steps. */
export function createStoryProgress(section: HTMLElement) {
  const line = section.querySelector<HTMLElement>('[data-process-line]')
  const steps = gsap.utils.toArray<HTMLElement>('.process-step', section)
  const triggers: ScrollTrigger[] = []

  if (line) {
    gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 70%', end: '+=48%', scrub: 0.6 },
    })
  }

  const setStates = (activeIndex: number) => {
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === activeIndex)
      step.classList.toggle('is-passed', index < activeIndex)
    })
  }
  setStates(steps[0] && Math.abs(steps[0].getBoundingClientRect().top) < window.innerHeight ? 0 : -1)

  steps.forEach((step, index) => {
    triggers.push(ScrollTrigger.create({
      trigger: step,
      start: 'top 68%',
      end: 'bottom 8%',
      onToggle: (self) => {
        if (self.isActive) setStates(index)
        else if (index === steps.length - 1 && self.progress === 1) setStates(index) // keep the last one settled
      },
    }))
  })
  return () => {
    triggers.forEach((trigger) => trigger.kill())
    steps.forEach((step) => step.classList.remove('is-active', 'is-passed'))
  }
}

/* Accordion bodies animate open/closed while native <details> keeps keyboard + a11y behavior. */
export function createAccordions(root: HTMLElement) {
  const items = gsap.utils.toArray<HTMLDetailsElement>('details[data-acc]', root)
  const cleanups: Array<() => void> = []
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  items.forEach((item) => {
    const summary = item.querySelector<HTMLElement>(':scope > summary')
    const body = item.querySelector<HTMLElement>(':scope > [data-acc-body]')
    if (!summary || !body) return

    const onSummaryClick = (event: MouseEvent) => {
      if (reduced()) return // native toggle, instant
      event.preventDefault()
      if (item.open) {
        gsap.to(body, {
          autoAlpha: 0,
          duration: 0.24,
          ease: 'power2.in',
          onComplete: () => {
            item.open = false
            gsap.set(body, { clearProps: 'all' })
          },
        })
      } else {
        item.open = true
        const height = body.offsetHeight
        gsap.fromTo(body, { height: 0, autoAlpha: 0 }, {
          height,
          autoAlpha: 1,
          duration: 0.34,
          ease: 'power2.out',
          onComplete: () => gsap.set(body, { clearProps: 'all' }),
        })
      }
    }
    summary.addEventListener('click', onSummaryClick)
    cleanups.push(() => summary.removeEventListener('click', onSummaryClick))
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}

/* Quiet parallax for decorative layers. */
export function createParallaxLayers(root: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', root)
  if (!layers.length) return []
  return layers.map((layer) => gsap.fromTo(layer, { yPercent: 0 }, {
    yPercent: Number(layer.dataset.parallax ?? 8),
    ease: 'none',
    scrollTrigger: { trigger: layer, scrub: true, start: 'top bottom', end: 'bottom top' },
    immediateRender: false,
  }))
}

/* Reading progress along the whole editorial flow. */
export function createProgressBar(root: HTMLElement) {
  const bar = root.querySelector<HTMLElement>('[data-progress-bar]')
  if (!bar) return null
  return gsap.fromTo(bar, { scaleX: 0 }, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true },
    immediateRender: false,
  })
}
