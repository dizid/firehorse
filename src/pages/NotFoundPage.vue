<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import FireButton from '@/components/ui/FireButton.vue'

// Unknown URLs get this page with status 200 (SPA fallback): its own title and
// noindex keep Google from indexing it as a copy of the home page (soft 404).
useHead({
  title: 'Page not found | FireHorse',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-8xl mb-4">🔥</p>
      <h1 class="font-display text-5xl font-black fire-text mb-4">404</h1>
      <p class="text-ash-400 text-lg mb-8">This trail has gone cold. The Fire Horse has moved on.</p>
      <RouterLink to="/">
        <FireButton>Back to the Herd</FireButton>
      </RouterLink>
    </div>
  </div>
</template>
