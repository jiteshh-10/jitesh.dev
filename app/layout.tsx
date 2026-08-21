import { Analytics } from '@vercel/analytics/next'
import { Bricolage_Grotesque, Caveat, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' })
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const note = Caveat({ subsets: ['latin'], variable: '--font-note' })

export const metadata: Metadata = { title: 'Jitesh Sen — Software Engineer & Problem Solver', description: 'An illustrated portfolio about turning problems into things people can use.', generator: 'Next.js' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f5f0e8', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${display.variable} ${body.variable} ${note.variable}`}><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
