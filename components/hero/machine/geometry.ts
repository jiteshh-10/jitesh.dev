import {
  BENCH, BENCH_H, FOOT, STACK_PAD, PILE, CARD, PILE_COUNT, PUSHER, PUSHER_ROD,
  WEIGH_PAD, WEIGH_Z, DIAL, DIAL_R, DIAL_Z, DIAL_H, DIAL_TOP,
  GATE_BED, BLADE, MAST, LEVER, SPUR, UPPER_Y, LOWER_Y, LANE_W, LANE_TOP, LANES_START, LANES_MERGE,
  HOUSE, HOUSE_H, DOOR, EXIT, FLY, FLY_H, CROWN, SHAFT, NOTCHES,
  STEP1, STEP1_TOP, STEP2, STEP2_TOP, TRAY, TRAY_FLOOR_Z, TRAY_WALL_H, CARD_IN_TRAY,
  P, at, EX, EY, EZ, WIDTH, HEIGHT, AZIMUTH,
} from './view'
import {
  slabOf, cylinder, circleRing, extrude, insetPlan, onTop, pathOf, planOutline, lineOnTop,
  segment, rise, ring, topTicks, radialTicks, knurl, sideArc, ringSeam, sideSeam, sideRing,
  dotGrid, haloOf, topMatrix, sideMatrix, screenRise, corners, boxCorners, joinPaths,
  type SolidPaths, type Flat, type Plane, type Plan, type Point3, type Projection, type Ticks,
} from '../../iso/iso-kit'

const solid = (plan: Plan, z: number, h: number, steps = 8, bevel = 0) => slabOf(plan, z, h, P, steps, bevel)
const cyl = (cx: number, cy: number, r: number, z: number, h: number, steps = 24, bevel = 0) =>
  cylinder(cx, cy, r, z, h, P, steps, bevel)
const ringPlane = (cx: number, cy: number, r: number, steps = 40) => circleRing(cx, cy, r, steps)
const topRing = (cx: number, cy: number, r: number, z: number, steps = 40) => onTop(circleRing(cx, cy, r, steps), z, P, true)

// ---------- BASE ----------
export const BASE = {
  halo: haloOf(BENCH, -BENCH_H - FOOT - 0.5, BENCH_H + FOOT + 1.5, P),
  feet: [0, 1, 2, 3].map((i) => {
    const fx = i % 2 === 0 ? BENCH.x + 4 : BENCH.x + BENCH.w - 8
    const fy = i < 2 ? BENCH.y + 4 : BENCH.y + BENCH.d - 8
    return [
      solid({ x: fx, y: fy, w: 4, d: 4, r: 1 }, -BENCH_H - FOOT, FOOT, 6, 0.2),
      solid({ x: fx - 0.6, y: fy - 0.6, w: 5.2, d: 5.2, r: 1.4 }, -BENCH_H - FOOT - 0.2, 0.6, 6, 0.1),
    ]
  }),
  slab: solid(BENCH, -BENCH_H, BENCH_H, 10, 0.3),
  groove: planOutline(insetPlan(BENCH, 1.4), -BENCH_H + 0.6, P, 10),
  screws: [0, 1, 2, 3].map((i) => {
    const sx = i % 2 === 0 ? BENCH.x + 12 : BENCH.x + BENCH.w - 12
    const sy = i < 2 ? BENCH.y + 12 : BENCH.y + BENCH.d - 12
    return [sx, sy] as Flat
  }),
  screwRings: joinPaths(
    [0, 1, 2, 3].map((i) => {
      const sx = i % 2 === 0 ? BENCH.x + 12 : BENCH.x + BENCH.w - 12
      const sy = i < 2 ? BENCH.y + 12 : BENCH.y + BENCH.d - 12
      return ring(sx, sy, 1.1, -BENCH_H + BENCH_H - 0.2, P, 16)
    }),
  ),
  grid: dotGrid(BENCH.x + 14, BENCH.y + 14, 11, 5, 28, 0.05, P),
  topPlate: solid(insetPlan(BENCH, 2.4), -0.4, 0.6, 10, 0.1),
  frontRule: lineOnTop([BENCH.x + 8, BENCH.y + BENCH.d - 2], [BENCH.x + BENCH.w - 8, BENCH.y + BENCH.d - 2], 0.05, P),
}

