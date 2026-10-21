/**
 * The truth of the machine: every number the figure shows comes from here.
 *
 * Concept — "I build software around real constraints":
 * a card (a constraint) is weighed on a dial gauge, then routed down the lane
 * whose gate matches its weight class, built (the flywheel indexes one notch
 * per card), and shipped (the card is lifted out of the exit port and walks
 * the step cascade down into the tray).
 */

import { WALK, UPPER_Y, LOWER_Y, CARD, PILE, PILE_COUNT } from './view'

export interface Card {
  /** Stamped weight in kg — the only number that decides everything. */
  weight: number
}

/** The queue of constraints ready on the infeed stack. */
export const QUEUE: readonly Card[] = [
  { weight: 3.4 },
  { weight: 7.8 },
  { weight: 5.9 },
]

/** Dial: span of readable weights, and the rotation it maps to. */
export const GAUGE_MIN = 1.6
export const GAUGE_MAX = 9.2
export const GAUGE_SPAN = 270 // degrees of needle travel across the span

/** The gate lanes. A weight below SWITCH lands card on LANE -1 (upper), else LANE +1 (lower). */
export const SWITCH = 5.0
export type Lane = -1 | 0 | 1

/** Gauge angle (deg, clockwise from the zero mark) for a weight. */
export function angleOf(weight: number) {
  const t = Math.min(1, Math.max(0, (weight - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)))
  const bounded = Math.min(t, 0.98) // never quite zero the spring — the needle stays alive
  return bounded * GAUGE_SPAN
}

export const laneOf = (weight: number): Exclude<Lane, 0> => (weight < SWITCH ? -1 : 1)

/** True dial-face text: reads the weight that moved the needle most recently. */
export function readoutOf(state: ReadoutInput): string {
  if (state.running === true || (state.running === null && state.phase === 'weigh' && !state.settled))
    return `weighing ${state.weight.toFixed(1)} kg · ${state.lane === -1 ? 'light' : 'heavy'} lane`
  return `gate ${state.lane === -1 ? 'light' : 'heavy'} · shipped ${state.shipped}`
}
export interface ReadoutInput {
  weight: number
  lane: Exclude<Lane, 0>
  shipped: number
  running: boolean | null
  phase: TourPhase
  settled: boolean
}

/** Phases of the tour; the loop maps each to the seconds it holds. */
export type TourPhase =
  | 'choose' // pause: lever flips to the reading's lane
  | 'feed' // card leaves the stack and crosses to the weigh pad
  | 'weigh' // needle settles on the reading
  | 'route' // card passes the gate and takes its lane
  | 'build' // card enters the core; flywheel indexes one notch
  | 'lift' // the finished card rises out of the exit port
  | 'slide' // it descends the step cascade
  | 'drop' // into the tray; counter ticks up
  | 'rest' // everything settles back; stack feeds a fresh card underneath

export const HOLD: Record<TourPhase, number> = {
  choose: 0.9,
  feed: 1.35,
  weigh: 1.25,
  route: 1.5,
  build: 1.1,
  lift: 0.9,
  slide: 0.85,
  drop: 0.7,
  rest: 0.55,
}
export const TOUR_FIRST = 1.6 // delay before the first tour card
export const TOUR_BACK = 5200 // idle time before the tour wakes again

/** Spring tunings per stage — closeness of follow vs the honesty of the bounce. */
export const NEEDLE: [stiffness: number, damping: number] = [210, 21]
export const LEVER: [number, number] = [340, 15]
export const GEAR: [number, number] = [300, 21]
export const CARDRIDE: [number, number] = [210, 20]

export interface Ride {
  x: number
  y: number
  z: number
}

const pileTop = PILE.z + CARD.h * PILE_COUNT

function sample(points: Array<[number, number, number]>, u: number): Ride {
  if (points.length < 2) return { x: points[0][0], y: points[0][1], z: points[0][2] }
  const segs: number[] = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0]
    const dy = points[i][1] - points[i - 1][1]
    const dz = points[i][2] - points[i - 1][2]
    const len = Math.hypot(dx, dy, dz) || 1
    segs.push(len)
    total += len
  }
  let dist = Math.min(1, Math.max(0, u)) * total
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i] || i === segs.length - 1) {
      const t = segs[i] === 0 ? 0 : dist / segs[i]
      return {
        x: points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        y: points[i][1] + (points[i + 1][1] - points[i][1]) * t,
        z: points[i][2] + (points[i + 1][2] - points[i][2]) * t,
      }
    }
    dist -= segs[i]
  }
  const last = points[points.length - 1]
  return { x: last[0], y: last[1], z: last[2] }
}

const ease = (t: number) => {
  const u = Math.min(1, Math.max(0, t))
  return u * u * (3 - 2 * u)
}

export function rideOf(phase: TourPhase, u: number, lane: -1 | 1): Ride {
  const laneY = lane === -1 ? UPPER_Y : LOWER_Y
  const bladeTipX = 20 + 17 * Math.cos((24 * Math.PI) / 180)
  const bladeTipY = -2 + (lane === -1 ? -1 : 1) * 17 * Math.sin((24 * Math.PI) / 180)
  switch (phase) {
    case 'feed':
      return sample(
        [
          [WALK.stack[0], WALK.stack[1], pileTop],
          [WALK.pad[0], WALK.pad[1], 2],
        ],
        ease(u),
      )
    case 'route':
      return sample(
        [
          [WALK.pad[0], WALK.pad[1], 2],
          [WALK.mouth[0], WALK.mouth[1], 2],
          [bladeTipX, bladeTipY, 1.6],
          [WALK.laneEntry, laneY, 1.4],
          [WALK.laneStraight[1], laneY, 1.4],
          [WALK.merge.from[0], WALK.merge.from[1] * lane, 1.4],
          [WALK.merge.to[0], WALK.merge.to[1], 1.4],
          [WALK.door[0], WALK.door[1], 1.4],
          [WALK.inside[0], WALK.inside[1], 1.4],
        ],
        ease(u),
      )
    case 'lift':
      return sample(
        [
          [WALK.inside[0], WALK.inside[1], 9.8],
          [134, -10, 9.8],
          [WALK.port[0], WALK.port[1], WALK.port[2]],
        ],
        ease(u),
      )
    case 'slide':
      return sample(
        [
          [WALK.port[0], WALK.port[1], WALK.port[2]],
          [WALK.step1, -2, 8.6],
          [WALK.step1 + 6, -2, 7.4],
          [WALK.step2, -2, 5.0],
          [WALK.step2 + 4, -2, 4.2],
          [WALK.tray[0] - 6, WALK.tray[1] - 2, 3.6],
        ],
        ease(u),
      )
    case 'drop':
      return sample(
        [
          [WALK.tray[0] - 6, WALK.tray[1] - 2, 3.6],
          [WALK.tray[0], WALK.tray[1], 3.0],
        ],
        ease(u),
      )
    default:
      return { x: WALK.pad[0], y: WALK.pad[1], z: 2 }
  }
}

export const REST_RIDE: Ride = { x: WALK.pad[0], y: WALK.pad[1], z: 2 }
