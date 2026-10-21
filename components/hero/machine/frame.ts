import { DIAL, DIAL_R, DIAL_TOP, MAST, LEVER, BLADE, FLY, NOTCHES, P } from './view'
import { iso, pathOf, segment } from '../../iso/iso-kit'
import { angleOf } from './model'

const START = (135 * Math.PI) / 180

export interface Frame {
  needle: string
  leverStick: string
  leverKnob: string
  blade: string
  spokes: string
  ticks: string
}

export function needlePath(weight: number): string {
  const a = START + (angleOf(weight) * Math.PI) / 180
  const tipR = DIAL_R - 4.2
  const tip = [DIAL[0] + tipR * Math.cos(a), DIAL[1] + tipR * Math.sin(a)] as const
  return pathOf([iso([DIAL[0], DIAL[1], DIAL_TOP - 0.1], P), iso([tip[0], tip[1], DIAL_TOP - 0.1], P)])
}

export function leverPaths(angleDeg: number): { stick: string; knob: string } {
  const a = (angleDeg * Math.PI) / 180
  const cx = MAST.x + MAST.w / 2
  const cy = MAST.y + MAST.d / 2
  const tipX = cx - Math.sin(a) * LEVER.len
  const tipY = cy - Math.cos(a) * LEVER.len
  const stick = pathOf([iso([cx, cy, LEVER.z], P), iso([tipX, tipY, LEVER.z], P)])
  const knob = pathOf([iso([tipX, tipY, LEVER.z - 0.8], P), iso([tipX, tipY, LEVER.z + 0.8], P)])
  return { stick, knob }
}

export function bladePath(angleDeg: number): string {
  const a = (angleDeg * Math.PI) / 180
  const cx = BLADE.x
  const cy = BLADE.y
  const tipX = cx + Math.cos(a) * BLADE.len
  const tipY = cy + Math.sin(a) * BLADE.len
  const perpX = -Math.sin(a) * (BLADE.w / 2)
  const perpY = Math.cos(a) * (BLADE.w / 2)
  const corners: Array<[number, number]> = [
    [cx + perpX, cy + perpY],
    [tipX + perpX, tipY + perpY],
    [tipX - perpX, tipY - perpY],
    [cx - perpX, cy - perpY],
  ]
  const pts = corners.map((c) => iso([c[0], c[1], BLADE.z + BLADE.h / 2], P))
  return pathOf(pts, true)
}

export function gearMarks(gearAngleDeg: number): { spokes: string; ticks: string } {
  const a0 = (gearAngleDeg * Math.PI) / 180
  const spokePaths: string[] = []
  for (let i = 0; i < 3; i++) {
    const a = a0 + (i * 2 * Math.PI) / 3
    const inner = FLY.r * 0.32
    const outer = FLY.r * 0.86
    const x1 = FLY.x + inner * Math.cos(a)
    const y1 = FLY.y + inner * Math.sin(a)
    const x2 = FLY.x + outer * Math.cos(a)
    const y2 = FLY.y + outer * Math.sin(a)
    spokePaths.push(pathOf([iso([x1, y1, FLY.z + 3 + 0.05], P), iso([x2, y2, FLY.z + 3 + 0.05], P)]))
  }
  const tickPaths: string[] = []
  for (let i = 0; i < NOTCHES; i++) {
    const a = a0 + (i * 2 * Math.PI) / NOTCHES
    const r = FLY.r - 0.4
    const x = FLY.x + r * Math.cos(a)
    const y = FLY.y + r * Math.sin(a)
    const z0 = FLY.z + 0.6
    const z1 = FLY.z + 3 - 0.2
    tickPaths.push(segment([x, y, z0], [x, y, z1], P))
  }
  return { spokes: spokePaths.join(''), ticks: tickPaths.join('') }
}
