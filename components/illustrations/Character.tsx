'use client'

import { useId, type CSSProperties } from 'react'

export type CharacterVariant = 'idle' | 'typing' | 'walking' | 'phone' | 'thinking' | 'building' | 'reading' | 'exploring'

type CharacterProps = { variant?: CharacterVariant; className?: string; interactive?: boolean }

const poses: Record<CharacterVariant, CSSProperties> = {
  idle: {}, typing: { ['--character-tilt' as string]: '-2deg' }, walking: { ['--character-tilt' as string]: '3deg' }, phone: { ['--character-tilt' as string]: '-3deg' }, thinking: { ['--character-tilt' as string]: '2deg' }, building: { ['--character-tilt' as string]: '-2deg' }, reading: { ['--character-tilt' as string]: '1deg' }, exploring: { ['--character-tilt' as string]: '-2deg' },
}

export function Character({ variant = 'idle', className = '', interactive = false }: CharacterProps) {
  const id = useId().replace(/:/g, '')
  const titleId = `character-title-${id}`
  const isPhone = variant === 'phone'
  const isThinking = variant === 'thinking' || variant === 'exploring'
  const isReading = variant === 'reading'
  const isBuilding = variant === 'building' || variant === 'typing'

  return (
    <svg className={`character character-${variant} ${interactive ? 'character-interactive' : ''} ${className}`} style={poses[variant]} data-character data-character-variant={variant} viewBox="0 0 360 470" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{`Illustrated Jitesh Sen, a friendly software engineer ${isPhone ? 'holding a phone' : isReading ? 'reading' : isBuilding ? 'building software' : 'exploring an idea'}`}</title>
      <g id="character" data-character-part="character">
        <ellipse id="shadow" data-character-part="shadow" cx="175" cy="444" rx="102" ry="15" className="character-shadow" />
        <g id="legs" data-character-part="legs"><path id="left-leg" data-character-part="left-leg" d="M110 350 Q72 363 62 414" className="character-limb" /><path id="right-leg" data-character-part="right-leg" d="M236 349 Q277 363 292 414" className="character-limb" /><path id="left-foot" data-character-part="left-foot" d="M63 409 Q74 398 93 414 L83 437 Q62 442 50 426Z" className="character-shoe" /><path id="right-foot" data-character-part="right-foot" d="M280 410 Q300 398 316 415 L305 438 Q282 441 271 425Z" className="character-shoe" /></g>
        <g id="body" data-character-part="body"><path id="torso" d="M115 270 Q178 243 238 275 L260 394 Q184 425 104 394Z" className="character-shirt" /><path d="M177 263 L177 388" className="shirt-seam" /><path d="M119 281 Q176 302 234 279" className="shirt-collar" /></g>
        <g id="left-arm" data-character-part="left-arm"><path id="left-upper-arm" d="M124 292 Q73 279 68 328" className="character-limb" /><path id="left-forearm" d="M68 328 Q88 343 120 322" className="character-limb" /><circle id="left-hand" data-character-part="left-hand" cx="121" cy="322" r="11" className="character-skin" /></g>
        <g id="right-arm" data-character-part="right-arm"><path id="right-upper-arm" d={isPhone ? 'M226 291 Q263 273 274 300' : 'M226 291 Q282 279 291 329'} className="character-limb" /><path id="right-forearm" d={isPhone ? 'M274 300 Q252 325 235 314' : 'M291 329 Q270 343 239 322'} className="character-limb" /><circle id="right-hand" data-character-part="right-hand" cx={isPhone ? '235' : '239'} cy={isPhone ? '314' : '322'} r="11" className="character-skin" /></g>
        <g id="head" data-character-part="head"><circle id="face" data-character-part="face" cx="177" cy="157" r="82" className="character-skin" /><path id="hair" data-character-part="hair" d="M99 146 Q96 66 171 59 Q253 57 256 143 Q229 115 206 111 Q164 101 126 123Z" className="character-hair" /><path id="hair-texture" d="M112 104 Q144 72 183 77 M145 68 Q177 51 215 76 M187 70 Q220 64 244 96" className="hair-texture" /><path id="brow-left" d="M128 140 Q145 130 158 140" className="character-line thin" /><path id="brow-right" d="M195 140 Q211 130 225 140" className="character-line thin" /><circle id="eye-left" data-character-part="eye-left" cx="145" cy="159" r="7" className="character-ink" /><circle id="eye-right" data-character-part="eye-right" cx="208" cy="159" r="7" className="character-ink" /><path id="nose" d="M177 158 Q167 181 178 185" className="character-line thin" /><path id="beard" data-character-part="beard" d="M132 186 Q177 230 222 186 Q215 224 177 234 Q139 224 132 186Z" className="character-beard" /><path id="mouth" d="M154 196 Q177 207 202 195" className="character-line" /></g>
        <g id="accessories" data-character-part="accessories"><rect id="watch" x="51" y="319" width="18" height="9" rx="4" className="character-watch" />{variant === 'exploring' && <path id="glasses" d="M121 153h40M193 153h40M161 153h32" className="character-line thin" />}{variant === 'walking' && <path id="backpack" data-character-part="backpack" d="M91 282 Q57 300 63 368" className="backpack" />}</g>
        {isPhone ? <g id="phone" data-character-part="phone"><rect x="220" y="285" width="27" height="48" rx="5" className="phone" /><circle cx="233" cy="294" r="3" className="phone-dot" /></g> : isReading ? <g id="book" data-character-part="book"><path d="M122 300 Q155 286 177 303 Q199 286 232 300 L232 352 Q199 337 177 354 Q155 337 122 352Z" className="book" /><path d="M177 303V354" className="book-line" /></g> : <g id="laptop" data-character-part="laptop"><rect x="112" y="260" width="130" height="82" rx="6" className="laptop-screen" /><path d="M95 343 H260 L278 357 H78Z" className="laptop-base" /><path id="screen-glow" d="M132 287 Q177 272 220 291" className="laptop-glow" /></g>}
        {isThinking && <g id="thought-motif" data-character-part="thought"><circle cx="266" cy="96" r="8" className="motif-dot" /><circle cx="284" cy="75" r="12" className="motif-dot" /><text x="292" y="48" className="motif-text">?</text></g>}
        {isBuilding && <g id="build-motif" data-character-part="build"><rect x="272" y="250" width="35" height="35" className="build-block" /><rect x="286" y="215" width="35" height="35" className="build-block" /></g>}
      </g>
    </svg>
  )
}

export function CharacterPose(props: CharacterProps) { return <Character {...props} /> }

interface StyleProperties extends CSSProperties { ['--character-tilt']?: string }
void (0 as unknown as StyleProperties)
