<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const targetDate = new Date('2026-02-17T00:00:00+08:00') // Chinese New Year 2026 (China timezone)
const timeLeft = ref<TimeLeft>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

let intervalId: number | null = null

function calculateTimeLeft() {
  const now = new Date().getTime()
  const target = targetDate.getTime()
  const difference = target - now

  if (difference > 0) {
    timeLeft.value = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    }
  } else {
    // Event has passed
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (intervalId) {
      clearInterval(intervalId)
    }
  }
}

onMounted(() => {
  calculateTimeLeft()
  intervalId = window.setInterval(calculateTimeLeft, 1000)
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

function formatNumber(num: number): string {
  return num.toString().padStart(2, '0')
}
</script>

<template>
  <section class="py-20 px-4 bg-gradient-to-b from-ash-950 via-ash-900 to-ash-950">
    <div class="container mx-auto max-w-6xl">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span class="fire-text">The Fire Ignites</span>
        </h2>
        <p class="text-xl text-ash-400">
          Chinese New Year 2026 · February 17
        </p>
      </div>

      <!-- Countdown cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <GlassCard :glow="true" padding="p-6 md:p-8">
          <div class="text-center space-y-2">
            <div class="fire-text text-5xl sm:text-6xl md:text-7xl font-display font-bold">
              {{ formatNumber(timeLeft.days) }}
            </div>
            <div class="text-sm sm:text-base text-ash-400 uppercase tracking-wider">
              Days
            </div>
          </div>
        </GlassCard>

        <GlassCard :glow="true" padding="p-6 md:p-8">
          <div class="text-center space-y-2">
            <div class="fire-text text-5xl sm:text-6xl md:text-7xl font-display font-bold">
              {{ formatNumber(timeLeft.hours) }}
            </div>
            <div class="text-sm sm:text-base text-ash-400 uppercase tracking-wider">
              Hours
            </div>
          </div>
        </GlassCard>

        <GlassCard :glow="true" padding="p-6 md:p-8">
          <div class="text-center space-y-2">
            <div class="fire-text text-5xl sm:text-6xl md:text-7xl font-display font-bold">
              {{ formatNumber(timeLeft.minutes) }}
            </div>
            <div class="text-sm sm:text-base text-ash-400 uppercase tracking-wider">
              Minutes
            </div>
          </div>
        </GlassCard>

        <GlassCard :glow="true" padding="p-6 md:p-8">
          <div class="text-center space-y-2">
            <div class="fire-text text-5xl sm:text-6xl md:text-7xl font-display font-bold">
              {{ formatNumber(timeLeft.seconds) }}
            </div>
            <div class="text-sm sm:text-base text-ash-400 uppercase tracking-wider">
              Seconds
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>
