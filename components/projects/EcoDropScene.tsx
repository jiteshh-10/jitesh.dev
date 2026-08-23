'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function EcoDropScene() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(root.current!)
        gsap.from(q('.scene-copy > *'), { y: 20, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        const line = q('.connection-line-svg')[0] as SVGPathElement
        const len = line.getTotalLength()
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 72%', end: 'bottom 35%', scrub: 0.7 } })
        tl.from(q('.device'), { scale: .72, opacity: 0, duration: .4, stagger: .12, ease: 'back.out(1.5)' })
          .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .45 }, '-=.2')
        gsap.to(q('.message-packet'), { x: 112, y: -48, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }, root)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, { scope: root })
  return <section ref={root} id="ecodrop" className="ecodrop-scene"><div className="scene-copy"><p className="eyebrow">EchoDrop / flagship project</p><h2>When the signal<br /><em>disappears.</em></h2><p>Communication that survives when infrastructure doesn&apos;t. Nearby phones carry an encrypted message until it reaches its destination.</p><div className="flow-steps" aria-label="EchoDrop communication flow"><span>internet off</span><span>phone A creates message</span><span>nearby phones relay it</span><span>destination receives it</span></div><a className="text-link" href="https://github.com/jiteshh-10/echo-drop" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div><div className="network" role="img" aria-label="A physical message path hopping from phone to phone without the internet"><svg className="message-map" viewBox="0 0 360 300" aria-hidden="true"><path className="message-route" d="M58 206 Q114 96 180 174 T307 76" fill="none" /><path className="connection-line-svg" d="M58 206 Q114 96 180 174 T307 76" /><path className="message-packet" d="M0-7 L14 0 L0 7 L-6 0Z" /></svg><div className="device device-main">A</div><div className="device device-side">B</div><div className="device device-third">C</div><div className="device device-offline"><span>×</span><small>internet<br />offline</small></div><div className="signal-mark">store<br />carry<br />forward</div></div></section>
}
