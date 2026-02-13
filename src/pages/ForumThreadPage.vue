<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@clerk/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireButton from '@/components/ui/FireButton.vue'
import PostCard from '@/components/forum/PostCard.vue'
import type { ForumPost, ForumThread } from '@/types'

const route = useRoute()
const router = useRouter()
const { isSignedIn, getToken } = useAuth()

const thread = ref<ForumThread | null>(null)
const posts = ref<ForumPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

const replyContent = ref('')
const submitting = ref(false)
const canPost = ref(false)
const checkingOut = ref(false)

const threadId = computed(() => route.params.id as string)

async function fetchThread() {
  try {
    const response = await fetch(`/api/forum/threads?thread=${threadId.value}`)
    if (!response.ok) throw new Error('Failed to fetch thread')

    const data = await response.json()
    if (data.threads && data.threads.length > 0) {
      thread.value = data.threads[0]
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
}

async function fetchPosts(page: number = 1) {
  loading.value = true
  error.value = null

  try {
    const token = isSignedIn.value ? await getToken.value() : null
    const headers: HeadersInit = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`/api/forum/posts?thread=${threadId.value}&page=${page}`, {
      headers
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const data = await response.json()
    posts.value = data.posts
    currentPage.value = data.page
    totalPages.value = data.totalPages
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

async function checkUserPermissions() {
  if (!isSignedIn.value) {
    canPost.value = false
    return
  }

  try {
    const token = await getToken.value()
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const profile = await response.json()
      canPost.value = profile.isPaidMember
    }
  } catch (err) {
    console.error('Error checking permissions:', err)
  }
}

async function submitReply() {
  if (!isSignedIn.value || !replyContent.value.trim()) {
    return
  }

  submitting.value = true

  try {
    const token = await getToken.value()
    const response = await fetch('/api/forum/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        threadId: threadId.value,
        content: replyContent.value
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to post reply')
    }

    replyContent.value = ''
    await fetchPosts(currentPage.value)
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to post reply')
  } finally {
    submitting.value = false
  }
}

async function handleVote(postId: string, voteType: 'up' | 'down') {
  if (!isSignedIn.value) return

  try {
    const token = await getToken.value()
    const response = await fetch('/api/forum/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ postId, voteType })
    })

    if (response.ok) {
      await fetchPosts(currentPage.value)
    }
  } catch (err) {
    console.error('Error voting:', err)
  }
}

async function upgradeToMember() {
  if (!isSignedIn.value) {
    router.push('/sign-in')
    return
  }

  checkingOut.value = true

  try {
    const token = await getToken.value()
    const response = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to start checkout')
    }

    const { url } = await response.json()
    window.location.href = url
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to start checkout')
    checkingOut.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    fetchPosts(currentPage.value + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    fetchPosts(currentPage.value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await fetchThread()
  await fetchPosts()
  await checkUserPermissions()
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back Link -->
      <RouterLink
        :to="thread ? `/forum/${thread.categoryId}` : '/forum'"
        class="inline-flex items-center gap-2 text-fire-400 hover:text-fire-300 mb-8 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Category
      </RouterLink>

      <!-- Thread Header -->
      <div
        v-if="thread"
        class="mb-8"
      >
        <GlassCard :glow="true">
          <div class="flex items-center gap-2 mb-4">
            <span
              v-if="thread.isPinned"
              class="text-xs px-2 py-1 bg-ember-500/20 text-ember-400 rounded font-semibold"
            >
              📌 PINNED
            </span>
            <span
              v-if="thread.isLocked"
              class="text-xs px-2 py-1 bg-ash-700 text-ash-400 rounded"
            >
              🔒 LOCKED
            </span>
          </div>

          <h1 class="text-3xl md:text-4xl font-display font-bold fire-text mb-4">
            {{ thread.title }}
          </h1>

          <div class="flex items-center gap-4 text-sm text-ash-400">
            <span>Started by {{ thread.authorName }}</span>
            <span>•</span>
            <span>{{ thread.viewCount }} views</span>
            <span>•</span>
            <span>{{ thread.postCount }} {{ thread.postCount === 1 ? 'reply' : 'replies' }}</span>
          </div>
        </GlassCard>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-ash-400">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ error }}</p>
      </div>

      <!-- Posts List -->
      <div v-else>
        <div class="space-y-4 mb-8">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :can-vote="isSignedIn || false"
            @vote="handleVote"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-4 mb-8"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg bg-ash-800 text-ash-300 hover:bg-ash-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <span class="text-ash-300">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg bg-ash-800 text-ash-300 hover:bg-ash-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        <!-- Reply Form -->
        <GlassCard
          v-if="canPost && thread && !thread.isLocked"
          :glow="true"
        >
          <h3 class="text-xl font-display font-bold text-fire-400 mb-4">
            Post a Reply
          </h3>

          <div class="space-y-4">
            <textarea
              v-model="replyContent"
              placeholder="What do you think?"
              rows="6"
              class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors resize-none"
            ></textarea>

            <FireButton
              @click="submitReply"
              :disabled="submitting || !replyContent.trim()"
            >
              {{ submitting ? 'Posting...' : 'Post Reply' }}
            </FireButton>
          </div>
        </GlassCard>

        <!-- Upgrade Prompt -->
        <GlassCard
          v-else-if="!canPost && isSignedIn && thread && !thread.isLocked"
          :glow="false"
        >
          <div class="text-center py-8">
            <p class="text-ash-300 mb-4">
              Upgrade to a paid membership to join the conversation
            </p>
            <FireButton
              @click="upgradeToMember"
              :disabled="checkingOut"
            >
              {{ checkingOut ? 'Redirecting...' : 'Upgrade Now — $9.99' }}
            </FireButton>
          </div>
        </GlassCard>

        <!-- Sign In Prompt -->
        <GlassCard
          v-else-if="!isSignedIn && thread && !thread.isLocked"
          :glow="false"
        >
          <div class="text-center py-8">
            <p class="text-ash-300 mb-4">
              Sign in to join the conversation
            </p>
            <RouterLink to="/sign-in">
              <FireButton>
                Sign In
              </FireButton>
            </RouterLink>
          </div>
        </GlassCard>

        <!-- Locked Thread Message -->
        <GlassCard
          v-else-if="thread && thread.isLocked"
          :glow="false"
        >
          <div class="text-center py-8 text-ash-400">
            🔒 This thread is locked and no longer accepting replies
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
