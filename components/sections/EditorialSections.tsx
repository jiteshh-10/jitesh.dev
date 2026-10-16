'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { projects, experience, skillGroups, education, socials, certifications, bring } from '@/data/portfolio'
import { ProjectStack } from '@/components/projects/ProjectStack'
import { createMotionContext, createSectionReveal, createParallaxLayers, createUnderlineSweep, createProgressBar } from '@/animations/scroll'

export function EditorialSections() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (!root.current) return
    return createMotionContext(root.current, () => {
      createSectionReveal(root.current!)
      createParallaxLayers(root.current!)
      createUnderlineSweep(root.current!)
      createProgressBar(root.current!)
    })
  }, { scope: root })

  return <div ref={root} className="editorial-sections"><div className="global-progress" aria-hidden="true"><span data-progress-bar /></div>
    <section id="projects" className="project-gallery" aria-labelledby="projects-title" data-reveal-section>
      <div className="section-heading">
        <div><p className="eyebrow">01 / selected projects</p><h2 id="projects-title">Built around<br /><em>real constraints.</em></h2></div>
        <div><p>Four projects across offline systems, backend engineering, AI-assisted reading, and mobile product development.</p><p className="scroll-cue">Scroll to explore ↓</p></div>
      </div>
      <ProjectStack projects={projects} />
    </section>
    <section id="story" className="process-section" aria-labelledby="process-title" data-reveal-section>
      <p className="eyebrow">02 / how I work</p><h2 id="process-title">Start with the<br /><em>problem.</em></h2>
      <p className="section-lede">I start with the constraint, understand the system, and choose the technology that actually solves it.</p>
      <div className="process-line" aria-hidden="true" />
      <div className="process-grid">{[['Problem', 'What needs to change?'], ['Constraints', 'What cannot be compromised?'], ['Decision', 'What architecture or technology fits?'], ['Implementation', 'Build, test, refine.']].map(([title, detail], index) => <div className="process-step" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></div>)}</div>
      <div className="bring-grid">{bring.map((item) => <div key={item.label}><span className="eyebrow">{item.label}</span><strong>{item.value}</strong></div>)}</div>
    </section>
    <section id="experience" className="future-section" aria-labelledby="experience-title" data-reveal-section><p className="eyebrow">03 / experience</p><h2 id="experience-title">Learning by<br /><em>building.</em></h2><div className="experience-list">{experience.map((item) => <details key={item.company} open><summary><span>{item.period}</span><h3>{item.company}</h3><p><strong>{item.role}</strong></p></summary><p>{item.note}</p>{item.modules && <div className="module-list">{item.modules.map((module) => <span key={module}>{module}</span>)}</div>}{item.technologies && <p className="experience-tech">{item.technologies.join(' · ')}</p>}</details>)}</div></section>
    <section id="toolbox" className="future-section toolbox-section" aria-labelledby="toolbox-title" data-reveal-section><p className="eyebrow">04 / toolbox</p><h2 id="toolbox-title">Tools for the<br /><em>work.</em></h2><p className="toolbox-intro">An interconnected stack for backend systems, full-stack products, and delivery.</p><div className="skill-map" aria-label="Engineering stack map"><span>JAVA 17</span><i>↓</i><span>SPRING / REST</span><i>↓</i><span>SECURITY / DATA</span><i>↓</i><span>TESTING / DELIVERY</span></div><div className="skill-grid">{skillGroups.map((group) => <details key={group.label}><summary>{group.label}</summary><p>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</p></details>)}</div></section>
    <section id="about" className="future-section about-section" aria-labelledby="about-title" data-reveal-section><p className="eyebrow">05 / profile</p><h2 id="about-title">The engineer<br /><em>behind the work.</em></h2><div className="about-layout"><p className="about-copy">I&apos;m Jitesh Sen, a 2026 Computer Science graduate focused on building reliable software across backend, full-stack, and mobile environments. I enjoy turning ambiguous requirements into systems that are understandable, testable, and practical to ship.</p><div className="education-card"><span>Education</span>{education.map((item) => <div key={item.school}><h3>{item.school}</h3><p>{item.program}</p><p>{item.period}</p><p>{item.results.join(' · ')}</p></div>)}<h3>Certifications</h3><ul className="certification-list">{certifications.map((certification) => <li key={certification}>{certification}</li>)}</ul></div></div></section>
    <section id="contact" className="contact-section" aria-labelledby="contact-title" data-reveal-section><p className="eyebrow">06 / contact</p><h2 id="contact-title">Build something<br /><em>together.</em></h2><p className="contact-intro">Have a product idea, an internal tool, a mobile app, or a backend system that needs building?</p><nav className="contact-links" aria-label="Contact links">{socials.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel={social.href.startsWith('http') ? 'noreferrer' : undefined}>{social.label}<span>↗</span></a>)}</nav></section>
  </div>
}
