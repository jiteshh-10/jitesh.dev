'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }}
    >
      <span className="sr-only">Switch to {nextTheme} mode</span>
      <span className="theme-toggle-icon" aria-hidden="true">{theme === 'dark' ? <Moon /> : <Sun />}</span>
      <span className="theme-toggle-label" aria-hidden="true">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}
