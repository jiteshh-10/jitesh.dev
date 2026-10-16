import { Character } from '@/components/illustrations/Character'

export function HeroIllustration() {
  return <div className="hero-art" aria-label="Illustrated developer exploring a technical idea"><img className="hero-background-illustration" src="/illustrations/hero/hero-background.svg" alt="" aria-hidden="true" /><span className="doodle doodle-star" data-doodle aria-hidden="true">✳</span><span className="doodle doodle-note" data-doodle aria-hidden="true">thinking<br />in public</span><div className="hero-tech-motif" aria-hidden="true"><span>&lt;/&gt;</span><span>API</span><span>DB</span><i /></div><Character variant="exploring" interactive /></div>
}
