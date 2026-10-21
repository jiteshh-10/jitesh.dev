'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/types/portfolio'
import { ProjectMedia } from './ProjectMedia'

gsap.registerPlugin(ScrollTrigger)

type ProjectStackProps = { projects: Project[] }

/*
 * One authoritative pinned stage (desktop ≥801px):
 *  - card 0 is fully visible before the pin engages (no blank stage),
 *  - outgoing copy exits BEFORE the incoming copy enters (never two readable titles),
 *  - incoming media reveals first, then title, then supporting content,
 *  - forward and backward scrolling both scrub the same timeline,
 *  - React holds the only active-index state; GSAP reads progress to update it.
 * On narrow viewports / reduced motion everything falls back to normal flow.
 */

const HOLD = 0.9
const EXIT = 0.38
const ENTER = 0.55
/** Scroll distance granted to one project, in px. Keeps the pinned band tight
 *  so the section never reads as a long empty region. */
const PER_PROJECT = 330

function buildEnter(card: HTMLElement) {
  const q = gsap.utils.selector(card)
  const enter = gsap.timeline({ defaults: { ease: 'power3.out' } })
  enter
    .fromTo(q('[data-media]'), { autoAlpha: 0, scale: 0.955, y: 14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.58, ease: 'power2.out' }, 0)
    .fromTo(q('.project-case-number'), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34 }, 0.14)
    .fromTo(q('.project-number'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34 }, 0.2)
    .fromTo(q('.project-name [data-mask]'), { yPercent: 112 }, { yPercent: 0, duration: 0.56 }, 0.22)
    .fromTo(q('.project-tagline [data-mask]'), { yPercent: 112 }, { yPercent: 0, duration: 0.5 }, 0.36)
    .fromTo(q('[data-fade]'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.06 }, 0.44)
    .fromTo(q('[data-stagger]'), { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.035, ease: 'power2.out' }, 0.52)
  return enter
}

function buildExit(card: HTMLElement) {
  const q = gsap.utils.selector(card)
  const exit = gsap.timeline({ defaults: { ease: 'power2.in' } })
  exit
    .to(q('.project-copy-meta'), { y: -10, autoAlpha: 0, duration: 0.3 }, 0)
    .to(q('[data-stagger]'), { y: -8, autoAlpha: 0, duration: 0.3, stagger: 0.02 }, 0.02)
    .to(q('[data-fade]'), { y: -12, autoAlpha: 0, duration: 0.32, stagger: 0.03 }, 0.05)
    .to(q('.project-tagline [data-mask]'), { yPercent: -112, duration: 0.4 }, 0.1)
    .to(q('.project-name [data-mask]'), { yPercent: -112, duration: 0.42 }, 0.14)
    .to(q('[data-media]'), { autoAlpha: 0, scale: 0.97, y: -10, duration: 0.38 }, 0.18)
  return exit
}

function ProjectCaseStudy({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <article className={`project-case-study${active ? ' is-active' : ''}`}>
      <div className="project-copy">
        <div className="project-copy-meta">
          <p className="project-case-number" aria-hidden="true">0{index + 1}</p>
          <p className="project-number">{project.category}</p>
        </div>
        <h3 className="project-name mask"><span data-mask>{project.name}</span></h3>
        <p className="project-tagline mask"><span data-mask>{project.headline}</span></p>
        <p className="project-description" data-fade>{project.description}</p>
      </div>
      <div data-media>
        <ProjectMedia project={project} index={index} active={active} />
      </div>
      <div className="project-detail">
        <div className="engineering-list" data-fade>
          <strong>Engineering</strong>
          <ul>{project.engineering.map((item) => <li data-stagger key={item}>{item}</li>)}</ul>
        </div>
        <div className="tag-list" data-fade>{project.technologies.map((tech) => <span data-stagger key={tech}>{tech}</span>)}</div>
        <div className="project-links" data-fade>
          {project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  )
}

export function ProjectStack({ projects }: ProjectStackProps) {
  const root = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const section = root.current
    if (!section) return
    const stage = section.querySelector<HTMLElement>('.project-stage')
    const cards = gsap.utils.toArray<HTMLElement>('.project-stage .project-case-study', section)
    if (!stage || !cards.length) return

    const media = gsap.matchMedia()
    /* The cinematic pinned stage needs a normal-height viewport. On very tall
       viewports (or full-page captures) the pin would leave a long empty band,
       so the four projects stay in normal document flow instead. */
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 1120px) and (max-height: 1700px)', () => {
      /* React's is-active class owns container visibility/pointer-events; GSAP animates children only. */

      /* Master timeline: hold → exit → enter → hold … */
      const master = gsap.timeline()
      let position = 0
      const switchPoints: number[] = []

      cards.forEach((card, index) => {
        if (index > 0) master.add(buildEnter(card), position)
        position += index > 0 ? ENTER : 0
        master.add(gsap.timeline().to({}, { duration: HOLD }), position) // explicit hold
        position += HOLD
        if (index < cards.length - 1) {
          master.add(buildExit(card), position)
          position += EXIT
          switchPoints.push(position)
        }
      })

      const total = position

      /* Mark the stage as pinned only while the cinematic sequence is in charge.
         Without it (no JS, reduced motion, narrow or very tall viewports) the
         four projects stay in normal document flow and remain readable. */
      stage.classList.add('is-pinned')

      ScrollTrigger.create({
        trigger: section,
        start: 'top top+=88',
        end: () => `+=${Math.round(total * PER_PROJECT)}`,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        animation: master,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const time = self.progress * total
          let next = 0
          while (next < switchPoints.length && time >= switchPoints[next]) next += 1
          setActiveIndex((current) => (current === next ? current : next))
        },
      })

      setActiveIndex(0)
      return () => {
        master.kill()
        stage.classList.remove('is-pinned')
      }
    })

    /* Flow mode (narrow, tall, reduced motion, or no JS): the four projects
       read as one continuous story. The index still tracks the project the
       reader is on, so the progress indicator stays truthful. */
    media.add('(prefers-reduced-motion: reduce), (max-width: 1119px), (min-height: 1701px)', () => {
      const triggers: ScrollTrigger[] = []
      cards.forEach((card, index) => {
        triggers.push(ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index)
          },
        }))
      })
      return () => triggers.forEach((trigger) => trigger.kill())
    })
    return () => media.revert()
  }, { scope: root, dependencies: [projects.length] })

  return (
    <div ref={root} className="project-storytelling" aria-label="Selected projects">
      <div className="project-index" aria-hidden="true">
        <div className="project-index-numbers">
          {projects.map((project, index) => <span key={project.slug} className={index === activeIndex ? 'is-active' : ''}>0{index + 1}</span>)}
          <i>/ 0{projects.length}</i>
        </div>
        <div className="project-index-ticks">
          {projects.map((project, index) => <i key={project.slug} className={index === activeIndex ? 'is-active' : ''} />)}
        </div>
      </div>
      <div className="project-stage" aria-live="polite">
        {projects.map((project, index) => <ProjectCaseStudy project={project} index={index} active={index === activeIndex} key={project.slug} />)}
      </div>
    </div>
  )
}
