'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import type { Project } from '@/types/portfolio'

gsap.registerPlugin(ScrollTrigger)

const accents: Record<Project['accent'], string> = { turquoise: 'project-turquoise', purple: 'project-purple', yellow: 'project-yellow', coral: 'project-coral' }

export function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]')
      const intro = gsap.utils.toArray<HTMLElement>('[data-project-reveal]')
      gsap.set(cards, { autoAlpha: 0, y: 36, scale: 0.985 })
      gsap.set(cards[0], { autoAlpha: 1, y: 0, scale: 1 })
      const trigger = ScrollTrigger.create({
        trigger: viewportRef.current,
        start: 'top top+=72',
        end: `+=${Math.max(window.innerHeight * projects.length, 2400)}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(projects.length - 1, Math.floor(self.progress * projects.length))
          setActiveIndex((current) => current === next ? current : next)
          cards.forEach((card, index) => {
            const distance = index - self.progress * projects.length
            const active = index === next
            gsap.set(card, { autoAlpha: active ? 1 : 0, y: active ? 0 : distance < 0 ? -28 : 28, scale: active ? 1 : 0.985, pointerEvents: active ? 'auto' : 'none' })
          })
        },
      })
      gsap.fromTo(intro, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } })
      return () => trigger.kill()
    }, sectionRef)
    return () => context.revert()
  }, [])

  return (
    <section ref={sectionRef} className="project-gallery" aria-labelledby="project-gallery-title">
      <div className="section-heading" data-project-reveal>
        <p className="eyebrow">01 / projects</p>
        <h2 id="project-gallery-title">Built around<br /><em>real constraints.</em></h2>
        <p>I usually start with the problem, not the technology. Four engineering stories, revealed one chapter at a time.</p>
      </div>
      <div ref={viewportRef} className="project-storytelling-viewport" aria-label="Selected projects">
        <div className="project-local-index" aria-label={`Project ${activeIndex + 1} of ${projects.length}`}>
          {projects.map((project, index) => <span key={project.slug} className={index === activeIndex ? 'is-active' : ''}>{String(index + 1).padStart(2, '0')}</span>)}
        </div>
        <div className="project-card-stage">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-case-study ${accents[project.accent]}`} data-project-card aria-labelledby={`project-${project.slug}`}>
      <div className="project-case-study-copy">
        <p className="eyebrow">{project.status}</p>
        <p className="project-case-number">0{index + 1}</p>
        <h3 id={`project-${project.slug}`}>{project.name}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <div className="project-meta">
          <div><strong>Problem</strong><span>{project.problem}</span></div>
          <div><strong>Approach</strong><span>{project.solution}</span></div>
        </div>
        <div className="engineering-list"><strong>Engineering</strong><ul>{project.engineering.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="tag-list">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="project-links">
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">View live demo <span>↗</span></a>}
          {project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View GitHub <span>↗</span></a>}
        </div>
      </div>
      <ProjectMedia project={project} index={index} />
    </article>
  )
}
