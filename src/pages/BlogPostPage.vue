<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import type { BlogPost } from '@/types'

const { trackBlogRead } = useAnalytics()
const route = useRoute()
const post = ref<BlogPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchPost() {
  loading.value = true
  error.value = null

  try {
    const slug = route.params.slug as string
    const response = await fetch(`/api/blog/posts?slug=${slug}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found')
      }
      throw new Error('Failed to fetch post')
    }

    post.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

// Track blog post view when loaded
watch(post, (newPost) => {
  if (newPost) {
    trackBlogRead(newPost.slug, newPost.title)
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back Link -->
      <RouterLink
        to="/blog"
        class="inline-flex items-center gap-2 text-fire-400 hover:text-fire-300 mb-8 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </RouterLink>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-ash-400">Loading post...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ error }}</p>
      </div>

      <!-- Post Content -->
      <article v-else-if="post">
        <GlassCard :glow="true">
          <!-- Cover Image -->
          <div
            v-if="post.coverImage"
            class="w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden"
          >
            <img
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Post Header -->
          <header class="mb-8">
            <h1 class="text-4xl md:text-5xl font-display font-bold fire-text mb-4">
              {{ post.title }}
            </h1>

            <div class="flex items-center gap-4 text-sm text-ash-400 mb-4">
              <span>By {{ post.authorName }}</span>
              <span>•</span>
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>•</span>
              <span>{{ post.readTime }} min read</span>
            </div>

            <div class="flex gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-3 py-1 bg-fire-500/10 text-fire-400 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </header>

          <!-- Post Content -->
          <div
            class="prose prose-invert prose-fire max-w-none"
            v-html="post.content"
          ></div>
        </GlassCard>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* Custom prose styling for blog content */
:deep(.prose-fire) {
  color: var(--color-ash-200);
}

:deep(.prose-fire h1),
:deep(.prose-fire h2),
:deep(.prose-fire h3),
:deep(.prose-fire h4) {
  font-family: var(--font-display);
  color: var(--color-fire-400);
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(.prose-fire h2) {
  font-size: 2rem;
}

:deep(.prose-fire h3) {
  font-size: 1.5rem;
}

:deep(.prose-fire p) {
  margin-bottom: 1.25rem;
  line-height: 1.8;
}

:deep(.prose-fire a) {
  color: var(--color-fire-400);
  text-decoration: underline;
}

:deep(.prose-fire a:hover) {
  color: var(--color-fire-300);
}

:deep(.prose-fire ul),
:deep(.prose-fire ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
}

:deep(.prose-fire li) {
  margin-bottom: 0.5rem;
}

:deep(.prose-fire blockquote) {
  border-left: 4px solid var(--color-fire-500);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--color-ash-300);
}

:deep(.prose-fire code) {
  background: var(--color-ash-900);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-fire-400);
}

:deep(.prose-fire pre) {
  background: var(--color-ash-900);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

:deep(.prose-fire img) {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
</style>
