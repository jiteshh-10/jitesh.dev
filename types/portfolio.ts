export type Project = {
  slug: string
  name: string
  tagline: string
  description: string
  problem: string
  solution: string
  technologies: string[]
  concepts: string[]
  status: string
  accent: 'turquoise' | 'purple' | 'yellow' | 'coral'
  github?: string
  liveUrl?: string
}

export type Experience = { company: string; role: string; period: string; note: string; modules?: string[]; technologies?: string[] }
export type SkillGroup = { label: string; skills: string[] }
export type Education = { school: string; program: string; period: string; results: string[] }
export type SocialLink = { label: string; href: string }
export type IllustrationPart = 'head' | 'hair' | 'eyes' | 'body' | 'arms' | 'legs' | 'shoes' | 'laptop'

export const TODO = 'TODO: add verified details'
export const TODO_URL = '#'