// ---------- INFEED STACK ----------
export const PILE_ART = {
  pad: solid(STACK_PAD, -1.2, 1.2, 8, 0.15),
  groove: planOutline(insetPlan(STACK_PAD, 1.2), -0.4, P, 8),
  screws: [
    [STACK_PAD.x + 4, STACK_PAD.y + 4],
    [STACK_PAD.x + STACK_PAD.w - 4, STACK_PAD.y + 4],
    [STACK_PAD.x + 4, STACK_PAD.y + STACK_PAD.d - 4],
    [STACK_PAD.x + STACK_PAD.w - 4, STACK_PAD.y + STACK_PAD.d - 4],
  ] as Flat[],
  cards: Array.from({ length: PILE_COUNT }, (_, i) => {
    const z = i * CARD.h
    const x = PILE.x + i * 0.3
    const y = PILE.y + i * 0.2
    return {
      slab: solid({ x, y, w: CARD.w, d: CARD.d, r: CARD.r }, z, CARD.h, 6, 0.15),
      rules: joinPaths([
        lineOnTop([x + 2, y + 2], [x + CARD.w - 2, y + 2], z + CARD.h + 0.02, P),
        lineOnTop([x + 2, y + 4.2], [x + CARD.w - 2, y + 4.2], z + CARD.h + 0.02, P),
      ]),
      stamp: ring(x + CARD.w - 3.2, y + CARD.d / 2, 1.5, z + CARD.h + 0.02, P, 14),
    }
  }),
}

export const PUSHER_ART = {
  housing: solid(PUSHER, 0, PUSHER.h, 6, 0.2),
  collar: cyl(PUSHER.x + PUSHER.w / 2, PUSHER.y + PUSHER.d / 2, 2.2, PUSHER.h - 1, 2.6, 16, 0.2),
  rod: segment([PUSHER.x + PUSHER.w / 2, PUSHER.y + PUSHER.d / 2, PUSHER_ROD.z], [PUSHER_ROD.tip, PUSHER.y + PUSHER.d / 2, PUSHER_ROD.z], P),
  tip: cyl(PUSHER_ROD.tip, PUSHER.y + PUSHER.d / 2, PUSHER_ROD.r + 0.6, PUSHER_ROD.z - 0.6, 1.2, 12, 0.1),
  screws: [
    [PUSHER.x + 2, PUSHER.y + 2],
    [PUSHER.x + PUSHER.w - 2, PUSHER.y + 2],
  ] as Flat[],
}

// ---------- WEIGH PAD + DIAL ----------
export const WEIGH_ART = {
  pad: solid(WEIGH_PAD, 0, WEIGH_Z, 8, 0.2),
  groove: planOutline(insetPlan(WEIGH_PAD, 1.4), WEIGH_Z - 0.2, P, 8),
  screws: [
    [WEIGH_PAD.x + 4, WEIGH_PAD.y + 4],
    [WEIGH_PAD.x + WEIGH_PAD.w - 4, WEIGH_PAD.y + 4],
    [WEIGH_PAD.x + 4, WEIGH_PAD.y + WEIGH_PAD.d - 4],
    [WEIGH_PAD.x + WEIGH_PAD.w - 4, WEIGH_PAD.y + WEIGH_PAD.d - 4],
  ] as Flat[],
}

export const DIAL_ART = {
  stand: cyl(DIAL[0], DIAL[1], 4.2, 0, 3.2, 18, 0.2),
  puck: cyl(DIAL[0], DIAL[1], DIAL_R, DIAL_Z, DIAL_H, 32, 0.25),
  bezelRing: ring(DIAL[0], DIAL[1], DIAL_R, DIAL_TOP, P, 40),
  faceRing: ring(DIAL[0], DIAL[1], DIAL_R - 1.6, DIAL_TOP - 0.1, P, 40),
  ticks: radialTicks(DIAL[0], DIAL[1], DIAL_R - 2.4, 19, 3, DIAL_TOP - 0.05, [1.6, 3.2], P, (135 * Math.PI) / 180, (270 * Math.PI) / 180),
  knurl: knurl(DIAL[0], DIAL[1], DIAL_R - 0.4, DIAL_Z + 1, DIAL_TOP - 1, 36, P, 0.3),
  band: sideArc(DIAL[0], DIAL[1], DIAL_R, DIAL_Z + DIAL_H / 2, P, 24),
  crown: cyl(DIAL[0] + DIAL_R - 3, DIAL[1], 2.6, DIAL_Z + 2, DIAL_H - 2, 14, 0.2),
  cap: cyl(DIAL[0] + DIAL_R - 3, DIAL[1], 1.3, DIAL_TOP - 0.6, 1.6, 12, 0.15),
  pivot: cyl(DIAL[0], DIAL[1], 1.6, DIAL_TOP - 0.4, 1.2, 12, 0.1),
  zeroMark: segment([DIAL[0] + (DIAL_R - 2.4) * Math.cos((135 * Math.PI) / 180), DIAL[1] + (DIAL_R - 2.4) * Math.sin((135 * Math.PI) / 180), DIAL_TOP - 0.05], [DIAL[0] + (DIAL_R - 5) * Math.cos((135 * Math.PI) / 180), DIAL[1] + (DIAL_R - 5) * Math.sin((135 * Math.PI) / 180), DIAL_TOP - 0.05], P),
  faceText: topMatrix([DIAL[0], DIAL[1] + 4], DIAL_TOP - 0.05, P, 'y'),
  halo: haloOf({ x: DIAL[0] - DIAL_R, y: DIAL[1] - DIAL_R, w: DIAL_R * 2, d: DIAL_R * 2, r: DIAL_R }, DIAL_Z, DIAL_H, P),
}

