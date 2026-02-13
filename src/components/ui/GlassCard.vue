<script setup lang="ts">
withDefaults(defineProps<{
  glow?: boolean
  padding?: string
}>(), {
  glow: false,
  padding: 'p-6',
})
</script>

<template>
  <div
    class="glass rounded-2xl transition-all duration-300"
    :class="[
      padding,
      glow ? 'fire-glow hover:fire-glow-strong' : 'hover:border-fire-500/30'
    ]"
  >
    <slot />
  </div>
</template>
