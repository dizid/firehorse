<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useFireHorse } from '@/composables/useFireHorse'

// Canvas and animation state
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null
let particles: Particle[] = []
let isMobile = false

// Preset management
type PresetId = 'subtle' | 'balanced' | 'dramatic'

interface PresetOption {
  id: PresetId
  label: string
  description: string
}

const presets: PresetOption[] = [
  {
    id: 'subtle',
    label: 'Subtle',
    description: 'Gentle embers, slow gallop, rare appearances (every ~60s)',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Full blaze, moderate speed, regular visits (every ~45s)',
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    description: 'Inferno intensity, fast gallop, frequent shows (every ~20s)',
  },
]

const activePreset = ref<PresetId>('balanced')

const presetDescription = computed(() => {
  const preset = presets.find((p) => p.id === activePreset.value)
  return preset?.description || ''
})

// Initialize constellation horse composable
const horseOptions = computed(() => ({ preset: activePreset.value }))
const horse = useFireHorse(horseOptions)

// Fire particle system with lifecycle colors, multi-layer glow, and spark effects
interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  maxOpacity: number
  birthY: number // Y position when spawned (for lifecycle calculation)
  flickerPhase: number // random offset for flicker
  flickerSpeed: number // how fast this particle flickers
  isSpark: boolean // true for hoof-spawned sparks
  lifetime: number // remaining frames for sparks (-1 = background particle)
}

// Lifecycle color: white-hot -> bright orange -> deep ember
function getFireColor(lifecycle: number): string {
  if (lifecycle < 0.2) {
    return '#fff7ed' // white-hot core
  } else if (lifecycle < 0.5) {
    // Interpolate from white-hot to bright orange
    const t = (lifecycle - 0.2) / 0.3
    const r = Math.round(255 - t * 6)
    const g = Math.round(247 - t * 132)
    const b = Math.round(237 - t * 215)
    return `rgb(${r},${g},${b})`
  } else {
    // Interpolate from bright orange to deep ember
    const t = (lifecycle - 0.5) / 0.5
    const r = Math.round(249 - t * 15)
    const g = Math.round(115 - t * 23)
    const b = Math.round(22 - t * 10)
    return `rgb(${r},${g},${b})`
  }
}

function createParticle(): Particle {
  const size = Math.random() * 7 + 3 // 3-10px
  const maxOpacity = Math.random() * 0.6 + 0.3
  const birthY = window.innerHeight + Math.random() * 100

  return {
    x: Math.random() * window.innerWidth,
    y: birthY,
    size,
    speedY: -(Math.random() * 2.5 + 1.5), // 1.5-4 upward
    speedX: (Math.random() - 0.5) * 1.2, // wider drift
    opacity: 0,
    maxOpacity,
    birthY,
    flickerPhase: Math.random() * Math.PI * 2,
    flickerSpeed: Math.random() * 3 + 2,
    isSpark: false,
    lifetime: -1,
  }
}

function createSparkParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI - Math.PI / 2 // upward arc
  const speed = Math.random() * 3 + 1.5
  return {
    x,
    y,
    size: Math.random() * 2 + 1, // small sparks
    speedY: Math.sin(angle) * speed - 1, // slight upward bias
    speedX: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
    opacity: 0.9,
    maxOpacity: 0.9,
    birthY: y,
    flickerPhase: Math.random() * Math.PI * 2,
    flickerSpeed: Math.random() * 6 + 4, // faster flicker for sparks
    isSpark: true,
    lifetime: Math.floor(Math.random() * 30 + 15), // 15-45 frames
  }
}

function initCanvas() {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return

  ctx.scale(dpr, dpr)

  // Initialize background particles
  isMobile = window.innerWidth < 768
  const particleCount = isMobile ? 60 : 100
  particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle())
  }

  // Start horse animation
  horse.start()

  // Start animation loop
  animate()
}

