'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { site } from '@/lib/constants'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('projects')
  const [scrolled, setScrolled] = useState(false)
  const header = useRef<HTMLElement>(null)

  /* Coordinated entrance: logo → nav items → controls → hairline */
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const q = gsap.utils.selector(header)
    gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.08 })
      .from(q('.brand'), { y: -14, autoAlpha: 0, duration: 0.4 })
      .from(q('.desktop-nav a'), { y: -10, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, 0.12)
      .from(q('.theme-toggle, .menu-button'), { autoAlpha: 0, scale: 0.85, duration: 0.35, stagger: 0.08 }, 0.3)
      .fromTo(q('[data-header-rule]'), { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, 0.2)
  }, { scope: header })

  /* Active section tracking */
  useEffect(() => {
    const sections = site.nav
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.6] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  /* Surface treatment once the header floats over content */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close the mobile panel on viewport growth */
  useEffect(() => {
    if (!open) return
    const onResize = () => { if (window.innerWidth > 800) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  return (
    <header ref={header} className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <a className="brand" href="#top" aria-label="Jitesh Sen home">JS<span>.</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {site.nav.map((item) => {
          const target = item.toLowerCase()
          return (
            <a key={item} className={active === target ? 'is-active' : ''} aria-current={active === target ? 'page' : undefined} href={`#${target}`}>
              {item}
            </a>
          )
        })}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <button
          className="menu-button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <span className="header-rule" data-header-rule aria-hidden="true" />
      <nav id="mobile-nav" className={`mobile-nav${open ? ' is-open' : ''}`} aria-label="Mobile navigation">
        {site.nav.map((item) => {
          const target = item.toLowerCase()
          return (
            <a key={item} className={active === target ? 'is-active' : ''} aria-current={active === target ? 'page' : undefined} href={`#${target}`} onClick={() => setOpen(false)}>
              {item}<span aria-hidden="true">→</span>
            </a>
          )
        })}
      </nav>
    </header>
  )
}
