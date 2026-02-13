<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { zodiacAnimals, getZodiacFromBirthdate } from '@/lib/zodiac-data'
import type { ZodiacAnimal, ZodiacElement } from '@/types'

defineProps<{
  modelValue: ZodiacAnimal | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ZodiacAnimal]
  'skipToResult': [animal: ZodiacAnimal, element: ZodiacElement]
}>()

function selectAnimal(animal: ZodiacAnimal) {
  emit('update:modelValue', animal)
}

// Birthdate input state
const showBirthdate = ref(false)
const birthYear = ref<number | null>(null)
const birthMonth = ref<number | null>(null)
const birthDay = ref<number | null>(null)

// Generate year options (1924-2026)
const yearOptions = Array.from({ length: 2026 - 1924 + 1 }, (_, i) => 2026 - i)

// Generate month options
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

// Generate day options based on selected month/year
const dayOptions = computed(() => {
  if (!birthMonth.value) return Array.from({ length: 31 }, (_, i) => i + 1)
  const y = birthYear.value || 2000
  const daysInMonth = new Date(y, birthMonth.value, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

// Compute zodiac result when all fields filled
const birthdateResult = computed(() => {
  if (!birthYear.value || !birthMonth.value || !birthDay.value) return null
  return getZodiacFromBirthdate(birthYear.value, birthMonth.value, birthDay.value)
})

// Get display info for the computed animal
const resultAnimalInfo = computed(() => {
  if (!birthdateResult.value) return null
  return zodiacAnimals.find(z => z.animal === birthdateResult.value!.animal) || null
})

// Element display names and colors
const elementDisplay: Record<string, { name: string; color: string }> = {
  wood: { name: 'Wood', color: '#22c55e' },
  fire: { name: 'Fire', color: '#f97316' },
  earth: { name: 'Earth', color: '#a16207' },
  metal: { name: 'Metal', color: '#94a3b8' },
  water: { name: 'Water', color: '#3b82f6' },
}

// Reset day if it exceeds new month's max
watch([birthYear, birthMonth], () => {
  if (birthDay.value && birthDay.value > dayOptions.value.length) {
    birthDay.value = null
  }
})

// Result animation trigger
const showResult = ref(false)
watch(birthdateResult, (val) => {
  if (val) {
    showResult.value = false
    requestAnimationFrame(() => {
      showResult.value = true
    })
  } else {
    showResult.value = false
  }
})

function goWithBirthdate() {
  if (!birthdateResult.value) return
  emit('skipToResult', birthdateResult.value.animal, birthdateResult.value.element)
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

    <!-- Birthdate alternative -->
    <div class="mt-8 text-center">
      <button
        @click="showBirthdate = !showBirthdate"
        class="text-ash-500 hover:text-fire-400 transition-colors text-sm inline-flex items-center gap-1.5 group"
      >
        <span class="border-b border-dashed border-ash-600 group-hover:border-fire-400/50 pb-0.5">
          Don't know your sign?
        </span>
        <svg
          class="w-3.5 h-3.5 transition-transform duration-300"
          :class="showBirthdate ? 'rotate-180' : ''"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Expandable birthdate section -->
      <Transition name="slide">
        <div v-if="showBirthdate" class="mt-5">
          <div class="glass rounded-xl p-5 max-w-md mx-auto border-t-2 border-fire-500/30">
            <p class="text-ash-400 text-sm mb-4">
              Enter your birth date and we'll find your zodiac sign
            </p>

            <!-- Date selectors -->
            <div class="flex gap-2 justify-center">
              <!-- Year -->
              <div class="flex-1 max-w-[110px]">
                <select
                  v-model.number="birthYear"
                  class="w-full glass rounded-lg px-3 py-2.5 text-sm text-ash-100 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-fire-500/50 focus:border-fire-500/50"
                >
                  <option :value="null" disabled class="bg-ash-900 text-ash-500">Year</option>
                  <option
                    v-for="y in yearOptions"
                    :key="y"
                    :value="y"
                    class="bg-ash-900 text-ash-100"
                  >{{ y }}</option>
                </select>
              </div>

              <!-- Month -->
              <div class="flex-1 max-w-[90px]">
                <select
                  v-model.number="birthMonth"
                  class="w-full glass rounded-lg px-3 py-2.5 text-sm text-ash-100 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-fire-500/50 focus:border-fire-500/50"
                >
                  <option :value="null" disabled class="bg-ash-900 text-ash-500">Month</option>
                  <option
                    v-for="(m, i) in months"
                    :key="i"
                    :value="i + 1"
                    class="bg-ash-900 text-ash-100"
                  >{{ m }}</option>
                </select>
              </div>

              <!-- Day -->
              <div class="flex-1 max-w-[80px]">
                <select
                  v-model.number="birthDay"
                  class="w-full glass rounded-lg px-3 py-2.5 text-sm text-ash-100 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-fire-500/50 focus:border-fire-500/50"
                >
                  <option :value="null" disabled class="bg-ash-900 text-ash-500">Day</option>
                  <option
                    v-for="d in dayOptions"
                    :key="d"
                    :value="d"
                    class="bg-ash-900 text-ash-100"
                  >{{ d }}</option>
                </select>
              </div>
            </div>

            <!-- Result chip -->
            <Transition name="result-pop">
              <div v-if="birthdateResult && resultAnimalInfo && showResult" class="mt-4">
                <div class="glass rounded-xl p-4 border border-fire-500/20">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <span class="text-3xl">{{ resultAnimalInfo.emoji }}</span>
                    <div class="text-left">
                      <div class="text-ash-100 font-semibold text-sm">
                        You're a
                        <span :style="{ color: elementDisplay[birthdateResult.element]?.color }">
                          {{ elementDisplay[birthdateResult.element]?.name }}
                        </span>
                        {{ resultAnimalInfo.name }}!
                      </div>
                      <div class="text-ash-500 text-xs">
                        Lunar year {{ birthdateResult.lunarYear }}
                      </div>
                    </div>
                  </div>
                  <button
                    @click="goWithBirthdate"
                    class="w-full btn-fire text-sm py-2.5 rounded-lg cursor-pointer"
                  >
                    Find My Compatibility
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Expand/collapse animation */
.slide-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 400px;
}

/* Result chip pop-in */
.result-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.result-pop-leave-active {
  transition: all 0.2s ease;
}
.result-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
}
.result-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom dropdown arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2rem;
}
</style>
