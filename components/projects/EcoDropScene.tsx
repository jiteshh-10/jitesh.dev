'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function EcoDropScene() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.ecodrop-scene .scene-copy > *', { y: 20, opacity: 0, duration: .65, stagger: .08, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
        gsap.from('.network .device', { scale: .72, opacity: 0, duration: .65, stagger: .16, ease: 'back.out(1.5)', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        gsap.from('.network .connection-line', { scaleX: 0, duration: .8, stagger: .2, transformOrigin: 'left center', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        gsap.to('.message-packet', { x: 112, y: -48, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }, root)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, { scope: root })
  return <section ref={root} id="ecodrop" className="ecodrop-scene"><div className="scene-copy"><p className="eyebrow">EchoDrop / flagship project</p><h2>When the signal<br /><em>disappears.</em></h2><p>Communication that survives when infrastructure doesn&apos;t. Nearby phones carry an encrypted message until it reaches its destination.</p><div className="flow-steps" aria-label="EchoDrop communication flow"><span>internet off</span><span>phone A creates message</span><span>nearby phones relay it</span><span>destination receives it</span></div><a className="text-link" href="https://github.com/jiteshh-10/echo-drop" target="_blank" rel="noreferrer">View repository <span>↗</span></a></div><div className="network" role="img" aria-label="A physical message path hopping from phone to phone without the internet"><svg className="message-map" viewBox="0 0 360 300" aria-hidden="true"><path className="message-route" d="M58 206 Q114 96 180 174 T307 76" fill="none" /><path className="connection-line-svg" d="M58 206 Q114 96 180 174 T307 76" /><path className="message-packet" d="M0-7 L14 0 L0 7 L-6 0Z" /></svg><div className="device device-main">A</div><div className="device device-side">B</div><div className="device device-third">C</div><div className="device device-offline"><span>×</span><small>internet<br />offline</small></div><div className="signal-mark">store<br />carry<br />forward</div></div></section>
}
