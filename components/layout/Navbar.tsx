'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '@/lib/constants'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('projects')

  useEffect(() => {
    const sections = site.nav.map((item) => document.getElementById(item.toLowerCase())).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.6] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <header className={`site-header${active ? ' has-active-section' : ''}`}><a className="brand" href="#top" aria-label="Jitesh Sen home">JS<span>.</span></a><nav className="desktop-nav" aria-label="Primary navigation">{site.nav.map((item) => { const target = item.toLowerCase(); return <a key={item} className={active === target ? 'is-active' : ''} aria-current={active === target ? 'page' : undefined} href={`#${target}`}>{item}</a> })}</nav><div className="header-actions"><ThemeToggle /><button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav className="mobile-nav" aria-label="Mobile navigation"><ThemeToggle />{site.nav.map((item) => { const target = item.toLowerCase(); return <a key={item} className={active === target ? 'is-active' : ''} aria-current={active === target ? 'page' : undefined} href={`#${target}`} onClick={() => setOpen(false)}>{item}</a> })}</nav>}</header>
}
