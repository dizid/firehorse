<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Ember {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
}

const embers = ref<Ember[]>([])
let interval: ReturnType<typeof setInterval>
let nextId = 0

function createEmber(): Ember {
  return {
    id: nextId++,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
    opacity: 0.3 + Math.random() * 0.5,
  }
}

onMounted(() => {
  // Create initial embers
  for (let i = 0; i < 15; i++) {
    embers.value.push(createEmber())
  }

  // Continuously spawn new embers
  interval = setInterval(() => {
    if (embers.value.length < 25) {
      embers.value.push(createEmber())
    }
    // Remove old embers
    if (embers.value.length > 20) {
      embers.value.shift()
    }
  }, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    <div
      v-for="ember in embers"
      :key="ember.id"
      class="ember-particle"
      :style="{
        left: `${ember.x}%`,
        width: `${ember.size}px`,
        height: `${ember.size}px`,
        animationDuration: `${ember.duration}s`,
        animationDelay: `${ember.delay}s`,
        opacity: ember.opacity,
      }"
    />
  </div>
</template>
