<script setup lang="ts">
import { zodiacElements } from '@/lib/zodiac-data'
import type { ZodiacElement } from '@/types'

defineProps<{
  modelValue: ZodiacElement | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ZodiacElement]
}>()

function selectElement(element: ZodiacElement) {
  emit('update:modelValue', element)
}
</script>

<template>
  <div>
    <h2 class="font-display text-2xl font-bold text-ash-50 mb-6 text-center">
      Select Your Element
    </h2>
    <div class="flex flex-wrap justify-center gap-3 md:gap-4">
      <button
        v-for="elem in zodiacElements"
        :key="elem.element"
        @click="selectElement(elem.element)"
        class="glass rounded-xl px-6 py-4 transition-all duration-300 hover:scale-105 min-w-[120px]"
        :class="
          modelValue === elem.element
            ? 'border-2 scale-105'
            : 'hover:border-opacity-50'
        "
        :style="{
          borderColor: modelValue === elem.element ? elem.color : 'transparent',
          boxShadow: modelValue === elem.element ? `0 0 20px ${elem.color}40` : 'none'
        }"
      >
        <div
          class="font-display text-lg font-bold mb-1"
          :style="{ color: modelValue === elem.element ? elem.color : '#9ca3af' }"
        >
          {{ elem.name }}
        </div>
        <div
          class="text-xs uppercase tracking-wide"
          :style="{ color: modelValue === elem.element ? elem.color : '#6b7280' }"
        >
          {{ elem.element }}
        </div>
      </button>
    </div>
  </div>
</template>
