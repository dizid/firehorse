<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import type { EncyclopediaArticle } from '@/types'

const props = defineProps<{
  article: EncyclopediaArticle
}>()

const categoryColors = {
  history: 'bg-ember-600/20 text-ember-300 border-ember-500/30',
  traits: 'bg-fire-600/20 text-fire-300 border-fire-500/30',
  culture: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
  famous: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
  myths: 'bg-rose-600/20 text-rose-300 border-rose-500/30',
}

const categoryColor = computed(() => categoryColors[props.article.category])
</script>

<template>
  <RouterLink :to="`/encyclopedia/${article.slug}`">
    <GlassCard
      :glow="false"
      class="h-full transition-all duration-300 hover:scale-[1.02] hover:fire-glow cursor-pointer"
    >
      <div class="flex flex-col h-full">
        <span
          class="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-semibold border mb-3"
          :class="categoryColor"
        >
          {{ article.category }}
        </span>

        <h3 class="font-display text-xl font-bold text-ash-50 mb-2 line-clamp-2">
          {{ article.title }}
        </h3>

        <p class="text-ash-400 text-sm flex-grow line-clamp-3 mb-4">
          {{ article.excerpt }}
        </p>

        <div class="flex items-center text-fire-400 text-sm font-semibold group-hover:text-fire-300">
          Read more
          <svg
            class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </GlassCard>
  </RouterLink>
</template>
