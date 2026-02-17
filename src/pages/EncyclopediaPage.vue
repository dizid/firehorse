<script setup lang="ts">
import { ref, computed } from 'vue'
import ArticleCard from '@/components/encyclopedia/ArticleCard.vue'
import { getArticlesByCategory } from '@/lib/encyclopedia-data'
import { useSeo } from '@/composables/useSeo'
import type { EncyclopediaArticle } from '@/types'

useSeo({
  title: 'Fire Horse Encyclopedia — Deep-Dive Articles',
  description: 'Everything you need to know about the Fire Horse: history, personality traits, cultural significance, famous people, myths, and the 2026 generation.',
  path: '/encyclopedia',
})

type CategoryFilter = 'all' | EncyclopediaArticle['category']

const selectedCategory = ref<CategoryFilter>('all')

const categories = [
  { value: 'all' as const, label: 'All Articles' },
  { value: 'history' as const, label: 'History' },
  { value: 'traits' as const, label: 'Traits' },
  { value: 'culture' as const, label: 'Culture' },
  { value: 'famous' as const, label: 'Famous' },
  { value: 'myths' as const, label: 'Myths' },
]

const filteredArticles = computed(() => {
  return getArticlesByCategory(selectedCategory.value)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-black fire-text mb-4">
        The Fire Horse Encyclopedia
      </h1>
      <p class="text-ash-400 text-lg md:text-xl max-w-3xl mx-auto">
        Everything you need to know about the most powerful sign in Asian astrology
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap gap-2 md:gap-3 justify-center mb-12">
      <button
        v-for="category in categories"
        :key="category.value"
        @click="selectedCategory = category.value"
        class="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
        :class="
          selectedCategory === category.value
            ? 'bg-fire-500 text-white fire-glow'
            : 'glass text-ash-300 hover:text-fire-400 hover:border-fire-500/30'
        "
      >
        {{ category.label }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredArticles.length === 0"
      class="text-center py-16"
    >
      <p class="text-ash-400 text-lg">No articles found in this category.</p>
    </div>
  </div>
</template>
