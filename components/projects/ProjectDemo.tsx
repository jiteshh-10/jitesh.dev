import type { Project } from '@/types/portfolio'

type ProjectDemoProps = { project: Project; index: number }

export function ProjectDemo({ project, index }: ProjectDemoProps) {
  return <div className={`project-demo demo-${project.accent}`} aria-label={`${project.name} demo placeholder`}>
    <div className="demo-grid" />
    <div className="demo-device"><div className="demo-device-bar"><span /><span /><span /></div><div className="demo-screen"><small>DEMO / MOTION STUDY</small><strong>{project.name}</strong><span className="demo-mark">{String(index + 1).padStart(2, '0')} — {project.slug.toUpperCase()}</span></div></div>
    <div className="demo-caption"><span>Project visual</span><span>Media slot / image · video · GIF · animated visual</span></div>
  </div>
}
