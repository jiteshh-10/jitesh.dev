import type { Project } from '@/types/portfolio'

/*
 * Project media system.
 *
 * Every visualization is an ILLUSTRATIVE diagram of how the system works —
 * never a fabricated product screenshot. Demo loops are pure CSS keyframes
 * (mapped to the `.pv-*` classes in globals.css) so they cost nothing while a
 * card is inactive, and they are excluded from the layout entirely on mobile
 * fallbacks where not needed.
 */

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="pv-phone pv-frame" aria-hidden="true">
      <div className="pv-phone-bar">
        <span>9:41</span>
        <i className="pv-phone-notch" />
        <span className="pv-phone-signal"><i /><i /><i /></span>
      </div>
      <div className="pv-phone-screen">{children}</div>
      <div className="pv-phone-home" />
    </div>
  )
}

export function DiagramFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pv-window pv-frame" aria-hidden="true">
      <div className="pv-window-bar">
        <span className="pv-window-dots"><i /><i /><i /></span>
        <span className="pv-window-title">{title}</span>
      </div>
      <div className="pv-window-body">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EchoDrop — offline mesh: discovery, propagation, delivery          */
/* ------------------------------------------------------------------ */

const ED_NODES = [
  { x: 54, y: 66, label: 'A' },
  { x: 192, y: 82, label: 'B' },
  { x: 64, y: 192, label: 'C' },
  { x: 184, y: 206, label: 'D' },
]

