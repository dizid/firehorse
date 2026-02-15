/**
 * Horse silhouette data for fire horse animation.
 * Four gallop cycle frames, each defining the horse as smooth bezier outline paths.
 * Points are auto-smoothed via Catmull-Rom → cubic bezier conversion in the renderer.
 */

export interface PathPoint {
  x: number
  y: number
  sharp?: boolean // if true, use straight lines (angular joints, hooves)
}

export interface SilhouetteFrame {
  body: PathPoint[]      // closed outline (~32 points, clockwise from muzzle)
  mane: PathPoint[]      // open path for mane flames (5 points)
  tail: PathPoint[]      // open path for tail flames (4 points)
  hoofFront: { x: number; y: number }
  hoofBack: { x: number; y: number }
  torsoCenterX: number   // for radial fire gradient center
  torsoCenterY: number
}

export const HORSE_WIDTH = 200
export const HORSE_HEIGHT = 150

// Compact point helper
function pt(x: number, y: number, sharp?: boolean): PathPoint {
  return sharp ? { x, y, sharp: true } : { x, y }
}

/**
 * Frame 1: GATHERED
 * Suspension phase — all four legs tucked under body, airborne
 */
const FRAME_GATHERED: SilhouetteFrame = {
  body: [
    // HEAD (0-3)
    pt(10, 38),           // 0: muzzle tip
    pt(14, 30),           // 1: forehead
    pt(22, 24, true),     // 2: ear tip
    pt(28, 32),           // 3: nape

    // TOPLINE (4-9)
    pt(40, 34),           // 4: crest
    pt(56, 36),           // 5: withers
    pt(74, 44),           // 6: back
    pt(94, 48),           // 7: loin
    pt(114, 52),          // 8: croup
    pt(122, 58),          // 9: dock

    // HINDQUARTERS & BACK LEG (10-17)
    pt(118, 66),          // 10: buttock
    pt(112, 76),          // 11: upper thigh
    pt(104, 94),          // 12: hock
    pt(97, 110),          // 13: back cannon
    pt(93, 126, true),    // 14: back hoof rear
    pt(87, 126, true),    // 15: back hoof toe
    pt(90, 102),          // 16: back ascending
    pt(96, 78),           // 17: stifle return

    // BELLY (18-20)
    pt(88, 68),           // 18: belly rear
    pt(78, 64),           // 19: belly mid
    pt(68, 62),           // 20: belly front

    // FRONT LEG (21-27)
    pt(66, 68),           // 21: front elbow
    pt(70, 86),           // 22: front knee
    pt(73, 104),          // 23: front cannon
    pt(76, 124, true),    // 24: front hoof rear
    pt(71, 124, true),    // 25: front hoof toe
    pt(68, 94),           // 26: front ascending
    pt(64, 70),           // 27: front forearm

    // UNDERSIDE (28-31)
    pt(62, 56),           // 28: chest
    pt(38, 48),           // 29: throat
    pt(20, 44),           // 30: jaw
    pt(12, 40),           // 31: lower lip
  ],

  mane: [
    pt(24, 22),
    pt(32, 26),
    pt(40, 30),
    pt(48, 32),
    pt(54, 34),
  ],

  tail: [
    pt(124, 60),
    pt(136, 64),
    pt(148, 70),
    pt(158, 78),
  ],

  hoofFront: { x: 74, y: 124 },
  hoofBack: { x: 90, y: 126 },
  torsoCenterX: 82,
  torsoCenterY: 52,
}

/**
 * Frame 2: FRONT REACH
 * Front legs extended forward, back legs gathering under
 */
const FRAME_FRONT_REACH: SilhouetteFrame = {
  body: [
    // HEAD — slightly forward and lower
    pt(8, 40),
    pt(12, 32),
    pt(20, 27, true),
    pt(26, 34),

    // TOPLINE
    pt(38, 36),
    pt(54, 38),
    pt(72, 46),
    pt(92, 50),
    pt(112, 54),
    pt(120, 60),

    // HINDQUARTERS & BACK LEG — still somewhat gathered
    pt(116, 68),
    pt(110, 78),
    pt(102, 96),
    pt(95, 112),
    pt(91, 128, true),
    pt(85, 128, true),
    pt(88, 104),
    pt(94, 80),

    // BELLY
    pt(86, 70),
    pt(74, 66),
    pt(62, 62),

    // FRONT LEG — reaching far forward
    pt(58, 66),
    pt(50, 90),
    pt(44, 112),
    pt(43, 130, true),
    pt(38, 130, true),
    pt(46, 100),
    pt(54, 72),

    // UNDERSIDE
    pt(58, 56),
    pt(36, 50),
    pt(18, 46),
    pt(10, 42),
  ],

  mane: [
    pt(22, 24),
    pt(30, 28),
    pt(38, 32),
    pt(46, 34),
    pt(52, 36),
  ],

  tail: [
    pt(122, 62),
    pt(134, 66),
    pt(146, 72),
    pt(156, 80),
  ],

  hoofFront: { x: 40, y: 130 },
  hoofBack: { x: 88, y: 128 },
  torsoCenterX: 80,
  torsoCenterY: 54,
}

