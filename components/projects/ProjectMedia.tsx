'use client'

import type { Project } from '@/types/portfolio'

type ProjectMediaProps = {
  project: Project
  index: number
}

const storyBySlug: Record<string, string[]> = {
  ecodrop: ['PHONE A', 'MESSAGE', 'RELAY DEVICE', 'DESTINATION'],
  minimizurl: ['LONG URL', 'API', 'BASE62', 'DATABASE', 'SHORT URL'],
  contexta: ['BOOK', 'DIFFICULT WORD', 'CONTEXT', 'EXPLANATION', 'SAVE'],
  habitualz: ['CHECK', 'REPEAT', 'STREAK', 'PROGRESS'],
}

export function ProjectMedia({ project, index }: ProjectMediaProps) {
  const story = storyBySlug[project.slug] ?? [project.name]
  return (
    <div className={`project-media media-${project.accent}`} aria-label={`${project.name} motion demo placeholder`}>
      <div className="project-media-grid" aria-hidden="true" />
      <div className="project-media-header"><span>0{index + 1} / motion canvas</span><span>media slot</span></div>
      <div className="media-story" aria-hidden="true">
        {story.map((step, stepIndex) => <div className="media-story-step" key={step}><span className="media-story-node">{stepIndex === 0 ? '●' : '→'}</span><strong>{step}</strong></div>)}
      </div>
      <div className="project-media-footer"><span>{project.slug.toUpperCase()}</span><span>image · video · GIF · SVG</span></div>
    </div>
  )
}

export type { ProjectMediaProps }
