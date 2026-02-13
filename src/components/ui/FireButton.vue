<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    :disabled="disabled"
    class="relative overflow-hidden font-semibold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      // Variant styles
      variant === 'primary' && 'btn-fire',
      variant === 'secondary' && 'bg-ash-800 text-fire-400 border border-fire-500/30 hover:bg-fire-500/10 hover:border-fire-500/50',
      variant === 'ghost' && 'bg-transparent text-fire-400 hover:bg-fire-500/10',
      // Size styles
      size === 'sm' && 'text-sm px-3 py-1.5',
      size === 'md' && 'text-sm px-5 py-2.5',
      size === 'lg' && 'text-base px-7 py-3',
    ]"
  >
    <slot />
  </button>
</template>
