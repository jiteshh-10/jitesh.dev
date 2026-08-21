'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/portfolio'
import { EcoDropIllustration, ContextaIllustration, HabitualzIllustration, MinimizUrlIllustration } from '@/components/illustrations/ProjectIllustrations'

gsap.registerPlugin(ScrollTrigger)

const accents = { turquoise: 'project-turquoise', purple: 'project-purple', yellow: 'project-yellow', coral: 'project-coral' }
const illustrations = [EcoDropIllustration, ContextaIllustration, HabitualzIllustration, MinimizUrlIllustration]

export function ProjectGallery() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.project-scene').forEach((scene) => {
          const q = gsap.utils.selector(scene)
          gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 80%', once: true } })
            .from(q('.project-scene-art'), { scale: .96, opacity: 0, duration: .55 })
            .from(q('.project-scene-copy > *'), { y: 16, opacity: 0, duration: .48, stagger: .055 }, '-=.32')
        })
      })
      return () => ctx.revert()
    })
    return () => mm.revert()
  })
  return <section className="project-gallery" aria-labelledby="project-gallery-title"><div className="section-heading"><p className="eyebrow">01 / projects</p><h2 id="project-gallery-title">Built around<br /><em>real constraints.</em></h2><p>I usually start with the problem, not the technology. These are the things that came out of that process.</p></div><div className="project-scenes">{projects.map((project, index) => { const Illustration = illustrations[index] ?? EcoDropIllustration; return <article className={`project-scene ${accents[project.accent]}`} key={project.slug}><div className="project-scene-art" aria-hidden="true"><Illustration /><span className="scene-index">0{index + 1}</span></div><div className="project-scene-copy"><p className="eyebrow">{project.status}</p><h3>{project.name}</h3><p className="project-tagline">{project.tagline}</p><p>{project.description}</p><div className="project-meta"><div><strong>Problem</strong><span>{project.problem}</span></div><div><strong>Approach</strong><span>{project.solution}</span></div></div><div className="tag-list">{[...project.technologies, ...project.concepts].map((item) => <span key={item}>{item}</span>)}</div>{project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View repository <span>↗</span></a>}</div></article> })}</div></section>
}
