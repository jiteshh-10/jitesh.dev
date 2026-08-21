'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { createHeroTimeline, breatheCharacter } from '@/animations/hero'
import { HeroIllustration } from './HeroIllustration'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => { const mm = gsap.matchMedia(); mm.add('(prefers-reduced-motion: no-preference)', () => { createHeroTimeline(root.current!); breatheCharacter(root.current!) }); return () => mm.revert() }, { scope: root })
  return <section ref={root} id="story" className="hero"><div className="hero-copy"><p className="eyebrow" data-hero-eyebrow>Jitesh Sen · Computer Science Engineer</p><h1><span data-hero-line>I DON&apos;T JUST</span><span className="ink" data-hero-line>WRITE CODE.</span><span data-hero-line>I BUILD THINGS</span><span className="coral" data-hero-line>AROUND PROBLEMS.</span></h1><p className="hero-description" data-hero-copy>I&apos;m Jitesh Sen — a Computer Science Engineer who enjoys turning real-world problems and constraints into software.</p><div className="hero-actions" data-hero-copy><a className="button button-dark" href="#projects">Explore the work <span>↓</span></a><span className="annotation">Computer Science Engineer<br />Software Developer · Builder</span></div></div><HeroIllustration /><div className="hero-stamp">01<br /><span>problem<br />solver</span></div></section>
}