// ---------- GATE ----------
export const GATE_ART = {
  bed: solid(GATE_BED, 0, LANE_TOP, 8, 0.15),
  groove: planOutline(insetPlan(GATE_BED, 1.2), LANE_TOP - 0.15, P, 8),
  screws: [
    [GATE_BED.x + 3, GATE_BED.y + 3],
    [GATE_BED.x + GATE_BED.w - 3, GATE_BED.y + 3],
    [GATE_BED.x + 3, GATE_BED.y + GATE_BED.d - 3],
    [GATE_BED.x + GATE_BED.w - 3, GATE_BED.y + GATE_BED.d - 3],
  ] as Flat[],
  mast: solid(MAST, 0, MAST.h, 6, 0.2),
  mastCap: cyl(MAST.x + MAST.w / 2, MAST.y + MAST.d / 2, 2.4, MAST.h - 0.6, 1.6, 12, 0.15),
  leverShaft: cyl(MAST.x + MAST.w / 2, MAST.y + MAST.d / 2, 1.1, MAST.h - 0.4, LEVER.z - MAST.h + 1.2, 12, 0.1),
  knob: cyl(MAST.x + MAST.w / 2, MAST.y + MAST.d / 2 - LEVER.len, LEVER.z, 1.6, 2.4, 14, 0.2),
  knobKnurl: knurl(MAST.x + MAST.w / 2, MAST.y + MAST.d / 2 - LEVER.len, 1.6, LEVER.z + 0.4, LEVER.z + 2.0, 14, P, 0.2),
  bladePivot: cyl(BLADE.x, BLADE.y, 1.4, BLADE.z - 0.3, 1.0, 12, 0.1),
  stopPinUpper: solid({ x: LANES_START - 2, y: UPPER_Y - LANE_W / 2 - 1.6, w: 3, d: LANE_W + 3.2, r: 0.8 }, 0, 3.2, 6, 0.15),
  stopPinLower: solid({ x: LANES_START - 2, y: LOWER_Y - LANE_W / 2 - 1.6, w: 3, d: LANE_W + 3.2, r: 0.8 }, 0, 3.2, 6, 0.15),
  spurUpper: solid({ x: SPUR.from, y: UPPER_Y - 3, w: SPUR.to - SPUR.from, d: 6, r: 1 }, 0, LANE_TOP - 0.2, 6, 0.1),
  spurLower: solid({ x: SPUR.from, y: LOWER_Y - 3, w: SPUR.to - SPUR.from, d: 6, r: 1 }, 0, LANE_TOP - 0.2, 6, 0.1),
}

// ---------- LANES ----------
export const LANES_ART = {
  upper: solid({ x: LANES_START, y: UPPER_Y - LANE_W / 2, w: LANES_MERGE - LANES_START, d: LANE_W, r: 1.2 }, 0, LANE_TOP, 6, 0.15),
  lower: solid({ x: LANES_START, y: LOWER_Y - LANE_W / 2, w: LANES_MERGE - LANES_START, d: LANE_W, r: 1.2 }, 0, LANE_TOP, 6, 0.15),
  upperGroove: lineOnTop([LANES_START + 1, UPPER_Y], [LANES_MERGE - 1, UPPER_Y], LANE_TOP - 0.1, P),
  lowerGroove: lineOnTop([LANES_START + 1, LOWER_Y], [LANES_MERGE - 1, LOWER_Y], LANE_TOP - 0.1, P),
  mergeBridge: solid({ x: LANES_MERGE, y: -12, w: 16, d: 24, r: 2 }, 0, LANE_TOP - 0.2, 6, 0.1),
  endStop: solid({ x: LANES_MERGE - 1, y: -LANE_W / 2, w: 2.4, d: LANE_W + 2, r: 0.6 }, 0, LANE_TOP + 1.2, 6, 0.15),
  rulerUpper: topTicks(LANES_START, LANES_MERGE, 6, 3, 1.6, LANE_TOP - 0.05, [0.8, 1.8], P, 'x'),
  rulerLower: topTicks(LANES_START, LANES_MERGE, 6, 3, 1.6, LANE_TOP - 0.05, [0.8, 1.8], P, 'x'),
}

