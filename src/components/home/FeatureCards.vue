<script setup lang="ts">
import { useRouter } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'

interface Feature {
  icon: string
  title: string
  description: string
  route: string
}

const router = useRouter()

const features: Feature[] = [
  {
    icon: '📚',
    title: 'Encyclopedia',
    description: 'Discover the history, myths, and cultural significance of the Fire Horse',
    route: '/encyclopedia',
  },
  {
    icon: '⚡',
    title: 'Compatibility',
    description: 'Check your zodiac compatibility with Fire Horse and other signs',
    route: '/compatibility',
  },
  {
    icon: '💬',
    title: 'Community Forum',
    description: 'Join the community — discuss, share experiences, and connect',
    route: '/forum',
  },
  {
    icon: '✍️',
    title: 'Stories & Insights',
    description: 'Read stories, insights, and wisdom about the Fire Horse year',
    route: '/blog',
  },
]

function navigateTo(route: string) {
  router.push(route)
}
</script>

<template>
  <section id="features" class="py-20 px-4 bg-ash-950">
    <div class="container mx-auto max-w-7xl">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
          <span class="fire-text">Explore the Flame</span>
        </h2>
        <p class="text-xl text-ash-400 max-w-2xl mx-auto">
          Dive into the legend, connect with your zodiac, and join a community celebrating this rare celestial event
        </p>
      </div>

      <!-- Feature cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard
          v-for="feature in features"
          :key="feature.route"
          :glow="true"
          padding="p-8"
          class="cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:fire-glow-strong"
          @click="navigateTo(feature.route)"
        >
          <div class="text-center space-y-4">
            <!-- Icon -->
            <div class="text-6xl mb-4">
              {{ feature.icon }}
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-display font-bold text-fire-400">
              {{ feature.title }}
            </h3>

            <!-- Description -->
            <p class="text-ash-400 leading-relaxed">
              {{ feature.description }}
            </p>

            <!-- Arrow indicator -->
            <div class="pt-4 text-fire-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                class="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>
