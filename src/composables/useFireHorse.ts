import { ref, computed, watch, onBeforeUnmount, type Ref } from 'vue'
import {
  GALLOP_FRAMES,
  HORSE_WIDTH,
  HORSE_HEIGHT,
  type PathPoint,
  type SilhouetteFrame,
} from '@/lib/horse-silhouette'

interface FireHorseOptions {
  preset: 'subtle' | 'balanced' | 'dramatic'
}

interface PresetConfig {
  transitDuration: number // seconds to cross screen
  appearInterval: number // seconds between appearances
  glowIntensity: number // base shadowBlur value
  trailLength: number // trail dot count
  fireIntensity: number // multiplier for fire effects (0.6-1.4)
}

// Trail stores centroid + tail tip screen positions
interface TrailPoint {
  screenX: number
  screenY: number
  opacity: number
}

interface HorseState {
  isVisible: boolean
  nextAppearanceTime: number
  startTime: number
  x: number
  y: number
  yBob: number
  frameProgress: number
  opacity: number
  scale: number
  trail: TrailPoint[]
}

const PRESET_CONFIGS: Record<string, PresetConfig> = {
  subtle: {
    transitDuration: 12,
    appearInterval: 60,
    glowIntensity: 8,
    trailLength: 30,
    fireIntensity: 0.6,
  },
  balanced: {
    transitDuration: 8,
    appearInterval: 45,
    glowIntensity: 15,
    trailLength: 50,
    fireIntensity: 1.0,
  },
  dramatic: {
    transitDuration: 5,
    appearInterval: 20,
    glowIntensity: 25,
    trailLength: 70,
    fireIntensity: 1.4,
  },
}

const GALLOP_CYCLE_DURATION = 1.8
const FADE_DURATION = 1.0

// Mane/tail phase lag for secondary motion
const MANE_LAG = 0.10
const TAIL_LAG = 0.14

// Catmull-Rom scalar interpolation
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  )
}

// Smooth ease for horizontal movement
function easeTransit(progress: number): number {
  if (progress < 0.08) {
    return progress * progress * (1 / 0.08)
  } else if (progress > 0.92) {
    const t = (1 - progress) / 0.08
    return 1 - t * t * (1 / 0.08) * 0.08 + (progress - 0.92) * (1 / 0.08) * 0.92
  }
  return progress
}

// Interpolate a PathPoint array at a given cycle progress using Catmull-Rom
function interpolatePathArray(
  frames: SilhouetteFrame[],
  getter: (f: SilhouetteFrame) => PathPoint[],
  progress: number
): PathPoint[] {
  const n = frames.length
  const p = ((progress % 1) + 1) % 1
  const idx = Math.floor(p * n) % n
  const t = (p * n) % 1

  const i0 = (idx - 1 + n) % n
  const i1 = idx
  const i2 = (idx + 1) % n
  const i3 = (idx + 2) % n

  const arr0 = getter(frames[i0]!)
  const arr1 = getter(frames[i1]!)
  const arr2 = getter(frames[i2]!)
  const arr3 = getter(frames[i3]!)

  const len = arr1.length
  const result: PathPoint[] = []

  for (let j = 0; j < len; j++) {
    const a = arr0[j] ?? arr1[j]!
    const b = arr1[j]!
    const c = arr2[j] ?? arr1[j]!
    const d = arr3[j] ?? arr1[j]!

    result.push({
      x: catmullRom(a.x, b.x, c.x, d.x, t),
      y: catmullRom(a.y, b.y, c.y, d.y, t),
      sharp: b.sharp,
    })
  }

  return result
}

// Interpolate a scalar value across frames
function interpolateScalar(
  frames: SilhouetteFrame[],
  getter: (f: SilhouetteFrame) => number,
  progress: number
): number {
  const n = frames.length
  const p = ((progress % 1) + 1) % 1
  const idx = Math.floor(p * n) % n
  const t = (p * n) % 1

  const i0 = (idx - 1 + n) % n
  const i1 = idx
  const i2 = (idx + 1) % n
  const i3 = (idx + 2) % n

  return catmullRom(
    getter(frames[i0]!),
    getter(frames[i1]!),
    getter(frames[i2]!),
    getter(frames[i3]!),
    t
  )
}

