<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@clerk/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireButton from '@/components/ui/FireButton.vue'
import ThreadList from '@/components/forum/ThreadList.vue'
import type { ForumThread, ForumCategory } from '@/types'

const route = useRoute()
const { isSignedIn, getToken } = useAuth()

const category = ref<ForumCategory | null>(null)
const threads = ref<ForumThread[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

const showNewThreadForm = ref(false)
const newThreadTitle = ref('')
const newThreadContent = ref('')
const submitting = ref(false)

const categorySlug = computed(() => route.params.categorySlug as string)
const canPost = ref(false)

async function fetchCategory() {
  try {
    const response = await fetch('/api/forum/categories')
    if (!response.ok) throw new Error('Failed to fetch categories')

    const categories = await response.json()
    category.value = categories.find((c: ForumCategory) => c.slug === categorySlug.value) || null

    if (!category.value) {
      error.value = 'Category not found'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
}

async function fetchThreads(page: number = 1) {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/forum/threads?category=${categorySlug.value}&page=${page}`)

    if (!response.ok) {
      throw new Error('Failed to fetch threads')
    }

    const data = await response.json()
    threads.value = data.threads
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

async function submitThread() {
  if (!isSignedIn.value || !newThreadTitle.value.trim() || !newThreadContent.value.trim()) {
    return
  }

  submitting.value = true

  try {
    const token = await getToken.value()
    const response = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        categorySlug: categorySlug.value,
        title: newThreadTitle.value,
        content: newThreadContent.value
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to create thread')
    }

    newThreadTitle.value = ''
    newThreadContent.value = ''
    showNewThreadForm.value = false
    await fetchThreads()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to create thread')
  } finally {
    submitting.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    fetchThreads(currentPage.value + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    fetchThreads(currentPage.value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await fetchCategory()
  await fetchThreads()
  await checkUserPermissions()
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Back Link -->
      <RouterLink
        to="/forum"
        class="inline-flex items-center gap-2 text-fire-400 hover:text-fire-300 mb-8 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forum
      </RouterLink>

      <!-- Category Header -->
      <div
        v-if="category"
        class="mb-8"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-lg bg-fire-500/10 flex items-center justify-center text-4xl">
            {{ category.icon }}
          </div>
          <div>
            <h1 class="text-4xl md:text-5xl font-display font-bold fire-text">
              {{ category.name }}
            </h1>
            <p class="text-ash-400 mt-1">
              {{ category.description }}
            </p>
          </div>
        </div>

        <!-- New Thread Button -->
        <div class="flex justify-end mb-6">
          <FireButton
            v-if="canPost && !showNewThreadForm"
            @click="showNewThreadForm = true"
          >
            + New Thread
          </FireButton>
          <div
            v-else-if="!canPost && isSignedIn"
            class="text-sm text-ash-400"
          >
            Upgrade to paid membership to post
          </div>
          <RouterLink
            v-else-if="!isSignedIn"
            to="/sign-in"
            class="text-sm text-fire-400 hover:text-fire-300"
          >
            Sign in to post
          </RouterLink>
        </div>

        <!-- New Thread Form -->
        <GlassCard
          v-if="showNewThreadForm"
          :glow="true"
          class="mb-6"
        >
          <h3 class="text-xl font-display font-bold text-fire-400 mb-4">
            Create New Thread
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ash-300 mb-2">
                Thread Title
              </label>
              <input
                v-model="newThreadTitle"
                type="text"
                placeholder="Enter thread title..."
                class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors"
                maxlength="200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-ash-300 mb-2">
                Content
              </label>
              <textarea
                v-model="newThreadContent"
                placeholder="What's on your mind?"
                rows="6"
                class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3">
              <FireButton
                @click="submitThread"
                :disabled="submitting || !newThreadTitle.trim() || !newThreadContent.trim()"
              >
                {{ submitting ? 'Posting...' : 'Post Thread' }}
              </FireButton>
              <FireButton
                variant="ghost"
                @click="showNewThreadForm = false"
                :disabled="submitting"
              >
                Cancel
              </FireButton>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-ash-400">Loading threads...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ error }}</p>
      </div>

      <!-- Threads List -->
      <div v-else>
        <ThreadList :threads="threads" />

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-4 mt-8"
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
      </div>
    </div>
  </div>
</template>
