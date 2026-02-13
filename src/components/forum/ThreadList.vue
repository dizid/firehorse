<script setup lang="ts">
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import type { ForumThread } from '@/types'

defineProps<{
  threads: ForumThread[]
}>()

function formatDate(date: string) {
  const now = new Date()
  const posted = new Date(date)
  const diffMs = now.getTime() - posted.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-3">
    <RouterLink
      v-for="thread in threads"
      :key="thread.id"
      :to="`/forum/thread/${thread.id}`"
      class="block group"
    >
      <GlassCard :glow="false" padding="p-4">
        <div class="flex items-start gap-4">
          <div
            v-if="thread.authorAvatar"
            class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-ash-800"
          >
            <img
              :src="thread.authorAvatar"
              :alt="thread.authorName"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex-shrink-0 w-10 h-10 rounded-full bg-fire-500/20 flex items-center justify-center text-fire-400 font-bold"
          >
            {{ thread.authorName[0]?.toUpperCase() || '?' }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span
                v-if="thread.isPinned"
                class="text-xs px-2 py-0.5 bg-ember-500/20 text-ember-400 rounded font-semibold"
              >
                PINNED
              </span>
              <span
                v-if="thread.isLocked"
                class="text-xs px-2 py-0.5 bg-ash-700 text-ash-400 rounded"
              >
                🔒 LOCKED
              </span>
            </div>

            <h3 class="text-base font-semibold text-ash-100 group-hover:text-fire-400 transition-colors mb-1">
              {{ thread.title }}
            </h3>

            <div class="flex items-center gap-3 text-xs text-ash-400">
              <span>by {{ thread.authorName }}</span>
              <span>•</span>
              <span>{{ formatDate(thread.createdAt) }}</span>
            </div>
          </div>

          <div class="flex-shrink-0 text-right">
            <div class="text-sm font-semibold text-fire-400">
              {{ thread.postCount }}
            </div>
            <div class="text-xs text-ash-400">
              {{ thread.postCount === 1 ? 'reply' : 'replies' }}
            </div>
            <div class="text-xs text-ash-500 mt-1">
              {{ thread.viewCount }} views
            </div>
          </div>
        </div>

        <div
          v-if="thread.lastPostAuthor"
          class="mt-3 pt-3 border-t border-ash-800 text-xs text-ash-400"
        >
          Last post by <span class="text-ash-300">{{ thread.lastPostAuthor }}</span>
          <span class="mx-1">•</span>
          {{ formatDate(thread.lastPostAt) }}
        </div>
      </GlassCard>
    </RouterLink>

    <div
      v-if="threads.length === 0"
      class="text-center py-12 text-ash-400"
    >
      No threads yet. Be the first to start a discussion!
    </div>
  </div>
</template>
