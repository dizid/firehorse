<script setup lang="ts">
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import type { BlogPost } from '@/types'

defineProps<{
  post: BlogPost
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <RouterLink
    :to="`/blog/${post.slug}`"
    class="block group"
  >
    <GlassCard :glow="false">
      <div
        v-if="post.coverImage"
        class="w-full h-48 mb-4 rounded-lg overflow-hidden"
      >
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 class="text-xl font-display font-bold text-fire-400 mb-2 group-hover:text-fire-300 transition-colors">
        {{ post.title }}
      </h3>

      <p class="text-ash-300 text-sm mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <div class="flex items-center justify-between text-xs text-ash-400">
        <span>{{ post.authorName }}</span>
        <span>{{ formatDate(post.publishedAt) }}</span>
      </div>

      <div class="flex items-center gap-3 mt-3 text-xs text-ash-400">
        <span>{{ post.readTime }} min read</span>
        <div class="flex gap-2">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 bg-fire-500/10 text-fire-400 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </GlassCard>
  </RouterLink>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
