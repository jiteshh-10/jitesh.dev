export function EcoDropIllustration() {
  return <svg data-project-illustration="ecodrop" viewBox="0 0 360 250" role="img" aria-label="A message hopping between nearby phones without internet"><g className="mesh-lines"><path d="M52 136 Q118 66 180 126 T309 80" /><path d="M52 136 Q142 176 220 170 T309 80" /></g><g className="mesh-nodes"><circle cx="52" cy="136" r="30" /><circle cx="180" cy="126" r="30" /><circle cx="309" cy="80" r="30" /></g><path className="message-packet" d="M48 132 l9 4 -9 4 -9-4Z" /><text x="132" y="42" className="illustration-label">offline mesh</text><text x="244" y="132" className="illustration-label">destination</text></svg>
}

export function ContextaIllustration() {
  return <svg data-project-illustration="contexta" viewBox="0 0 360 250" role="img" aria-label="A book with a highlighted word and context cards"><path className="book-shape" d="M47 65 Q113 40 178 76 Q243 40 313 65 V196 Q245 168 178 207 Q110 168 47 196Z" /><path className="book-spine" d="M178 76V207" /><rect className="context-card" x="207" y="92" width="90" height="48" rx="5" /><path className="context-line" d="M219 110h62M219 124h45" /><text x="61" y="52" className="illustration-label">word → meaning</text></svg>
}

export function HabitualzIllustration() {
  return <svg data-project-illustration="habitualz" viewBox="0 0 360 250" role="img" aria-label="A calendar showing a growing habit streak"><rect className="calendar" x="55" y="48" width="250" height="160" rx="8" /><path className="calendar-top" d="M55 88h250" /><g className="checks"><path d="M90 120l8 8 16-18" /><path d="M145 120l8 8 16-18" /><path d="M200 120l8 8 16-18" /><path d="M90 166l8 8 16-18" /><path d="M145 166l8 8 16-18" /></g><text x="211" y="176" className="streak-label">+05</text></svg>
}

export function MinimizUrlIllustration() {
  return <svg data-project-illustration="minimizurl" viewBox="0 0 360 250" role="img" aria-label="A long URL folding into a short token"><path className="url-ribbon" d="M39 92 C104 42 159 144 213 95 S286 62 320 105" /><text x="43" y="87" className="url-long">long-url</text><path className="fold-arrow" d="M156 178h48m-12-12 12 12-12 12" /><rect className="url-token" x="106" y="186" width="148" height="38" rx="19" /><text x="145" y="211" className="url-short">/aX7k9</text></svg>
}
