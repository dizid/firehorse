<script setup lang="ts">
import FireHero from '@/components/home/FireHero.vue'
import CountdownTimer from '@/components/home/CountdownTimer.vue'
import FeatureCards from '@/components/home/FeatureCards.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireText from '@/components/ui/FireText.vue'

interface Trait {
  icon: string
  title: string
  description: string
}

const traits: Trait[] = [
  {
    icon: '🔥',
    title: 'Independent',
    description: 'Fiercely self-reliant with an unbreakable spirit that refuses to be tamed',
  },
  {
    icon: '✨',
    title: 'Charismatic',
    description: 'Magnetic personality that draws others in with natural charm and confidence',
  },
  {
    icon: '⚡',
    title: 'Rebellious',
    description: 'Challenges convention and authority, forging their own path through life',
  },
  {
    icon: '🎯',
    title: 'Ambitious',
    description: 'Unstoppable drive to achieve goals and leave a lasting mark on the world',
  },
]

const fireHorseYears = [
  { year: 1846, highlight: false },
  { year: 1906, highlight: false },
  { year: 1966, highlight: false },
  { year: 2026, highlight: true },
  { year: 2086, highlight: false },
]
</script>

<template>
  <div class="min-h-screen bg-ash-950">
    <!-- Hero Section -->
    <FireHero />

    <!-- Countdown Section -->
    <CountdownTimer />

    <!-- Feature Cards Section -->
    <FeatureCards />

    <!-- What is a Fire Horse Section -->
    <section class="py-20 px-4 relative overflow-hidden">
      <!-- Fire gradient background -->
      <div class="absolute inset-0 gradient-fire-bg pointer-events-none" />

      <div class="container mx-auto max-w-6xl relative z-10">
        <!-- Section header -->
        <div class="text-center mb-16">
          <FireText tag="h2" class="text-4xl sm:text-5xl md:text-6xl mb-6">
            What is a Fire Horse?
          </FireText>
          <p class="text-lg sm:text-xl text-ash-300 max-w-3xl mx-auto leading-relaxed">
            In Chinese astrology, the Fire Horse is a rare and powerful combination that appears once every 60 years.
            Those born in this year are believed to possess extraordinary energy, passion, and an untamable spirit.
            They are natural leaders, unafraid to challenge the status quo and blaze their own trail.
          </p>
        </div>

        <!-- Traits grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <GlassCard
            v-for="trait in traits"
            :key="trait.title"
            :glow="true"
            padding="p-8"
            class="transform transition-all duration-300 hover:scale-105"
          >
            <div class="flex items-start gap-4">
              <div class="text-5xl flex-shrink-0">
                {{ trait.icon }}
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl font-display font-bold text-fire-400">
                  {{ trait.title }}
                </h3>
                <p class="text-ash-400 leading-relaxed">
                  {{ trait.description }}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <!-- Cultural significance -->
        <div class="text-center space-y-6">
          <GlassCard padding="p-10">
            <p class="text-lg text-ash-300 leading-relaxed mb-6">
              The Fire Horse year has been both celebrated and feared throughout Asian history.
              In Japanese culture, there's a superstition that Fire Horse women are too strong-willed and difficult to marry.
              In 1966, Japan's birth rate dropped significantly as couples avoided having children in this year.
            </p>
            <p class="text-lg text-ash-300 leading-relaxed">
              However, modern interpretations celebrate the Fire Horse as a symbol of strength, independence, and breaking free from tradition.
              Those born under this sign are seen as trailblazers who will shape the future with their fierce determination and innovative thinking.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- Fire Horse Years Banner -->
    <section class="py-20 px-4 bg-gradient-to-b from-ash-950 via-ash-900 to-ash-950">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span class="fire-text">Fire Horse Years</span>
          </h2>
          <p class="text-lg text-ash-400">
            Once every 60 years, the flame returns
          </p>
        </div>

        <!-- Years timeline -->
        <div class="relative">
          <!-- Connecting line -->
          <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-fire-500/30 to-transparent -translate-y-1/2 hidden md:block" />

          <!-- Years -->
          <div class="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 relative z-10">
            <div
              v-for="item in fireHorseYears"
              :key="item.year"
              class="flex flex-col items-center"
            >
              <div
                class="w-32 h-32 rounded-full flex items-center justify-center font-display text-3xl font-bold transition-all duration-300"
                :class="item.highlight
                  ? 'glass-strong fire-glow-strong text-fire-400 scale-125'
                  : 'glass text-ash-400 hover:text-fire-500 hover:fire-glow'"
              >
                {{ item.year }}
              </div>
              <div
                v-if="item.highlight"
                class="mt-4 text-fire-400 text-sm uppercase tracking-wider font-semibold animate-pulse"
              >
                Next Fire Horse
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 px-4 bg-ash-950">
      <div class="container mx-auto max-w-4xl text-center">
        <GlassCard :glow="true" padding="p-12">
          <FireText tag="h2" class="text-4xl sm:text-5xl md:text-6xl mb-6">
            Join the Fire Horse Community
          </FireText>
          <p class="text-xl text-ash-300 mb-8 leading-relaxed">
            Connect with fellow Fire Horses, explore your zodiac compatibility,
            and discover what this rare year means for you.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/forum">
              <button class="btn-fire px-8 py-4 text-lg">
                Join the Forum
              </button>
            </router-link>
            <router-link to="/compatibility">
              <button class="bg-ash-800 text-fire-400 border border-fire-500/30 hover:bg-fire-500/10 hover:border-fire-500/50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Check Compatibility
              </button>
            </router-link>
          </div>
        </GlassCard>
      </div>
    </section>
  </div>
</template>
