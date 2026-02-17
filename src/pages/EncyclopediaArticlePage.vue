<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import { getArticleBySlug, getRelatedArticles } from '@/lib/encyclopedia-data'
import { renderMarkdown } from '@/lib/markdown'
import { useAnalytics } from '@/composables/useAnalytics'
import { useSeo } from '@/composables/useSeo'

const { trackEncyclopediaView } = useAnalytics()

const route = useRoute()

const article = computed(() => {
  const slug = route.params.slug as string
  return getArticleBySlug(slug)
})

const renderedContent = computed(() => {
  if (!article.value) return ''
  return renderMarkdown(article.value.content)
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  return getRelatedArticles(article.value.slug, 3)
})

const categoryColors = {
  history: 'text-ember-300',
  traits: 'text-fire-300',
  culture: 'text-purple-300',
  famous: 'text-yellow-300',
  myths: 'text-rose-300',
}

// Track article view + set SEO on mount
onMounted(() => {
  if (article.value) {
    trackEncyclopediaView(article.value.slug, article.value.category)
    useSeo({
      title: article.value.title,
      description: article.value.excerpt,
      path: `/encyclopedia/${article.value.slug}`,
      type: 'article',
      article: {
        author: 'FireHorse',
        tags: [article.value.category, 'fire horse', 'chinese zodiac'],
      },
    })
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
    <!-- Back Button -->
    <RouterLink
      to="/encyclopedia"
      class="inline-flex items-center text-ash-400 hover:text-fire-400 transition-colors mb-8"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Encyclopedia
    </RouterLink>

    <!-- Article Not Found -->
    <div v-if="!article" class="text-center py-16">
      <h1 class="font-display text-4xl font-bold text-ash-50 mb-4">Article Not Found</h1>
      <p class="text-ash-400 mb-8">The article you're looking for doesn't exist.</p>
      <RouterLink to="/encyclopedia">
        <button class="btn-fire px-6 py-3 rounded-xl font-semibold">
          View All Articles
        </button>
      </RouterLink>
    </div>

    <!-- Article Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <GlassCard class="mb-8">
          <!-- Category Badge -->
          <div class="mb-4">
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
              :class="categoryColors[article.category]"
            >
              {{ article.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-black fire-text mb-6">
            {{ article.title }}
          </h1>

          <!-- Excerpt -->
          <p class="text-ash-300 text-lg md:text-xl mb-8 leading-relaxed">
            {{ article.excerpt }}
          </p>

          <!-- Divider -->
          <div class="h-px bg-gradient-to-r from-transparent via-fire-500/50 to-transparent mb-8"></div>

          <!-- Article Content -->
          <div
            class="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:fire-text
              prose-h1:text-4xl prose-h1:font-black prose-h1:mb-6
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-ash-200 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-fire-300 prose-strong:font-semibold
              prose-ul:text-ash-200 prose-ul:my-6
              prose-li:my-2
              prose-a:text-fire-400 prose-a:no-underline hover:prose-a:text-fire-300"
            v-html="renderedContent"
          />
        </GlassCard>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-8">
          <!-- Related Articles -->
          <GlassCard v-if="relatedArticles.length > 0">
            <h2 class="font-display text-xl font-bold text-ash-50 mb-4">
              Related Articles
            </h2>
            <div class="space-y-4">
              <RouterLink
                v-for="related in relatedArticles"
                :key="related.id"
                :to="`/encyclopedia/${related.slug}`"
                class="block p-4 rounded-lg bg-ash-900/50 border border-ash-700/50 hover:border-fire-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide mb-2 block"
                  :class="categoryColors[related.category]"
                >
                  {{ related.category }}
                </span>
                <h3 class="font-display text-sm font-semibold text-ash-50 mb-1 line-clamp-2">
                  {{ related.title }}
                </h3>
                <p class="text-xs text-ash-400 line-clamp-2">
                  {{ related.excerpt }}
                </p>
              </RouterLink>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>
