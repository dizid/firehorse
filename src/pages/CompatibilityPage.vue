<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import ZodiacSelector from '@/components/compatibility/ZodiacSelector.vue'
import ElementSelector from '@/components/compatibility/ElementSelector.vue'
import CompatibilityResult from '@/components/compatibility/CompatibilityResult.vue'
import { calculateCompatibility } from '@/lib/zodiac-data'
import { useAnalytics } from '@/composables/useAnalytics'
import { useSeo } from '@/composables/useSeo'
import type { ZodiacAnimal, ZodiacElement, CompatibilityResult as CompatibilityResultType } from '@/types'

const { trackCompatibilityComplete } = useAnalytics()

useSeo({
  title: 'Chinese Zodiac Compatibility Checker',
  description: 'Check your zodiac compatibility with the Fire Horse. Select your animal sign and element to discover your compatibility score and relationship insights.',
  path: '/compatibility',
})

const selectedAnimal = ref<ZodiacAnimal | null>(null)
const selectedElement = ref<ZodiacElement | null>(null)

const currentStep = computed(() => {
  if (!selectedAnimal.value) return 1
  if (!selectedElement.value) return 2
  return 3
})

const compatibilityResult = computed<CompatibilityResultType | null>(() => {
  if (!selectedAnimal.value || !selectedElement.value) return null
  return calculateCompatibility(selectedAnimal.value, selectedElement.value)
})

// Track when compatibility result is shown
watch(compatibilityResult, (result) => {
  if (result && selectedAnimal.value && selectedElement.value) {
    trackCompatibilityComplete(selectedAnimal.value, selectedElement.value, result.score)
  }
})

function reset() {
  selectedAnimal.value = null
  selectedElement.value = null
}

// Handle birthdate skip — sets both animal and element at once
function handleSkipToResult(animal: ZodiacAnimal, element: ZodiacElement) {
  selectedAnimal.value = animal
  selectedElement.value = element
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-black fire-text mb-4">
        Are You Compatible?
      </h1>
      <p class="text-ash-400 text-lg md:text-xl max-w-2xl mx-auto">
        Discover your compatibility with the Fire Horse. Select your zodiac animal and element to reveal your cosmic connection.
      </p>
    </div>

    <!-- Progress Steps -->
    <div class="flex items-center justify-center mb-12">
      <div class="flex items-center gap-4">
        <!-- Step 1 -->
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all duration-300"
            :class="
              currentStep >= 1
                ? 'bg-fire-500 border-fire-500 text-white'
                : 'border-ash-600 text-ash-600'
            "
          >
            1
          </div>
          <span
            class="ml-2 font-semibold hidden sm:inline"
            :class="currentStep >= 1 ? 'text-fire-400' : 'text-ash-600'"
          >
            Animal
          </span>
        </div>

        <!-- Connector -->
        <div
          class="w-12 h-1 rounded transition-all duration-300"
          :class="currentStep >= 2 ? 'bg-fire-500' : 'bg-ash-700'"
        ></div>

        <!-- Step 2 -->
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all duration-300"
            :class="
              currentStep >= 2
                ? 'bg-fire-500 border-fire-500 text-white'
                : 'border-ash-600 text-ash-600'
            "
          >
            2
          </div>
          <span
            class="ml-2 font-semibold hidden sm:inline"
            :class="currentStep >= 2 ? 'text-fire-400' : 'text-ash-600'"
          >
            Element
          </span>
        </div>

        <!-- Connector -->
        <div
          class="w-12 h-1 rounded transition-all duration-300"
          :class="currentStep >= 3 ? 'bg-fire-500' : 'bg-ash-700'"
        ></div>

        <!-- Step 3 -->
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all duration-300"
            :class="
              currentStep >= 3
                ? 'bg-fire-500 border-fire-500 text-white'
                : 'border-ash-600 text-ash-600'
            "
          >
            3
          </div>
          <span
            class="ml-2 font-semibold hidden sm:inline"
            :class="currentStep >= 3 ? 'text-fire-400' : 'text-ash-600'"
          >
            Result
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <GlassCard :glow="false" class="max-w-4xl mx-auto">
      <!-- Step 1: Animal Selection -->
      <div v-if="currentStep === 1">
        <ZodiacSelector v-model="selectedAnimal" @skipToResult="handleSkipToResult" />
      </div>

      <!-- Step 2: Element Selection -->
      <div v-if="currentStep === 2">
        <ElementSelector v-model="selectedElement" />

        <!-- Back button -->
        <div class="text-center mt-8">
          <button
            @click="selectedAnimal = null"
            class="text-ash-400 hover:text-fire-400 transition-colors text-sm"
          >
            ← Back to Animal Selection
          </button>
        </div>
      </div>

      <!-- Step 3: Results -->
      <div v-if="currentStep === 3 && compatibilityResult">
        <h2 class="font-display text-3xl font-bold text-center fire-text mb-8">
          Your Compatibility with Fire Horse
        </h2>
        <CompatibilityResult :result="compatibilityResult" @reset="reset" />
      </div>
    </GlassCard>

    <!-- Info Section -->
    <div class="mt-12 text-center">
      <p class="text-ash-500 text-sm max-w-2xl mx-auto">
        Compatibility scores are based on traditional Chinese zodiac astrology, combining the characteristics of your animal sign with your elemental influence. Remember, astrology offers insights, but real relationships are built on understanding, communication, and mutual respect.
      </p>
    </div>
  </div>
</template>
