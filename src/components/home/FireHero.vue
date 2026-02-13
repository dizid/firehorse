<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import FireText from '@/components/ui/FireText.vue'
import FireButton from '@/components/ui/FireButton.vue'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  color: string
  maxOpacity: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationFrameId: number | null = null
let isMobile = false

const fireColors = [
  '#fb923c', // fire-400
  '#fbbf24', // ember-400
  '#f97316', // fire-500
  '#f59e0b', // ember-500
  '#ea580c', // fire-600
  '#fff7ed', // fire-50 (white-hot accent)
]

function initCanvas() {
  if (!canvas.value) return

  isMobile = window.innerWidth < 768
  const particleCount = isMobile ? 50 : 100

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  ctx = canvas.value.getContext('2d', { alpha: true })
  if (!ctx) return

  // Initialize particles
  particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle())
  }

  animate()
}

function createParticle(): Particle {
  const size = Math.random() * 3 + 1
  const maxOpacity = Math.random() * 0.6 + 0.3
  const colorIndex = Math.floor(Math.random() * fireColors.length)

  return {
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + Math.random() * 100,
    size,
    speedY: -(Math.random() * 2 + 1),
    speedX: (Math.random() - 0.5) * 0.8,
    opacity: 0,
    color: fireColors[colorIndex] || '#fb923c',
    maxOpacity,
  }
}

function animate() {
  if (!ctx || !canvas.value) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles.forEach((particle, index) => {
    // Update position
    particle.y += particle.speedY
    particle.x += particle.speedX

    // Calculate opacity based on position (fade in at bottom, fade out at top)
    const heightProgress = 1 - (particle.y / window.innerHeight)

    if (heightProgress < 0.1) {
      // Fade in
      particle.opacity = Math.min(particle.maxOpacity, heightProgress * 10 * particle.maxOpacity)
    } else if (heightProgress > 0.8) {
      // Fade out
      particle.opacity = Math.max(0, (1 - heightProgress) * 5 * particle.maxOpacity)
    } else {
      particle.opacity = particle.maxOpacity
    }

    // Reset particle if it goes off screen
    if (particle.y < -20 || particle.x < -20 || particle.x > window.innerWidth + 20) {
      particles[index] = createParticle()
      return
    }

    // Draw particle
    if (ctx) {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()

      // Add glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = particle.color
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }
  })

  animationFrameId = requestAnimationFrame(animate)
}

function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})

function scrollToFeatures() {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-ash-950">
    <!-- Fire particle canvas -->
    <canvas
      ref="canvas"
      class="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />

    <!-- Gradient overlay for depth -->
    <div class="absolute inset-0 bg-gradient-to-t from-ash-950 via-transparent to-transparent pointer-events-none" />

    <!-- Hero content -->
    <div class="relative z-10 container mx-auto px-4 py-20 text-center">
      <div class="max-w-5xl mx-auto space-y-8">
        <!-- Main title -->
        <FireText tag="h1" class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight tracking-tight">
          FireHorse 2026
        </FireText>

        <!-- Subtitle -->
        <p class="text-2xl sm:text-3xl md:text-4xl text-ash-300 font-display">
          Year of the Fire Horse · <span class="text-fire-400">丙午</span>
        </p>

        <!-- Description -->
        <p class="text-lg sm:text-xl text-ash-400 max-w-2xl mx-auto leading-relaxed">
          Once every 60 years, the Fire Horse blazes across the zodiac.
          Fierce, independent, and unstoppable. Are you ready to harness the flame?
        </p>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <FireButton size="lg" @click="scrollToFeatures">
            Explore the Legend
          </FireButton>
          <FireButton variant="secondary" size="lg">
            Check Your Sign
          </FireButton>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <svg
        class="w-6 h-6 text-fire-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>
</template>
