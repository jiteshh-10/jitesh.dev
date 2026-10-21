import { fitProjection, iso, type Flat, type Plan, type Point3, type Projection } from "../../iso/iso-kit";

export const WIDTH = 640;
export const HEIGHT = 380;
const PAD = 28;
/** 48° shows the long bench face-on while keeping the dial legible. */
export const AZIMUTH = 48;

/* ---------------------------------- bench --------------------------------- */
export const BENCH: Plan = { x: -156, y: -64, w: 356, d: 132, r: 8 };
export const BENCH_H = 10;
export const FOOT = 5;

/* --------------------------------- infeed --------------------------------- */
export const STACK_PAD: Plan = { x: -152, y: -32, w: 44, d: 54, r: 3 };
export const PILE = { x: -132, y: -6, z: 0 };
export const CARD = { w: 14, d: 9, h: 1.8, r: 1 };
export const PILE_COUNT = 3;
/** Spring pusher behind the stack: housing, collar, rod. */
export const PUSHER = { x: -154, y: 26, w: 14, d: 13, h: 10, r: 2 };
export const PUSHER_ROD = { z: 4.2, r: 1.1, tip: -142 };

/* ---------------------------------- weigh --------------------------------- */
export const WEIGH_PAD: Plan = { x: -64, y: -16, w: 42, d: 42, r: 3 };
export const WEIGH_Z = 2;
export const DIAL: Flat = [-42, -46];
export const DIAL_R = 17;
export const DIAL_Z = 3.4;
export const DIAL_H = 9;
export const DIAL_TOP = DIAL_Z + DIAL_H;

/* ---------------------------------- gate ---------------------------------- */
/* Flat points switch: a blade pivots at the mouth and leans against the
   chosen lane rail; the card keeps contact and follows. No lifted parts. */
export const GATE_BED: Plan = { x: -2, y: -40, w: 26, d: 84, r: 2 };
export const BLADE = { x: 20, y: -2, len: 17, w: 2.4, h: 1.3, z: 1.4 };
export const BLADE_MAX = 24; // degrees, ±z rotation from straight +x
export const MAST = { x: 9, y: -18, w: 6, d: 6, h: 11, r: 1.4 };
export const LEVER = { z: 13.4, len: 20, max: 26 };
/** spur slabs: the diagonal feeder each lane runs onto after the blade */
export const SPUR = { from: 24, to: 46, w: 6.5 };
export const UPPER_Y = -34;
export const LOWER_Y = 34;
export const LANE_W = 9;
export const LANE_TOP = 1.4;
export const LANES_START = 30;
export const LANES_MERGE = 72;

/* ---------------------------------- core ---------------------------------- */
/* The house is punched twice: a front doorway (cards drive in at lane level)
   and a right-side port (finished cards exit raised). Painter's order makes
   both honest: interior dark, card, then the wall slabs around each hole. */
export const HOUSE: Plan = { x: 96, y: -46, w: 44, d: 44, r: 3 };
export const HOUSE_H = 20;
export const DOOR = { x0: 108, x1: 124, z0: 2, z1: 8.4 }; // front face (y = -2)
export const EXIT = { y0: -16, y1: -4, z0: 8, z1: 14 }; // right face (x = 140)
export const FLY = { x: 118, y: -24, r: 13, z: HOUSE_H };
export const FLY_H = 3;
export const CROWN = { r: 8.2, z: FLY.z + FLY_H, h: 2.4 };
export const SHAFT = { r: 2, z: CROWN.z + CROWN.h, h: 4.2 };
export const NOTCHES = 18;

/* ---------------------------------- exit ---------------------------------- */
export const STEP1: Plan = { x: 144, y: -12, w: 10, d: 26, r: 1 };
export const STEP1_TOP = 8.6;
export const STEP2: Plan = { x: 158, y: -12, w: 10, d: 28, r: 1 };
export const STEP2_TOP = 5;
export const TRAY: Plan = { x: 172, y: -18, w: 26, d: 30, r: 2 };
export const TRAY_FLOOR_Z = 2;
export const TRAY_WALL_H = 7;
export const CARD_IN_TRAY = { x: 183, y: -4 };

/* --------------------------------- travel --------------------------------- */
/* The card's ride: stack → pad → gate → blade → lane → merge → door. */
export const WALK = {
  stack: [-128, -4] as const,
  pad: [-40, -2] as const,
  mouth: [12, -2] as const,
  laneEntry: 34,
  laneStraight: [44, 68] as const,
  merge: { from: [72, 0], to: [88, -2] }, // off lane onto the shared run-in
  door: [112, -2] as const,
  inside: [116, -10] as const,
  port: [140, -10, 10.4] as const,
  step1: 149,
  step2: 163,
  tray: [182, -2] as const,
};

/* --------------------------------- fit/cam -------------------------------- */
const corners = ({ x, y, w, d }: Plan, z0: number, z1: number): Point3[] => {
  const out: Point3[] = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
};

const FLY_TIP: Point3 = [FLY.x, FLY.y, SHAFT.z + SHAFT.h + 1.6];
const LEVER_TIP: Point3 = [
  MAST.x + MAST.w / 2 - Math.sin(LEVER.max * (Math.PI / 180)) * LEVER.len,
  MAST.y + MAST.d / 2 - Math.cos(LEVER.max * (Math.PI / 180)) * LEVER.len,
  LEVER.z + 4.6,
];

export const P: Projection = fitProjection([
  ...corners(BENCH, -BENCH_H - FOOT, 0),
  [DIAL[0] + DIAL_R + 6, DIAL[1] + DIAL_R + 6, DIAL_TOP + 1],
  [DIAL[0] - DIAL_R - 2, DIAL[1] - DIAL_R - 2, 0],
  FLY_TIP,
  LEVER_TIP,
], WIDTH, HEIGHT, { pad: PAD, azimuth: AZIMUTH });

export const at = (point: Point3) => iso(point, P);

const ORIGIN = at([0, 0, 0]);
const minus = (a: Flat, b: Flat): Flat => [a[0] - b[0], a[1] - b[1]];
export const EX = minus(at([1, 0, 0]), ORIGIN);
export const EY = minus(at([0, 1, 0]), ORIGIN);
export const EZ = minus(at([0, 0, 1]), ORIGIN);
