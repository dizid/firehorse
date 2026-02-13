<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import type { ForumCategory } from '@/types'

const categories = ref<ForumCategory[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchCategories() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/forum/categories')

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    categories.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-display font-bold fire-text mb-4">
          Community Forum
        </h1>
        <p class="text-ash-300 text-lg max-w-2xl mx-auto">
          Connect with fellow Fire Horses and zodiac enthusiasts.
          <br />
          <span class="text-sm text-ash-400 mt-2 inline-block">
            Browse freely • Paid membership required to post
          </span>
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-ash-400">Loading categories...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ error }}</p>
      </div>

      <!-- Categories List -->
      <div
        v-else
        class="space-y-4"
      >
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="`/forum/${category.slug}`"
          class="block group"
        >
          <GlassCard :glow="false">
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-fire-500/10 flex items-center justify-center text-3xl">
                {{ category.icon }}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-display font-bold text-ash-100 group-hover:text-fire-400 transition-colors mb-1">
                  {{ category.name }}
                </h3>
                <p class="text-ash-400 text-sm mb-2">
                  {{ category.description }}
                </p>
                <div class="flex items-center gap-4 text-xs text-ash-500">
                  <span>{{ category.threadCount }} {{ category.threadCount === 1 ? 'thread' : 'threads' }}</span>
                  <span>•</span>
                  <span>{{ category.postCount }} {{ category.postCount === 1 ? 'post' : 'posts' }}</span>
                </div>
              </div>

              <!-- Arrow -->
              <div class="flex-shrink-0 text-ash-600 group-hover:text-fire-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </GlassCard>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
