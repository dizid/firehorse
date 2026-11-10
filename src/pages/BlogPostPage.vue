<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useSeo, useBreadcrumbSchema } from '@/composables/useSeo'
import type { BlogPost } from '@/types'

// Blog posts live in Neon, not static data, so they need an explicit
// server-side fetch path: vite-ssg's prerender pass has no browser and no
// running Netlify Function to call, so `/api/blog/posts` can't resolve
// during the build. On the server we query the DB directly (same pattern
// as vite.config.ts's includedRoutes and scripts/generate-sitemap.mjs); in
// the browser we keep using the API route as before.
async function fetchPostFromDb(slug: string): Promise<BlogPost | null> {
  const { getDb } = await import('@/lib/db')
  const sql = getDb()
  const [post] = await sql`
    SELECT id, slug, title, excerpt, content, cover_image, author_name, tags, read_time, published_at
    FROM blog_posts
    WHERE slug = ${slug} AND is_published = true
  `
  if (!post) return null
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    authorName: post.author_name,
    tags: post.tags,
    readTime: post.read_time,
    publishedAt: post.published_at,
  }
}

async function fetchPostFromApi(slug: string): Promise<BlogPost | null> {
  const response = await fetch(`/api/blog/posts?slug=${slug}`)
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch post')
  }
  return response.json()
}

const { trackBlogRead } = useAnalytics()
const route = useRoute()
const slug = route.params.slug as string

let post: BlogPost | null = null
let fetchError: string | null = null

try {
  post = import.meta.env.SSR ? await fetchPostFromDb(slug) : await fetchPostFromApi(slug)
} catch (err) {
  fetchError = err instanceof Error ? err.message : 'An error occurred'
}

// SEO + tracking run once, synchronously after the data resolves — this
// executes during vite-ssg's prerender pass too, so per-post title,
// description, canonical, and Article JSON-LD get baked into the static
// HTML instead of only appearing after client-side hydration.
if (post) {
  trackBlogRead(post.slug, post.title)
  useSeo({
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on the Fire Horse blog.`,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.coverImage,
    article: {
      author: post.authorName,
      publishedAt: post.publishedAt,
      tags: post.tags,
    },
  })
  useBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ])
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumbs -->
      <Breadcrumbs
        v-if="post"
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Blog', to: '/blog' },
          { label: post.title },
        ]"
      />

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

      <!-- Error State -->
      <div
        v-if="fetchError"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ fetchError }}</p>
      </div>

      <!-- Not Found -->
      <div
        v-else-if="!post"
        class="text-center py-20"
      >
        <h1 class="font-display text-4xl font-bold text-ash-50 mb-4">Post Not Found</h1>
        <p class="text-ash-400 mb-8">The post you're looking for doesn't exist.</p>
        <RouterLink to="/blog">
          <span class="btn-fire px-6 py-3 rounded-xl font-semibold inline-block align-top text-center">
            View All Posts
          </span>
        </RouterLink>
      </div>

      <!-- Post Content -->
      <article v-else>
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
