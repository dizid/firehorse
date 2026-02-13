<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireButton from '@/components/ui/FireButton.vue'
import type { CompatibilityResult } from '@/types'

const props = defineProps<{
  result: CompatibilityResult
}>()

const emit = defineEmits<{
  reset: []
}>()

const animatedScore = ref(0)
const circumference = 2 * Math.PI * 70 // radius = 70

const strokeDashoffset = computed(() => {
  const progress = animatedScore.value / 100
  return circumference * (1 - progress)
})

const scoreColor = computed(() => {
  if (props.result.score >= 80) return '#f97316' // fire-500
  if (props.result.score >= 60) return '#fb923c' // fire-400
  if (props.result.score >= 40) return '#fdba74' // fire-300
  return '#fed7aa' // fire-200
})

onMounted(() => {
  // Animate score from 0 to final value
  const duration = 1500 // 1.5 seconds
  const steps = 60
  const increment = props.result.score / steps
  const stepDuration = duration / steps

  let currentStep = 0
  const timer = setInterval(() => {
    currentStep++
    animatedScore.value = Math.min(props.result.score, Math.round(increment * currentStep))

    if (currentStep >= steps) {
      clearInterval(timer)
    }
  }, stepDuration)
})

async function shareResult() {
  const text = `My compatibility with Fire Horse: ${props.result.score}%! ${props.result.summary}`

  if (navigator.share) {
    try {
      await navigator.share({ text })
    } catch (err) {
      copyToClipboard(text)
    }
  } else {
    copyToClipboard(text)
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Result copied to clipboard!')
  })
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- Circular Progress Ring -->
    <div class="flex justify-center mb-8">
      <div class="relative">
        <svg width="200" height="200" class="transform -rotate-90">
          <!-- Background circle -->
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="#374151"
            stroke-width="12"
            fill="none"
          />
          <!-- Progress circle with fire gradient -->
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="url(#fireGradient)"
            stroke-width="12"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            class="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="{ stopColor: scoreColor, stopOpacity: 1 }" />
              <stop offset="100%" :style="{ stopColor: '#ea580c', stopOpacity: 1 }" />
            </linearGradient>
          </defs>
        </svg>
        <!-- Score number in center -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="font-display text-5xl font-black fire-text">
              {{ animatedScore }}%
            </div>
            <div class="text-ash-400 text-sm mt-1">Compatible</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <GlassCard class="mb-6">
      <p class="text-ash-200 text-lg leading-relaxed text-center">
        {{ result.summary }}
      </p>
    </GlassCard>

    <!-- Strengths and Challenges -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Strengths -->
      <GlassCard class="bg-green-500/5 border-green-500/20">
        <h3 class="font-display text-xl font-bold text-green-300 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Strengths
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(strength, index) in result.strengths"
            :key="index"
            class="text-ash-200 flex items-start"
          >
            <span class="text-green-400 mr-2">•</span>
            <span>{{ strength }}</span>
          </li>
        </ul>
      </GlassCard>

      <!-- Challenges -->
      <GlassCard class="bg-amber-500/5 border-amber-500/20">
        <h3 class="font-display text-xl font-bold text-amber-300 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Challenges
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(challenge, index) in result.challenges"
            :key="index"
            class="text-ash-200 flex items-start"
          >
            <span class="text-amber-400 mr-2">•</span>
            <span>{{ challenge }}</span>
          </li>
        </ul>
      </GlassCard>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <FireButton variant="primary" @click="shareResult">
        Share Result
      </FireButton>
      <FireButton variant="secondary" @click="emit('reset')">
        Try Another
      </FireButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
