import { Analytics } from '@vercel/analytics/next'
import { Bricolage_Grotesque, Caveat, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider, ThemeScript } from '@/components/theme/ThemeProvider'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' })
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const note = Caveat({ subsets: ['latin'], variable: '--font-note' })

export const metadata: Metadata = { title: 'Jitesh Sen — Software Engineer & Problem Solver', description: 'I build software around real constraints — backend systems, full-stack products, and mobile applications.', generator: 'Next.js' }
export const viewport: Viewport = { colorScheme: 'light dark', themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f7f2e8' }, { media: '(prefers-color-scheme: dark)', color: '#151613' }], userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${note.variable}`}>
<head><ThemeScript /></head><body className="antialiased"><ThemeProvider>{children}</ThemeProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
