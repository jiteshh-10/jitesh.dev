'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '@/lib/constants'

export function Navbar() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><a className="brand" href="#top" aria-label="Jitesh Sen home">JS<span>.</span></a><nav className="desktop-nav" aria-label="Primary navigation">{site.nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{site.nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}</nav>}</header>
}