// Build a smooth canvas path from PathPoints using Catmull-Rom → cubic bezier conversion
function buildPath(ctx: CanvasRenderingContext2D, points: PathPoint[], closed: boolean): void {
  const n = points.length
  if (n < 2) return

  ctx.moveTo(points[0]!.x, points[0]!.y)

  const segCount = closed ? n : n - 1
  for (let i = 0; i < segCount; i++) {
    const curr = points[i]!
    const next = points[(i + 1) % n]!

    // Sharp points get straight lines
    if (curr.sharp || next.sharp) {
      ctx.lineTo(next.x, next.y)
      continue
    }

    // Get 4 surrounding points for Catmull-Rom
    const prev = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)]!
    const after = points[closed ? (i + 2) % n : Math.min(n - 1, i + 2)]!

    // Convert Catmull-Rom to cubic bezier control points (tension = 6)
    const tension = 6
    const cp1x = curr.x + (next.x - prev.x) / tension
    const cp1y = curr.y + (next.y - prev.y) / tension
    const cp2x = next.x - (after.x - curr.x) / tension
    const cp2y = next.y - (after.y - curr.y) / tension

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y)
  }

  if (closed) {
    ctx.closePath()
  }
}

export function useFireHorse(options: Ref<FireHorseOptions>) {
  const config = computed(() => PRESET_CONFIGS[options.value.preset])
  const isMobile = ref(false)
  const prefersReducedMotion = ref(false)

  const state = ref<HorseState>({
    isVisible: false,
    nextAppearanceTime: 0,
    startTime: 0,
    x: -0.3,
    y: 0,
    yBob: 0,
    frameProgress: 0,
    opacity: 0,
    scale: 1,
    trail: [],
  })

  let animationFrameId: number | null = null

  function updateEnvironment() {
    isMobile.value = window.innerWidth < 768
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Get fully interpolated frame (body, mane with lag, tail with lag)
  function getCurrentFrame(): {
    body: PathPoint[]
    mane: PathPoint[]
    tail: PathPoint[]
    torsoCenterX: number
    torsoCenterY: number
  } {
    const progress = state.value.frameProgress

    return {
      body: interpolatePathArray(GALLOP_FRAMES, f => f.body, progress),
      mane: interpolatePathArray(GALLOP_FRAMES, f => f.mane, progress - MANE_LAG),
      tail: interpolatePathArray(GALLOP_FRAMES, f => f.tail, progress - TAIL_LAG),
      torsoCenterX: interpolateScalar(GALLOP_FRAMES, f => f.torsoCenterX, progress),
      torsoCenterY: interpolateScalar(GALLOP_FRAMES, f => f.torsoCenterY, progress),
    }
  }

  function updateState(timestamp: number) {
    if (prefersReducedMotion.value) {
      state.value.isVisible = true
      state.value.x = 0.5
      state.value.yBob = 0
      state.value.opacity = 1
      state.value.frameProgress = 0.25
      return
    }

    if (!state.value.isVisible && timestamp >= state.value.nextAppearanceTime) {
      startNewAppearance(timestamp)
    }

    if (!state.value.isVisible) return

    const elapsed = (timestamp - state.value.startTime) / 1000
    const transitDuration = config.value?.transitDuration ?? 8
    const progress = elapsed / transitDuration

    // Gallop cycle
    const cycleProgress = (elapsed % GALLOP_CYCLE_DURATION) / GALLOP_CYCLE_DURATION
    state.value.frameProgress = cycleProgress

    // Horizontal position with stride oscillation
    const easedProgress = easeTransit(Math.min(progress, 1))
    const strideOscillation = Math.sin(cycleProgress * Math.PI * 2) * 0.003
    state.value.x = -0.3 + easedProgress * 1.6 + strideOscillation

    // Vertical gallop bob
    state.value.yBob = Math.sin(cycleProgress * Math.PI * 2) * 0.008

    // Fade in/out
    if (elapsed < FADE_DURATION) {
      state.value.opacity = elapsed / FADE_DURATION
    } else if (elapsed > transitDuration - FADE_DURATION) {
      state.value.opacity = Math.max(0, (transitDuration - elapsed) / FADE_DURATION)
    } else {
      state.value.opacity = 1
    }

    if (progress >= 1.0) {
      endAppearance(timestamp)
    }
  }

  // Update trail with centroid positions
  function updateTrail(width: number, height: number) {
    if (prefersReducedMotion.value || state.value.opacity <= 0) return

    const trailMax = config.value?.trailLength ?? 50
    const maxLength = isMobile.value ? Math.floor(trailMax * 0.5) : trailMax

    const frame = getCurrentFrame()
    const scale = state.value.scale
    const horseX = state.value.x * width
    const horseY = (state.value.y + state.value.yBob) * height

    // Add centroid trail point
    state.value.trail.push({
      screenX: horseX + (-frame.torsoCenterX) * scale,
      screenY: horseY + frame.torsoCenterY * scale,
      opacity: state.value.opacity * 0.3,
    })

    while (state.value.trail.length > maxLength) {
      state.value.trail.shift()
    }

    // Fade by age
    const len = state.value.trail.length
    for (let i = 0; i < len; i++) {
      const dot = state.value.trail[i]
      if (dot) {
        dot.opacity = 0.3 * (1 - (len - i) / maxLength) * state.value.opacity
      }
    }
  }

  function startNewAppearance(timestamp: number) {
    updateEnvironment()
    state.value.isVisible = true
    state.value.startTime = timestamp
    state.value.x = -0.3
    state.value.yBob = 0
    state.value.opacity = 0
    state.value.frameProgress = 0
    state.value.trail = []
    state.value.y = 0.6 + (Math.random() - 0.5) * 0.05
  }

  function endAppearance(timestamp: number) {
    state.value.isVisible = false
    state.value.trail = []
    const baseInterval = isMobile.value ? 90 : (config.value?.appearInterval ?? 45)
    const interval = baseInterval * (1 + (Math.random() - 0.5) * 0.2)
    state.value.nextAppearanceTime = timestamp + interval * 1000
  }

  // Draw fire trail behind the horse
  function drawTrail(ctx: CanvasRenderingContext2D) {
    const intensity = config.value?.fireIntensity ?? 1.0

    ctx.save()
    for (const dot of state.value.trail) {
      if (dot.opacity <= 0.01) continue

      ctx.globalAlpha = dot.opacity * intensity
      ctx.shadowBlur = 12
      ctx.shadowColor = '#f59e0b'
      ctx.fillStyle = '#fb923c'
      ctx.beginPath()
      ctx.arc(dot.screenX, dot.screenY, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Multi-layer fire silhouette rendering
  function drawFireSilhouette(
    ctx: CanvasRenderingContext2D,
    frame: { body: PathPoint[]; mane: PathPoint[]; tail: PathPoint[]; torsoCenterX: number; torsoCenterY: number },
    x: number,
    y: number,
    scale: number,
    opacity: number
  ) {
    if (opacity <= 0) return

    const cycleProgress = state.value.frameProgress
    const glowPulse = 1 + 0.15 * Math.sin(cycleProgress * Math.PI * 2)
    const intensity = config.value?.fireIntensity ?? 1.0
    const glow = config.value?.glowIntensity ?? 15
    const timeNow = Date.now() / 1000

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.scale(-1, 1) // flip horizontally (horse faces right)

    // --- LAYER 1: Outer warm halo (skip on mobile) ---
    if (!isMobile.value) {
      ctx.beginPath()
      buildPath(ctx, frame.body, true)
      ctx.shadowColor = '#ea580c'
      ctx.shadowBlur = 40 * glowPulse * intensity
      ctx.strokeStyle = `rgba(249, 115, 22, ${opacity * 0.3 * intensity})`
      ctx.lineWidth = 8
      ctx.globalAlpha = opacity * 0.4
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // --- LAYER 2: Fire gradient fill ---
    const gradient = ctx.createRadialGradient(
      frame.torsoCenterX, frame.torsoCenterY, 5,
      frame.torsoCenterX, frame.torsoCenterY, 80
    )
    gradient.addColorStop(0, `rgba(255, 247, 237, ${opacity})`)
    gradient.addColorStop(0.2, `rgba(253, 186, 116, ${opacity})`)
    gradient.addColorStop(0.5, `rgba(249, 115, 22, ${opacity * 0.9})`)
    gradient.addColorStop(0.8, `rgba(234, 88, 12, ${opacity * 0.8})`)
    gradient.addColorStop(1, `rgba(154, 52, 18, ${opacity * 0.5})`)

    ctx.beginPath()
    buildPath(ctx, frame.body, true)
    ctx.fillStyle = gradient
    ctx.globalAlpha = opacity * 0.85 * intensity
    ctx.fill()

    // --- LAYER 3: Crisp burning edge ---
    ctx.beginPath()
    buildPath(ctx, frame.body, true)
    ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.9})`
    ctx.lineWidth = 1.5
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 6 * glowPulse * intensity
    ctx.globalAlpha = opacity * 0.7
    ctx.stroke()
    ctx.shadowBlur = 0

    // --- LAYER 4: Inner hotspot (clipped to body) ---
    ctx.save()
    ctx.beginPath()
    buildPath(ctx, frame.body, true)
    ctx.clip()

    const hotspot = ctx.createRadialGradient(
      frame.torsoCenterX, frame.torsoCenterY - 5, 2,
      frame.torsoCenterX, frame.torsoCenterY, 35
    )
    hotspot.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5 * intensity})`)
    hotspot.addColorStop(0.5, `rgba(255, 247, 237, ${opacity * 0.2})`)
    hotspot.addColorStop(1, 'rgba(255, 247, 237, 0)')

    ctx.fillStyle = hotspot
    ctx.globalAlpha = opacity * 0.5
    ctx.fillRect(-20, 0, HORSE_WIDTH + 40, HORSE_HEIGHT + 20)
    ctx.restore()

    // --- LAYER 5: Mane flames ---
    drawFlowingFire(ctx, frame.mane, opacity, glowPulse, timeNow, intensity, glow, 'mane')

    // --- LAYER 6: Tail flames ---
    drawFlowingFire(ctx, frame.tail, opacity, glowPulse, timeNow, intensity, glow, 'tail')

    // --- LAYER 7: Joint sparkles (skip on mobile) ---
    if (!isMobile.value) {
      drawSparkles(ctx, frame.body, opacity, glowPulse, timeNow, intensity)
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Multi-pass flickering fire strokes for mane and tail
  function drawFlowingFire(
    ctx: CanvasRenderingContext2D,
    points: PathPoint[],
    opacity: number,
    glowPulse: number,
    time: number,
    intensity: number,
    glow: number,
    type: 'mane' | 'tail'
  ) {
    if (points.length < 2) return

    const widths = type === 'mane' ? [6, 4, 2] : [8, 5, 3]
    const colors = [
      `rgba(234, 88, 12, ${opacity * 0.3 * intensity})`,
      `rgba(249, 115, 22, ${opacity * 0.6 * intensity})`,
      `rgba(251, 191, 36, ${opacity * 0.8 * intensity})`,
    ]
    const passes = isMobile.value ? 2 : 3

    for (let pass = 0; pass < passes; pass++) {
      // Offset points with time-based flicker for flame effect
      const flickerAmp = (3 - pass) * 1.5
      const offsetPoints: PathPoint[] = points.map((p, i) => ({
        x: p.x + Math.sin(time * 3 + i * 0.8 + pass) * flickerAmp,
        y: p.y + Math.cos(time * 2.5 + i * 1.1 + pass) * flickerAmp * 0.6,
      }))

      ctx.beginPath()
      buildPath(ctx, offsetPoints, false)
      ctx.strokeStyle = colors[pass] ?? colors[0]!
      ctx.lineWidth = (widths[pass] ?? 2) * glowPulse
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = pass === (passes - 1) ? '#fbbf24' : '#ea580c'
      ctx.shadowBlur = (pass === (passes - 1) ? 6 : glow) * glowPulse * intensity
      ctx.globalAlpha = opacity * (0.4 + pass * 0.2)
      ctx.stroke()
    }

    ctx.shadowBlur = 0
  }

  // Twinkling sparkle points at joints
  function drawSparkles(
    ctx: CanvasRenderingContext2D,
    bodyPoints: PathPoint[],
    opacity: number,
    glowPulse: number,
    time: number,
    intensity: number
  ) {
    // Sparkle at key outline positions: muzzle, ear, withers, hooves, croup
    const sparkleIndices = [0, 2, 5, 8, 14, 15, 24, 25]

    ctx.fillStyle = '#fff7ed'
    ctx.shadowColor = '#fbbf24'

    for (const idx of sparkleIndices) {
      const pt = bodyPoints[idx]
      if (!pt) continue

      const twinkle = 0.5 + 0.5 * Math.sin(time * 4 + idx * 1.7)
      const size = 1.5 + twinkle * 1.5

      ctx.globalAlpha = opacity * twinkle * 0.7 * intensity
      ctx.shadowBlur = 8 * glowPulse * twinkle
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.shadowBlur = 0
  }

  // Main render
  function render(ctx: CanvasRenderingContext2D, width: number, height: number, timestamp: number) {
    updateState(timestamp)

    if (!state.value.isVisible && !prefersReducedMotion.value) return
    if (state.value.opacity <= 0) return

    const targetWidthPercent = isMobile.value ? 0.35 : 0.25
    const scale = (width * targetWidthPercent) / HORSE_WIDTH
    state.value.scale = scale

    updateTrail(width, height)
    drawTrail(ctx)

    const frame = getCurrentFrame()
    const x = state.value.x * width
    const y = (state.value.y + state.value.yBob) * height

    drawFireSilhouette(ctx, frame, x, y, scale, state.value.opacity)
  }

  // Get hoof screen positions for spark spawning
  function getHoofPositions(width: number, height: number): { x: number; y: number }[] {
    if (!state.value.isVisible || state.value.opacity <= 0) return []

    const progress = state.value.frameProgress
    const scale = state.value.scale
    const horseX = state.value.x * width
    const horseY = (state.value.y + state.value.yBob) * height

    const frontX = interpolateScalar(GALLOP_FRAMES, f => f.hoofFront.x, progress)
    const frontY = interpolateScalar(GALLOP_FRAMES, f => f.hoofFront.y, progress)
    const backX = interpolateScalar(GALLOP_FRAMES, f => f.hoofBack.x, progress)
    const backY = interpolateScalar(GALLOP_FRAMES, f => f.hoofBack.y, progress)

    return [
      { x: horseX + (-frontX) * scale, y: horseY + frontY * scale },
      { x: horseX + (-backX) * scale, y: horseY + backY * scale },
    ]
  }

  function start() {
    updateEnvironment()
    state.value.nextAppearanceTime = Date.now() + (config.value?.appearInterval ?? 45) * 1000
  }

  function stop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    state.value.isVisible = false
    state.value.trail = []
  }

  function triggerNow() {
    startNewAppearance(Date.now())
  }

  watch(
    () => options.value.preset,
    () => { /* preset change takes effect on next frame via config computed */ }
  )

  onBeforeUnmount(() => {
    stop()
  })

  return {
    render,
    start,
    stop,
    triggerNow,
    getHoofPositions,
    state: computed(() => state.value),
  }
}
