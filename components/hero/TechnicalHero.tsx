'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { DeskComputerLocal } from './DeskComputerLocal'

gsap.registerPlugin(ScrollTrigger)

export function TechnicalHero() {
  const root = useRef<HTMLElement>(null)
  const board = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      /* Phase 1-4: brand → headline (mask rise) → copy → CTAs.
         Explicit fromTo values (never a bare .from) so the entrance can never
         leave an element hidden if a tween is interrupted. */
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: calm ? 0 : 0.15 })
      const settle = () => {
        gsap.set('.hero-kicker, .hero-kicker-mark, .hero-title-line, .hero-description, .hero-capabilities, .hero-actions', { clearProps: 'transform,opacity,visibility' })
      }
      intro
        .fromTo('.hero-kicker', { y: calm ? 0 : 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: calm ? 0.4 : 0.45 }, 0)
        .fromTo('.hero-kicker-mark', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: calm ? 0.4 : 0.5, ease: 'power2.inOut' }, '-=0.25')
        .fromTo('.hero-title-line', { yPercent: calm ? 0 : 64, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: calm ? 0.5 : 0.8, stagger: 0.09 }, '-=0.3')
        .fromTo('.hero-description', { y: calm ? 0 : 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: calm ? 0.4 : 0.5 }, '-=0.4')
        .fromTo('.hero-capabilities', { y: calm ? 0 : 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: calm ? 0.4 : 0.45 }, '-=0.32')
        .fromTo('.hero-actions', { y: calm ? 0 : 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: calm ? 0.4 : 0.45 }, '-=0.24')
        .add(settle)

      /* Phase 5: the engineering board draws itself */
      const boardIntro = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: calm ? 0.2 : 0.55 })
      boardIntro
        .from('.technical-board', { y: calm ? 0 : 24, autoAlpha: 0, duration: calm ? 0.5 : 0.7, ease: 'power3.out' }, 0)
        .from('.board-projects span', { y: calm ? 0 : 10, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, 0.4)

      /* Scroll-linked: board drifts gently out of view, then hands off to projects */
      gsap.to('.technical-board', {
        y: -40,
        scale: 0.94,
        autoAlpha: 0.55,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 60%', scrub: 0.6 },
      })
      gsap.fromTo('.project-gallery .section-heading', { y: 40, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-gallery', start: 'top 85%', once: true },
        immediateRender: false,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  /* The computer's screen elements only exist once the figure has loaded, so
     their scroll-linked work is attached on the figure:ready signal. */
  useEffect(() => {
    const attach = () => {
      const glow = document.querySelector('.pc-glow')
      const scan = document.querySelector('.pc-scan')
      if (!glow || !scan) return
      gsap.to(glow, {
        opacity: 0.02,
        scale: 1.4,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 60%', scrub: 0.6 },
      })
      gsap.to(scan, {
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 60%', scrub: 0.6 },
      })
    }
    attach()
    window.addEventListener('figure:ready', attach)
    return () => window.removeEventListener('figure:ready', attach)
  }, [])

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">Jitesh Sen <span>/</span> Software Engineer <span aria-hidden="true" className="hero-kicker-mark" /></p>
        <h1 id="hero-title">
          <span className="hero-title-line">I build software</span>
          <span className="hero-title-line">around <em>real</em></span>
          <span className="hero-title-line">constraints<span className="hero-period" aria-hidden="true">.</span></span>
        </h1>
        <p className="hero-description">
          I&apos;m Jitesh Sen, a 2026 Computer Science graduate and software engineer focused
          on backend systems, full-stack products, mobile applications, and practical engineering.
        </p>
        <p className="hero-capabilities">Java · Spring Boot · React · Flutter · SQL · REST APIs · Microservices</p>
        <div className="hero-actions">
          <a className="button button-dark" href="#projects">View selected work <span aria-hidden="true">→</span></a>
          <a className="text-link" href="#contact">Let&apos;s build together <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div ref={board} className="technical-board" aria-label="A technical sketch showing APIs, services, and data flow">
        <span className="board-orbit board-orbit-one" aria-hidden="true" />
        <span className="board-orbit board-orbit-two" aria-hidden="true" />
        <span className="board-scanline" aria-hidden="true" />
        <div className="board-top"><span>sys / 01</span><span>problem → system → outcome</span></div>
        <DeskComputerLocal />
        <div className="board-projects">{projects.map((project, index) => <span key={project.slug}><b>0{index + 1}</b> {project.name}</span>)}</div>
      </div>
    </section>
  )
}
