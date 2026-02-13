<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}>(), {
  tag: 'h1',
})
</script>

<template>
  <component
    :is="tag"
    class="fire-text font-display font-bold"
  >
    <slot />
  </component>
</template>
