'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'

gsap.registerPlugin(ScrollTrigger)

export function TechnicalHero() {
  const root = useRef<HTMLElement>(null)
  const board = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        /* Phase 1-4: brand → headline (mask rise) → copy → CTAs */
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        intro
          .from('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.45 })
          .from('.hero-kicker-mark', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.inOut' }, '-=0.25')
          .from('.hero-title-line', { yPercent: 64, autoAlpha: 0, duration: 0.8, stagger: 0.09 }, '-=0.3')
          .from('.hero-description', { y: 18, autoAlpha: 0, duration: 0.5 }, '-=0.4')
          .from('.hero-capabilities', { y: 14, autoAlpha: 0, duration: 0.45 }, '-=0.32')
          .from('.hero-actions', { y: 14, autoAlpha: 0, duration: 0.45 }, '-=0.24')

        /* Phase 5: the engineering board draws itself */
        const boardIntro = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.55 })
        const lines = board.current?.querySelectorAll<SVGPathElement>('.diagram-line') ?? []
        lines.forEach((line) => {
          const length = line.getTotalLength()
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
          boardIntro.to(line, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.05)
        })
        boardIntro
          .from('.diagram-node', { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: 0.09, ease: 'back.out(1.6)', transformOrigin: 'center center' }, 0.35)
          .from('.diagram-node text, .diagram-note, .diagram-label', { autoAlpha: 0, duration: 0.45, stagger: 0.05 }, 0.55)
          .from('.board-projects span', { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, 0.6)

        /* Scroll-linked: board drifts gently out of view */
        gsap.to('.technical-board', {
          y: -26,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }, root)
    return () => ctx.revert()
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
        <svg viewBox="0 0 620 540" role="img" aria-label="Abstract software architecture diagram: an API node connects through a service to a data store, with a user node on the flow" className="architecture-diagram">
          <path className="diagram-line" d="M90 170 L285 110 L465 185 L350 320 L150 350 Z" />
          <path className="diagram-line secondary" d="M285 110 L350 320 M465 185 L150 350" />
          <path className="diagram-line secondary" d="M350 320 L505 420 M150 350 L90 445" />
          <g className="diagram-node node-api"><circle cx="90" cy="170" r="34" /><text x="90" y="175" textAnchor="middle">API</text></g>
          <g className="diagram-node node-service"><rect x="235" y="70" width="100" height="80" /><text x="285" y="115" textAnchor="middle">SERVICE</text></g>
          <g className="diagram-node node-data"><circle cx="465" cy="185" r="42" /><text x="465" y="181" textAnchor="middle">DATA</text><text x="465" y="197" textAnchor="middle">STORE</text></g>
          <g className="diagram-node node-user"><rect x="105" y="315" width="90" height="70" /><text x="150" y="356" textAnchor="middle">USER</text></g>
          <g className="diagram-node node-edge"><circle cx="350" cy="320" r="28" /><text x="350" y="325" textAnchor="middle">↗</text></g>
          <text className="diagram-note" x="42" y="468">constraints are part of the design</text>
          <text className="diagram-label" x="418" y="452">build / test / improve</text>
        </svg>
        <div className="board-projects">{projects.map((project, index) => <span key={project.slug}><b>0{index + 1}</b> {project.name}</span>)}</div>
      </div>
    </section>
  )
}