function animate() {
  if (!ctx || !canvasRef.value) return

  const width = canvasRef.value.width / (window.devicePixelRatio || 1)
  const height = canvasRef.value.height / (window.devicePixelRatio || 1)
  const now = Date.now() / 1000
  const maxParticles = isMobile ? 120 : 200

  ctx.clearRect(0, 0, width, height)

  // Enforce particle cap
  while (particles.length > maxParticles) {
    const sparkIdx = particles.findIndex(p => p.isSpark)
    if (sparkIdx >= 0) {
      particles.splice(sparkIdx, 1)
    } else {
      particles.shift()
    }
  }

  // Draw particles with lifecycle color, multi-layer glow, and flicker
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index]
    if (!particle) continue

    // Update position
    particle.y += particle.speedY
    particle.x += particle.speedX

    // Handle spark particles
    if (particle.isSpark) {
      particle.lifetime--
      if (particle.lifetime <= 0) {
        particles.splice(index, 1)
        continue
      }
      // Sparks decelerate and fall with gravity
      particle.speedY += 0.15
      particle.opacity = particle.maxOpacity * (particle.lifetime / 45)
    } else {
      // Background particle opacity (fade in/out based on height)
      const heightProgress = 1 - particle.y / height

      if (heightProgress < 0.1) {
        particle.opacity = Math.min(particle.maxOpacity, heightProgress * 10 * particle.maxOpacity)
      } else if (heightProgress > 0.8) {
        particle.opacity = Math.max(0, (1 - heightProgress) * 5 * particle.maxOpacity)
      } else {
        particle.opacity = particle.maxOpacity
      }

      // Reset if off-screen
      if (particle.y < -20 || particle.x < -20 || particle.x > width + 20) {
        particles[index] = createParticle()
        continue
      }
    }

    // Apply flicker
    const flicker = 0.85 + 0.15 * Math.sin(now * particle.flickerSpeed + particle.flickerPhase)
    const finalOpacity = particle.opacity * flicker

    if (finalOpacity <= 0.01) continue

    // Compute lifecycle color
    const lifecycle = particle.isSpark
      ? 1 - (particle.lifetime / 45) // sparks: lifecycle by remaining time
      : Math.max(0, Math.min(1, 1 - particle.y / height)) // background: by height
    const color = getFireColor(lifecycle)

    if (ctx) {
      // Multi-layer glow rendering
      const layers = isMobile ? 2 : 3

      if (layers >= 3) {
        // Layer 1: Wide soft glow
        ctx.globalAlpha = finalOpacity * 0.4
        ctx.shadowBlur = 30
        ctx.shadowColor = '#ea580c'
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Layer 2: Medium glow
      ctx.globalAlpha = finalOpacity * 0.7
      ctx.shadowBlur = 15
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2)
      ctx.fill()

      // Layer 3: Bright core
      ctx.globalAlpha = finalOpacity * 0.6
      ctx.shadowBlur = 5
      ctx.shadowColor = '#fff7ed'
      ctx.fillStyle = '#fff7ed'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }
  }

  // Draw constellation horse
  horse.render(ctx, width, height, Date.now())

  // Spawn hoof sparks when horse is visible
  const hooves = horse.getHoofPositions(width, height)
  if (hooves.length > 0) {
    // Spawn 2-4 sparks per hoof every ~3rd frame
    if (Math.random() < 0.33) {
      for (const hoof of hooves) {
        const sparkCount = Math.floor(Math.random() * 3) + 2
        for (let i = 0; i < sparkCount; i++) {
          particles.push(createSparkParticle(hoof.x, hoof.y))
        }
      }
    }
  }

  // Spawn trail sparks from horse body center
  const horseState = horse.state.value
  if (horseState.isVisible && horseState.opacity > 0.3) {
    if (Math.random() < 0.5) {
      const cx = horseState.x * width
      const cy = (horseState.y + horseState.yBob) * height
      const trailSpark = createSparkParticle(cx, cy)
      // Override direction: backward and slightly downward
      trailSpark.speedX = Math.random() * 2 + 1
      trailSpark.speedY = Math.random() * 1.5 - 0.5
      trailSpark.size = Math.random() * 1.5 + 0.5
      trailSpark.lifetime = Math.floor(Math.random() * 20 + 10)
      particles.push(trailSpark)
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

function handleResize() {
  initCanvas()
}

function triggerHorse() {
  horse.triggerNow()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  horse.stop()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section class="relative min-h-screen bg-ash-950 overflow-hidden">
    <!-- Canvas (full viewport) -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />

    <!-- Title overlay -->
    <div class="absolute top-8 left-0 right-0 text-center z-10">
      <h1 class="text-4xl font-display font-bold fire-text">Fire Horse Preview</h1>
      <p class="text-ash-400 mt-2">Choose your spectacle level</p>
    </div>

    <!-- Preset controls -->
    <div class="absolute bottom-8 left-0 right-0 z-20 px-4">
      <div class="max-w-md mx-auto glass rounded-2xl p-6">
        <div class="flex gap-3">
          <button
            v-for="preset in presets"
            :key="preset.id"
            @click="activePreset = preset.id"
            :class="[
              'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
              activePreset === preset.id
                ? 'btn-fire text-white'
                : 'bg-ash-800 text-ash-300 hover:bg-ash-700',
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
        <p class="text-ash-400 text-sm text-center mt-4">{{ presetDescription }}</p>
        <button
          @click="triggerHorse"
          class="w-full mt-4 py-2 bg-ash-800 hover:bg-ash-700 text-ash-300 rounded-lg text-sm transition-colors"
        >
          Trigger Now
        </button>
      </div>
    </div>
  </section>
</template>
