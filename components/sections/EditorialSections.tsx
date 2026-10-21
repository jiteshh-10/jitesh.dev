'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { projects, experience, skillGroups, education, socials, certifications, bring, contactPrimary, site } from '@/data/portfolio'
import { ProjectStack } from '@/components/projects/ProjectStack'
import { createSectionReveal, createRuleSweep, createStoryProgress, createAccordions, createProgressBar } from '@/animations/scroll'

export function EditorialSections() {
  const root = useRef<HTMLDivElement>(null)
  const story = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!root.current) return
    const cleanup: Array<() => void> = []
    /* Reveals and progress run in every motion mode; the helpers themselves
       drop the travel when the visitor asks for reduced motion. */
    createSectionReveal(root.current!)
    createRuleSweep(root.current!)
    createProgressBar(root.current!)
    if (story.current) cleanup.push(createStoryProgress(story.current))
    const expLine = root.current!.querySelector<HTMLElement>('[data-experience-line]')
    if (expLine) {
      const tween = gsap.fromTo(expLine, { scaleY: 0, transformOrigin: 'top center' }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: expLine.parentElement!, start: 'top 80%', end: 'bottom 20%', scrub: 0.6 },
        immediateRender: false,
      })
      cleanup.push(() => tween.kill())
    }
    /* Accordions animate always, but stay instant under reduced motion */
    cleanup.push(createAccordions(root.current!))
    return () => {
      cleanup.forEach((fn) => fn())
    }
  }, { scope: root })

  return (
    <div ref={root} className="editorial-sections">
      <div className="global-progress" aria-hidden="true"><span data-progress-bar /></div>

      {/* 01 — Selected projects */}
      <section id="projects" className="project-gallery" aria-labelledby="projects-title">
        <header className="section-heading">
          <div data-reveal>
            <p className="eyebrow">01 / selected projects</p>
            <h2 id="projects-title">Built around<br /><em>real</em><br />constraints.</h2>
            <span className="section-rule" data-sweep aria-hidden="true" />
          </div>
          <div data-reveal>
            <p>Four projects across offline systems, backend engineering, AI-assisted reading, and mobile product development.</p>
            <p className="scroll-cue">Scroll to explore <span aria-hidden="true">↓</span></p>
          </div>
        </header>
        <ProjectStack projects={projects} />
      </section>

      {/* 02 — How I work */}
      <section id="story" ref={story} className="process-section" aria-labelledby="story-title" data-reveal-section>
        <div data-reveal>
          <p className="eyebrow">02 / how i work</p>
          <h2 id="story-title">Start with the<br /><em>problem.</em></h2>
          <span className="section-rule section-rule-dark" data-sweep aria-hidden="true" />
        </div>
        <p className="section-lede" data-reveal>I start with the constraint, understand the system, and choose the technology that actually solves it.</p>
        <div className="process-line" data-process-line aria-hidden="true" />
        <ol className="process-grid" aria-label="How I work, four stages">
          {[['Problem', 'What needs to change?'], ['Constraints', 'What cannot be compromised?'], ['Decision', 'What architecture or technology fits?'], ['Implementation', 'Build, test, refine.']].map(([title, detail], index) => (
            <li className="process-step" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
        <div className="bring-grid" data-reveal>
          {bring.map((item) => (
            <div key={item.label}>
              <span className="eyebrow">{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Experience */}
      <section id="experience" className="future-section experience-section" aria-labelledby="experience-title" data-reveal-section>
        <div data-reveal>
          <p className="eyebrow">03 / experience</p>
          <h2 id="experience-title">Learning by<br /><em>building.</em></h2>
          <span className="section-rule" data-sweep aria-hidden="true" />
        </div>
        <div className="experience-list">
          <div className="experience-line" data-experience-line aria-hidden="true" />
          {experience.map((item) => (
            <article className="experience-item" key={item.company} data-reveal>
              <div className="experience-period-row">
                <span className="experience-period">{item.period}</span>
                <span className="experience-marker" aria-hidden="true" />
              </div>
              <h3>{item.company}</h3>
              <p className="experience-role"><strong>{item.role}</strong></p>
              <p className="experience-note">{item.note}</p>
              {item.modules && <div className="module-list">{item.modules.map((module) => <span key={module} data-stagger-sm>{module}</span>)}</div>}
              {item.technologies && <p className="experience-tech">{item.technologies.join(' · ')}</p>}
            </article>
          ))}
        </div>
      </section>

      {/* 04 — Toolbox */}
      <section id="toolbox" className="future-section toolbox-section" aria-labelledby="toolbox-title" data-reveal-section>
        <div data-reveal>
          <p className="eyebrow">04 / toolbox</p>
          <h2 id="toolbox-title">Tools for the<br /><em>work.</em></h2>
          <span className="section-rule" data-sweep aria-hidden="true" />
        </div>
        <p className="toolbox-intro" data-reveal>An interconnected stack for backend systems, full-stack products, mobile applications, and delivery.</p>
        <div className="skill-map" data-reveal aria-hidden="true">
          <span>Java 17</span><i>↓</i><span>Spring / REST</span><i>↓</i><span>Security / Data</span><i>↓</i><span>Testing / Delivery</span>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <details className="skill-item" data-acc key={group.label}>
              <summary>
                {group.label}
                <span className="acc-icon" aria-hidden="true"><i /><i /></span>
              </summary>
              <div data-acc-body>
                <p>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 05 — Profile */}
      <section id="about" className="future-section about-section" aria-labelledby="about-title" data-reveal-section>
        <div data-reveal>
          <p className="eyebrow">05 / profile</p>
          <h2 id="about-title">The engineer<br /><em>behind the work.</em></h2>
          <span className="section-rule" data-sweep aria-hidden="true" />
        </div>
        <div className="about-layout">
          <div data-reveal>
            <p className="about-copy">I&apos;m Jitesh Sen, a 2026 Computer Science graduate and software engineer focused on building reliable software across backend, full-stack, and mobile environments. I enjoy turning ambiguous requirements into systems that are understandable, testable, and practical to ship.</p>
          </div>
          <div className="education-card" data-reveal>
            <span>Education</span>
            {education.map((item) => (
              <div key={item.school}>
                <h3>{item.school}</h3>
                <p>{item.program}</p>
                <ul className="education-results">{item.results.map((result) => <li key={result}>{result}</li>)}</ul>
              </div>
            ))}
            <h3>Certifications</h3>
            <ul className="certification-list">{certifications.map((cert) => <li key={cert}>{cert}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* 06 — Contact */}
      <section id="contact" className="contact-section" aria-labelledby="contact-title" data-reveal-section>
        <div data-reveal>
          <p className="eyebrow">06 / contact</p>
          <h2 id="contact-title">Build something<br /><em>together.</em></h2>
          <span className="section-rule" data-sweep aria-hidden="true" />
        </div>
        <p className="contact-intro" data-reveal>Have a product idea, an internal tool, a mobile app, or a backend system that needs building?</p>
        <a className="contact-cta" data-reveal href={contactPrimary.href} target="_blank" rel="noreferrer">Start a conversation <span aria-hidden="true">↗</span></a>
        <nav className="contact-links" data-reveal aria-label="Contact links">
          {socials.map((social) => (
            <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{social.label}<span aria-hidden="true">↗</span></a>
          ))}
        </nav>
        <footer className="site-footer">
          <a className="brand" href="#top" aria-label="Back to top">JS<span>.</span></a>
          <div className="footer-meta">
            <span>© 2026 {site.name}</span>
            <span>{site.role}</span>
          </div>
          <p className="footer-note">Built with Next.js · TypeScript · GSAP</p>
        </footer>
      </section>
    </div>
  )
}