// ---------- HOUSE (punched) ----------
export const HOUSE_ART = {
  backWall: solid({ x: HOUSE.x, y: HOUSE.y, w: HOUSE.w, d: 1.2, r: 1 }, 0, HOUSE_H, 6, 0.15),
  leftWall: solid({ x: HOUSE.x, y: HOUSE.y + 1.2, w: 1.2, d: HOUSE.d - 1.2, r: 1 }, 0, HOUSE_H, 6, 0.15),
  // front face split around the doorway
  frontLeft: solid({ x: HOUSE.x, y: -2, w: DOOR.x0 - HOUSE.x, d: 0.8, r: 0.6 }, 0, HOUSE_H, 6, 0.15),
  frontRight: solid({ x: DOOR.x1, y: -2, w: HOUSE.x + HOUSE.w - DOOR.x1, d: 0.8, r: 0.6 }, 0, HOUSE_H, 6, 0.15),
  frontSill: solid({ x: DOOR.x0, y: -2, w: DOOR.x1 - DOOR.x0, d: 0.8, r: 0.4 }, 0, DOOR.z0, 6, 0.1),
  frontLintel: solid({ x: DOOR.x0, y: -2, w: DOOR.x1 - DOOR.x0, d: 0.8, r: 0.4 }, DOOR.z1, HOUSE_H - DOOR.z1, 6, 0.1),
  doorInterior: solid({ x: DOOR.x0, y: -2, w: DOOR.x1 - DOOR.x0, d: 3.2, r: 0.4 }, DOOR.z0, DOOR.z1 - DOOR.z0, 6, 0.1),
  // right face split around the exit port
  rightWallA: solid({ x: HOUSE.x + HOUSE.w - 1.2, y: HOUSE.y, w: 1.2, d: EXIT.y0 - HOUSE.y, r: 0.6 }, 0, HOUSE_H, 6, 0.15),
  rightWallB: solid({ x: HOUSE.x + HOUSE.w - 1.2, y: EXIT.y1, w: 1.2, d: HOUSE.y + HOUSE.d - EXIT.y1, r: 0.6 }, 0, HOUSE_H, 6, 0.15),
  rightWallUpper: solid({ x: HOUSE.x + HOUSE.w - 1.2, y: EXIT.y0, w: 1.2, d: EXIT.y1 - EXIT.y0, r: 0.6 }, EXIT.z1, HOUSE_H - EXIT.z1, 6, 0.1),
  rightWallLower: solid({ x: HOUSE.x + HOUSE.w - 1.2, y: EXIT.y0, w: 1.2, d: EXIT.y1 - EXIT.y0, r: 0.6 }, 0, EXIT.z0, 6, 0.1),
  portInterior: solid({ x: HOUSE.x + HOUSE.w - 3.2, y: EXIT.y0, w: 3.2, d: EXIT.y1 - EXIT.y0, r: 0.4 }, EXIT.z0, EXIT.z1 - EXIT.z0, 6, 0.1),
  topPlate: solid({ x: HOUSE.x, y: HOUSE.y, w: HOUSE.w, d: HOUSE.d, r: HOUSE.r }, HOUSE_H, 2, 8, 0.2),
  floor: solid({ x: HOUSE.x, y: HOUSE.y, w: HOUSE.w, d: HOUSE.d, r: HOUSE.r }, -1.4, 1.4, 8, 0.15),
  // flywheel
  flyDisc: cyl(FLY.x, FLY.y, FLY.r, FLY.z, FLY_H, 32, 0.2),
  flyCrown: cyl(FLY.x, FLY.y, CROWN.r, CROWN.z, CROWN.h, 24, 0.2),
  flyShaft: cyl(FLY.x, FLY.y, SHAFT.r, SHAFT.z, SHAFT.h, 16, 0.15),
  flyCap: cyl(FLY.x, FLY.y, 2.6, SHAFT.z + SHAFT.h - 0.4, 1.2, 14, 0.15),
  flyBand: sideArc(FLY.x, FLY.y, FLY.r - 0.2, FLY.z + FLY_H / 2, P, 24),
  flyBolts: [0, 1, 2, 3].map((i) => {
    const a = (i * Math.PI) / 2
    return [FLY.x + (FLY.r - 2.2) * Math.cos(a), FLY.y + (FLY.r - 2.2) * Math.sin(a)] as Flat
  }),
  pointer: solid({ x: FLY.x + FLY.r - 1.2, y: FLY.y - 1.4, w: 4.6, d: 2.8, r: 0.8 }, FLY.z + FLY_H - 0.4, 1.6, 6, 0.15),
  labelPlate: solid({ x: HOUSE.x + 2, y: HOUSE.y + 2, w: 16, d: 0.6, r: 0.4 }, 3, 0.4, 6, 0.05),
  labelRules: joinPaths([
    lineOnTop([HOUSE.x + 3, HOUSE.y + 2.4], [HOUSE.x + 17, HOUSE.y + 2.4], 3.45, P),
    lineOnTop([HOUSE.x + 3, HOUSE.y + 3.6], [HOUSE.x + 15, HOUSE.y + 3.6], 3.45, P),
  ]),
  labelScrews: [
    [HOUSE.x + 3, HOUSE.y + 2.2],
    [HOUSE.x + 17, HOUSE.y + 2.2],
  ] as Flat[],
  halo: haloOf(HOUSE, 0, HOUSE_H + 2, P),
}