/**
 * Frame 3: EXTENDED
 * Classic "flying gallop" — all four legs fully extended
 */
const FRAME_EXTENDED: SilhouetteFrame = {
  body: [
    // HEAD — maximum forward extension, lower
    pt(5, 42),
    pt(10, 34),
    pt(17, 29, true),
    pt(24, 36),

    // TOPLINE — body stretched long
    pt(36, 38),
    pt(52, 40),
    pt(70, 48),
    pt(90, 52),
    pt(110, 56),
    pt(118, 62),

    // HINDQUARTERS & BACK LEG — extended far behind
    pt(114, 70),
    pt(116, 82),
    pt(122, 100),
    pt(130, 116),
    pt(135, 132, true),
    pt(129, 132, true),
    pt(120, 108),
    pt(108, 80),

    // BELLY — stretched wide
    pt(96, 70),
    pt(76, 66),
    pt(60, 62),

    // FRONT LEG — extended far forward
    pt(54, 66),
    pt(42, 94),
    pt(36, 114),
    pt(35, 132, true),
    pt(30, 132, true),
    pt(38, 102),
    pt(48, 72),

    // UNDERSIDE
    pt(52, 58),
    pt(34, 52),
    pt(16, 48),
    pt(7, 44),
  ],

  mane: [
    pt(20, 26),
    pt(28, 30),
    pt(36, 34),
    pt(44, 36),
    pt(50, 38),
  ],

  tail: [
    pt(120, 64),
    pt(132, 68),
    pt(144, 74),
    pt(156, 82),
  ],

  hoofFront: { x: 32, y: 132 },
  hoofBack: { x: 132, y: 132 },
  torsoCenterX: 78,
  torsoCenterY: 56,
}

/**
 * Frame 4: BACK PUSH
 * Front legs gathering under, back legs pushing behind
 */
const FRAME_BACK_PUSH: SilhouetteFrame = {
  body: [
    // HEAD — raised high (collecting)
    pt(12, 35),
    pt(16, 26),
    pt(24, 22, true),
    pt(30, 28),

    // TOPLINE — slightly arched
    pt(42, 30),
    pt(58, 34),
    pt(76, 42),
    pt(96, 46),
    pt(116, 50),
    pt(124, 56),

    // HINDQUARTERS & BACK LEG — extended behind, pushing
    pt(120, 64),
    pt(120, 76),
    pt(132, 94),
    pt(142, 110),
    pt(150, 126, true),
    pt(144, 126, true),
    pt(136, 100),
    pt(116, 76),

    // BELLY
    pt(100, 66),
    pt(82, 62),
    pt(70, 58),

    // FRONT LEG — gathering under body
    pt(68, 64),
    pt(72, 82),
    pt(76, 100),
    pt(80, 120, true),
    pt(75, 120, true),
    pt(72, 90),
    pt(66, 68),

    // UNDERSIDE
    pt(62, 52),
    pt(40, 44),
    pt(22, 38),
    pt(14, 36),
  ],

  mane: [
    pt(26, 20),
    pt(34, 24),
    pt(42, 26),
    pt(48, 28),
    pt(56, 32),
  ],

  tail: [
    pt(126, 58),
    pt(138, 62),
    pt(150, 68),
    pt(160, 76),
  ],

  hoofFront: { x: 78, y: 120 },
  hoofBack: { x: 148, y: 126 },
  torsoCenterX: 84,
  torsoCenterY: 50,
}

export const GALLOP_FRAMES: SilhouetteFrame[] = [
  FRAME_GATHERED,
  FRAME_FRONT_REACH,
  FRAME_EXTENDED,
  FRAME_BACK_PUSH,
]
