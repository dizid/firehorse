<script setup lang="ts">
import { ref } from 'vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import { useSeo } from '@/composables/useSeo'
import type { BlogPost } from '@/types'

useSeo({
  title: 'Fire Horse Blog',
  description: 'Articles, insights, and stories about the Fire Horse zodiac sign, Chinese astrology, and the 2026 Year of the Fire Horse.',
  path: '/blog',
})

const PAGE_SIZE = 12

// Same split as BlogPostPage.vue: vite-ssg's prerender pass has no running
// Netlify Function to call `/api/blog/posts`, so the first page of posts is
// fetched directly from Neon on the server; the browser keeps using the API
// route (needed anyway for pagination past page 1).
// Same merge as the blog API: all published database posts (a handful of rows)
// plus the code posts in src/content/blog-posts.mjs, newest first, then one page.
async function fetchPostsFromDb(page: number) {
  const { getDb } = await import('@/lib/db')
  const { codeBlogPostSummaries, mergeBlogPosts } = await import('@/content/blog-posts.mjs')
  const sql = getDb()

  const rows = await sql`
    SELECT id, slug, title, excerpt, cover_image, author_name, tags, read_time, published_at
    FROM blog_posts
    WHERE is_published = true
  `
  const databasePosts = rows.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.cover_image,
    authorName: post.author_name,
    tags: post.tags,
    readTime: post.read_time,
    publishedAt: post.published_at,
  })) as BlogPost[]
  const allPosts = mergeBlogPosts(databasePosts, codeBlogPostSummaries()) as BlogPost[]

  return {
    posts: allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    page,
    totalPages: Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE)),
  }
}

async function fetchPostsFromApi(page: number) {
  const response = await fetch(`/api/blog/posts?page=${page}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }
  return response.json()
}

const posts = ref<BlogPost[]>([])
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const paginating = ref(false)

// Initial page loads synchronously (awaited during setup) so vite-ssg bakes
// real posts into the prerendered HTML instead of an empty grid.
try {
  const data = import.meta.env.SSR ? await fetchPostsFromDb(1) : await fetchPostsFromApi(1)
  posts.value = data.posts
  currentPage.value = data.page
  totalPages.value = data.totalPages
} catch (err) {
  error.value = err instanceof Error ? err.message : 'An error occurred'
}

async function goToPage(page: number) {
  paginating.value = true
  error.value = null

  try {
    const data = await fetchPostsFromApi(page)
    posts.value = data.posts
    currentPage.value = data.page
    totalPages.value = data.totalPages
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    paginating.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-display font-bold fire-text mb-4">
          Blog
        </h1>
        <p class="text-ash-300 text-lg max-w-2xl mx-auto">
          Insights, stories, and wisdom from the Year of the Fire Horse
        </p>
      </div>

      <!-- Loading State (pagination) -->
      <div
        v-if="paginating"
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

      <!-- Blog Grid -->
      <div v-else>
        <div
          v-if="posts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <BlogCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>

        <div
          v-else
          class="text-center py-20 text-ash-400"
        >
          No blog posts yet. Check back soon!
        </div>

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