// ---------- EXIT ----------
export const EXIT_ART = {
  step1: solid(STEP1, 0, STEP1_TOP, 6, 0.15),
  step1Groove: planOutline(insetPlan(STEP1, 1), STEP1_TOP - 0.15, P, 6),
  step2: solid(STEP2, 0, STEP2_TOP, 6, 0.15),
  step2Groove: planOutline(insetPlan(STEP2, 1), STEP2_TOP - 0.15, P, 6),
}

// ---------- TRAY ----------
export const TRAY_ART = {
  floor: solid(TRAY, 0, TRAY_FLOOR_Z, 8, 0.15),
  backWall: solid({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 1.6, r: 0.6 }, TRAY_FLOOR_Z, TRAY_WALL_H, 6, 0.15),
  frontWall: solid({ x: TRAY.x, y: TRAY.y + TRAY.d - 1.6, w: TRAY.w, d: 1.6, r: 0.6 }, TRAY_FLOOR_Z, TRAY_WALL_H - 1, 6, 0.15),
  rightWall: solid({ x: TRAY.x + TRAY.w - 1.6, y: TRAY.y + 1.6, w: 1.6, d: TRAY.d - 3.2, r: 0.6 }, TRAY_FLOOR_Z, TRAY_WALL_H, 6, 0.15),
  lip: topTicks(TRAY.x + 1, TRAY.x + TRAY.w - 1, 3, 4, 1.6, TRAY_FLOOR_Z + TRAY_WALL_H - 0.1, [0.6, 1.4], P, 'x'),
  ears: [
    solid({ x: TRAY.x - 1.2, y: TRAY.y + 4, w: 1.6, d: 6, r: 0.4 }, TRAY_FLOOR_Z + 1, 1.6, 4, 0.1),
    solid({ x: TRAY.x - 1.2, y: TRAY.y + TRAY.d - 10, w: 1.6, d: 6, r: 0.4 }, TRAY_FLOOR_Z + 1, 1.6, 4, 0.1),
  ],
  rivets: [
    [TRAY.x - 0.4, TRAY.y + 5],
    [TRAY.x - 0.4, TRAY.y + TRAY.d - 5],
  ] as Flat[],
  restingCards: [0, 1].map((i) => {
    const x = CARD_IN_TRAY.x - i * 4
    const y = CARD_IN_TRAY.y + i * 1.6
    return {
      slab: solid({ x, y, w: CARD.w, d: CARD.d, r: CARD.r }, TRAY_FLOOR_Z + 0.2, CARD.h, 6, 0.15),
      stamp: ring(x + CARD.w - 3.2, y + CARD.d / 2, 1.3, TRAY_FLOOR_Z + 0.2 + CARD.h + 0.02, P, 12),
    }
  }),
}

// ---------- WIRES (kept minimal and honest) ----------
export const WIRE_ART = {
  dialToHouse: null as null,
}
