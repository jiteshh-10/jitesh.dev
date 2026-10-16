'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Script from 'next/script'

type Theme = 'light' | 'dark'
type ThemeContextValue = { theme: Theme; toggleTheme: (origin?: { x: number; y: number }) => void }

const STORAGE_KEY = 'jitesh-portfolio-theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const nextTheme = saved === 'dark' || saved === 'light' ? saved : getSystemTheme()
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const apply = () => {
      document.documentElement.dataset.theme = nextTheme
      setTheme(nextTheme)
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    }

    if (!reduceMotion && document.startViewTransition) {
      const transition = document.startViewTransition(apply)
      transition.ready.then(() => {
        const x = origin?.x ?? window.innerWidth / 2
        const y = origin?.y ?? window.innerHeight / 2
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' },
        )
      }).catch(() => undefined)
    } else {
      apply()
    }
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}

export function ThemeScript() {
  return <Script id="theme-preload" strategy="beforeInteractive">{`(() => { try { const key = '${STORAGE_KEY}'; const saved = localStorage.getItem(key); const theme = saved === 'dark' || saved === 'light' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = theme; } catch {} })()`}</Script>
}
