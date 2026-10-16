'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/types/portfolio'
import { ProjectMedia } from './ProjectMedia'

gsap.registerPlugin(ScrollTrigger)

type ProjectStackProps = { projects: Project[] }

function ProjectCopy({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-case-study-copy">
      <p className="project-case-number">0{index + 1}</p>
      <p className="project-number"><span>{project.status}</span></p>
      <h3>{project.name}</h3>
      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.description}</p>
      <div className="engineering-list">
        <strong>Engineering</strong>
        <ul>{project.engineering.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="tag-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="project-links">
        {project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>}
        {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <span>↗</span></a>}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="project-case-study">
    <ProjectCopy project={project} index={index} />
    <ProjectMedia project={project} index={index} />
  </article>
}

export function ProjectStack({ projects }: ProjectStackProps) {
  const root = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const section = root.current
    const stage = section?.querySelector<HTMLElement>('.project-card-stage')
    const cards = section ? gsap.utils.toArray<HTMLElement>('.project-active-card .project-case-study', section) : []
    if (!section || !stage || !cards.length) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 801px)', () => {
      gsap.set(cards, { autoAlpha: 0, y: 28, scale: 0.985, pointerEvents: 'none' })
      gsap.set(cards[0], { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto' })
      const sequence = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      cards.forEach((card, index) => {
        if (index === 0) return
        const previous = cards[index - 1]
        sequence.to(previous, { autoAlpha: 0, y: -18, scale: 0.975, duration: 0.45, pointerEvents: 'none' }, index - 0.18)
          .fromTo(card, { autoAlpha: 0, y: 28, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, pointerEvents: 'auto' }, index)
      })
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top+=84',
        end: `+=${projects.length * 720}`,
        pin: stage,
        scrub: 0.55,
        animation: sequence,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(projects.length - 1, Math.floor(self.progress * projects.length))
          setActiveIndex((current) => current === next ? current : next)
        },
      })
      return () => { trigger.kill(); sequence.kill() }
    })
    return () => media.revert()
  }, { scope: root, dependencies: [projects.length] })

  return <section ref={root} className="project-storytelling" aria-label="Selected projects">
    <div className="project-storytelling-viewport">
      <div className="project-local-index" aria-label="Current project">
        {projects.map((project, index) => <span className={index === activeIndex ? 'is-active' : ''} key={project.slug}>0{index + 1}</span>)}
        <i>/ {String(projects.length).padStart(2, '0')}</i>
      </div>
      <div className="project-card-stage">
        <div className="project-active-card" aria-live="polite">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
        <div className="project-mobile-cards">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
      </div>
    </div>
  </section>
}
