<script setup lang="ts">
import { zodiacAnimals } from '@/lib/zodiac-data'
import type { ZodiacAnimal } from '@/types'

defineProps<{
  modelValue: ZodiacAnimal | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ZodiacAnimal]
}>()

function selectAnimal(animal: ZodiacAnimal) {
  emit('update:modelValue', animal)
}
</script>

<template>
  <div>
    <h2 class="font-display text-2xl font-bold text-ash-50 mb-6 text-center">
      Select Your Zodiac Animal
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      <button
        v-for="zodiac in zodiacAnimals"
        :key="zodiac.animal"
        @click="selectAnimal(zodiac.animal)"
        class="glass rounded-xl p-4 transition-all duration-300 hover:scale-105"
        :class="
          modelValue === zodiac.animal
            ? 'fire-glow border-fire-500 bg-fire-500/10 scale-105'
            : 'hover:border-fire-500/30'
        "
      >
        <div class="text-4xl mb-2">{{ zodiac.emoji }}</div>
        <div
          class="font-semibold text-sm"
          :class="modelValue === zodiac.animal ? 'text-fire-300' : 'text-ash-300'"
        >
          {{ zodiac.name }}
        </div>
      </button>
    </div>
  </div>
</template>