export function EchoDropVisual() {
  return (
    <PhoneFrame>
      <div className="pv-head">
        <b>EchoDrop</b>
        <span className="pv-chip pv-chip-offline">internet off</span>
      </div>
      <svg className="pv-ed-map" viewBox="0 0 248 264">
        <path className="pv-ed-route pv-anim" d="M54 66 C 104 38 150 44 192 82" />
        <path className="pv-ed-route pv-anim pv-ed-route-2" d="M192 82 C 150 128 108 150 64 192" />
        <path className="pv-ed-route pv-anim pv-ed-route-3" d="M64 192 C 106 216 146 218 184 206" />
        {ED_NODES.map((node, index) => (
          <g className="pv-ed-node" key={node.label} data-node={index}>
            {index === 3 && <circle className="pv-ed-ring pv-anim" cx={node.x} cy={node.y} r="17" />}
            <circle cx={node.x} cy={node.y} r="16" />
            <text x={node.x} y={node.y + 4} textAnchor="middle">{node.label}</text>
            <text className="pv-ed-device" x={node.x} y={node.y + 34} textAnchor="middle">{`phone ${node.label.toLowerCase()}`}</text>
          </g>
        ))}
        <circle className="pv-ed-packet pv-ed-packet-1 pv-anim" r="4.5" cx="54" cy="66" />
        <circle className="pv-ed-packet pv-ed-packet-2 pv-anim" r="3.6" cx="192" cy="82" />
        <circle className="pv-ed-packet pv-ed-packet-3 pv-anim" r="4.5" cx="64" cy="192" />
        <rect className="pv-ed-frag pv-anim" x="-4" y="-3" width="8" height="6" rx="1.5" />
        <rect className="pv-ed-frag pv-ed-frag-2 pv-anim" x="-4" y="-3" width="8" height="6" rx="1.5" />
      </svg>
      <div className="pv-steps">
        <span>phone A</span><i>→</i><span>relay</span><i>→</i><span>phone B…</span>
      </div>
      <div className="pv-foot">
        <span className="pv-chip">store · carry · forward</span>
        <span className="pv-chip pv-chip-dim pv-ttl pv-anim">TTL expiry</span>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/* MinimizUrl — request → short code → layered backend → analytics    */
/* ------------------------------------------------------------------ */

export function MinimizUrlVisual() {
  return (
    <DiagramFrame title="minimizurl — request lifecycle">
      <div className="pv-mu-request">
        <span className="pv-mu-label">POST /links</span>
        <div className="pv-mu-url-row">
          <span className="pv-mu-url pv-anim">https://internal.tools/api/reports/quarterly/analytics/builds?ref=catalog#overview</span>
          <span className="pv-mu-arrow" aria-hidden="true">→</span>
          <span className="pv-mu-code pv-anim">mz.url/x7Kp9</span>
        </div>
      </div>
      <div className="pv-mu-layers" role="presentation">
        <span className="pv-mu-layer">Controller</span>
        <i aria-hidden="true" />
        <span className="pv-mu-layer">Service</span>
        <i aria-hidden="true" />
        <span className="pv-mu-layer pv-mu-layer-accent">Repository</span>
      </div>
      <div className="pv-mu-guards">
        <span className="pv-chip">JWT · RBAC</span>
        <span className="pv-chip pv-ttl pv-anim">TTL 30d</span>
        <span className="pv-chip">Base62</span>
      </div>
      <div className="pv-mu-stream">
        <span className="pv-mu-label">async analytics</span>
        <div className="pv-mu-bars" aria-hidden="true">
          {[42, 70, 34, 88, 58, 76, 46, 64].map((h, index) => (
            <i key={index} className="pv-anim" style={{ height: `${h}%`, animationDelay: `${index * 0.22}s` }} />
          ))}
        </div>
      </div>
    </DiagramFrame>
  )
}

/* ------------------------------------------------------------------ */
/* Contexta — select a word, explain in context, save to library      */
/* ------------------------------------------------------------------ */

export function ContextaVisual() {
  return (
    <PhoneFrame>
      <div className="pv-head">
        <b>Reading</b>
        <span className="pv-chip">chapter 04</span>
      </div>
      <p className="pv-ctx-passage">
        The harbour lights were <mark className="pv-ctx-word pv-anim">ephemeral</mark> — bright
        for a moment, then gone before anyone could name them.
      </p>
      <div className="pv-ctx-card pv-anim">
        <strong>ephemeral</strong>
        <span>lasting a very short time — here: the lights fade almost as they appear</span>
      </div>
      <div className="pv-ctx-tags" aria-hidden="true">
        <span className="pv-chip">difficulty · expert</span>
        <span className="pv-chip">context · literary</span>
      </div>
      <div className="pv-ctx-saved pv-anim"><i aria-hidden="true">✓</i> saved to vocabulary</div>
      <div className="pv-foot">
        <span className="pv-chip">SQLite cached</span>
        <span className="pv-chip">Firestore synced</span>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */
/* Habitualz — daily check-ins completing into a streak               */
/* ------------------------------------------------------------------ */

const HZ_HABITS = ['Read 20 pages', 'Morning stretch', 'Write journal']
const HZ_CELLS = 7 * 5

export function HabitualzVisual() {
  return (
    <PhoneFrame>
      <div className="pv-head">
        <b>Today</b>
        <span className="pv-chip pv-chip-accent pv-anim">12-day streak</span>
      </div>
      <div className="pv-hz-habits">
        {HZ_HABITS.map((habit, index) => (
          <div className="pv-hz-habit" key={habit}>
            <span className="pv-hz-check pv-anim" style={{ animationDelay: `${index * 0.55}s` }}><i>✓</i></span>
            <span>{habit}</span>
          </div>
        ))}
      </div>
      <div className="pv-hz-grid" aria-hidden="true">
        {Array.from({ length: HZ_CELLS }, (_, index) => (
          <i key={index} className="pv-anim" style={{ animationDelay: `${index * 0.028}s` }} />
        ))}
      </div>
      <div className="pv-foot">
        <span className="pv-chip">last 5 weeks</span>
        <span className="pv-chip pv-chip-dim">consistency over intensity</span>
      </div>
    </PhoneFrame>
  )
}

/* ------------------------------------------------------------------ */

type MediaVisualProps = { project: Project; index: number; active: boolean }

const VISUALS: Record<string, () => React.ReactNode> = {
  ecodrop: () => <EchoDropVisual />,
  minimizurl: () => <MinimizUrlVisual />,
  contexta: () => <ContextaVisual />,
  habitualz: () => <HabitualzVisual />,
}

export function ProjectMedia({ project, index, active }: MediaVisualProps) {
  const visual = VISUALS[project.slug]
  return (
    <div className={`project-media media-${project.accent}${active ? ' is-active' : ''}`}>
      <div className="project-media-grid" aria-hidden="true" />
      <div className="project-media-header">
        <span>0{index + 1} · {project.name}</span>
        <span>system view — illustrative</span>
      </div>
      <div className="project-media-stage">{visual ? visual() : null}</div>
      <div className="project-media-footer">
        <span>{project.technologies.join(' · ')}</span>
        <span className="project-media-progress" aria-hidden="true"><i /><i /><i /></span>
      </div>
    </div>
  )
}
