<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import type { ForumPost } from '@/types'

const props = defineProps<{
  post: ForumPost
  canVote: boolean
}>()

const emit = defineEmits<{
  vote: [postId: string, voteType: 'up' | 'down']
}>()

const localVote = ref(props.post.userVote)

function handleVote(voteType: 'up' | 'down') {
  if (!props.canVote) return
  emit('vote', props.post.id, voteType)
  localVote.value = localVote.value === voteType ? null : voteType
}

function formatDate(date: string) {
  const posted = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - posted.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return posted.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: posted.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
</script>

<template>
  <GlassCard :glow="false" padding="p-5">
    <div class="flex gap-4">
      <!-- Author Avatar -->
      <div class="flex-shrink-0">
        <div
          v-if="post.authorAvatar"
          class="w-12 h-12 rounded-full overflow-hidden bg-ash-800"
        >
          <img
            :src="post.authorAvatar"
            :alt="post.authorName"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-full bg-fire-500/20 flex items-center justify-center text-fire-400 font-bold text-lg"
        >
          {{ post.authorName[0]?.toUpperCase() || '?' }}
        </div>
      </div>

      <!-- Post Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="font-semibold text-ash-100">{{ post.authorName }}</span>
          <span class="text-xs text-ash-500">{{ formatDate(post.createdAt) }}</span>
          <span
            v-if="post.updatedAt && post.updatedAt !== post.createdAt"
            class="text-xs text-ash-500"
          >
            (edited)
          </span>
        </div>

        <div class="text-ash-200 leading-relaxed whitespace-pre-wrap mb-3">
          {{ post.content }}
        </div>

        <!-- Vote Buttons -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <button
              @click="handleVote('up')"
              :disabled="!canVote"
              class="group flex items-center gap-1 px-2 py-1 rounded transition-colors"
              :class="[
                localVote === 'up'
                  ? 'bg-fire-500/20 text-fire-400'
                  : 'text-ash-400 hover:bg-fire-500/10 hover:text-fire-400',
                !canVote && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span class="text-sm font-medium">{{ post.upvotes }}</span>
            </button>

            <button
              @click="handleVote('down')"
              :disabled="!canVote"
              class="group flex items-center gap-1 px-2 py-1 rounded transition-colors"
              :class="[
                localVote === 'down'
                  ? 'bg-fire-500/20 text-fire-400'
                  : 'text-ash-400 hover:bg-fire-500/10 hover:text-fire-400',
                !canVote && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <svg class="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span class="text-sm font-medium">{{ post.downvotes }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
</template>
