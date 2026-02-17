<script setup lang="ts">
import { ref } from 'vue'
import FireHero from '@/components/home/FireHero.vue'
import CountdownTimer from '@/components/home/CountdownTimer.vue'
import FeatureCards from '@/components/home/FeatureCards.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireText from '@/components/ui/FireText.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useSeo } from '@/composables/useSeo'

const { trackNewsletterSignup } = useAnalytics()

useSeo({
  title: 'FireHorse 2026 — Year of the Fire Horse',
  description: 'Celebrate the Year of the Fire Horse 2026. Encyclopedia, compatibility checker, zodiac tools, and more.',
  path: '/',
})
const newsletterEmail = ref('')
const newsletterSubmitted = ref(false)
const newsletterError = ref('')

function handleNewsletterSubmit() {
  newsletterError.value = ''
  if (!newsletterEmail.value) {
    newsletterError.value = 'Please enter your email address'
    return
  }
  trackNewsletterSignup()
  newsletterSubmitted.value = true
}

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

    <!-- Newsletter Signup Section -->
    <section class="py-20 px-4 bg-ash-950">
      <div class="container mx-auto max-w-4xl">
        <GlassCard :glow="true" padding="p-10 md:p-12">
          <div class="text-center mb-8">
            <FireText tag="h2" class="text-3xl sm:text-4xl md:text-5xl mb-4">
              Stay in the Loop
            </FireText>
            <p class="text-lg text-ash-300 max-w-2xl mx-auto leading-relaxed">
              Join our newsletter for zodiac insights, compatibility tips, and 2026 Fire Horse updates delivered straight to your inbox.
            </p>
          </div>

          <!-- Newsletter Form -->
          <div v-if="!newsletterSubmitted">
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              @submit.prevent="handleNewsletterSubmit"
              class="max-w-md mx-auto"
            >
              <input type="hidden" name="form-name" value="newsletter" />

              <!-- Honeypot field -->
              <p class="hidden">
                <label>
                  Don't fill this out if you're human:
                  <input name="bot-field" />
                </label>
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  class="flex-1 px-6 py-4 bg-ash-900/50 border border-ash-700 rounded-xl text-ash-100 placeholder-ash-500 focus:border-fire-500 focus:ring-2 focus:ring-fire-500/20 outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  class="btn-fire px-8 py-4 rounded-xl font-semibold whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>

              <p v-if="newsletterError" class="text-sm text-red-400 mt-3 text-center">
                {{ newsletterError }}
              </p>
              <p class="text-xs text-ash-500 mt-4 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>

          <!-- Success State -->
          <div v-else class="text-center py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-fire-500/20 rounded-full mb-4">
              <svg class="w-8 h-8 text-fire-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-2xl font-display font-bold text-fire-400 mb-2">
              Welcome to the Fire Horse Family!
            </h3>
            <p class="text-ash-300">
              Check your inbox for a confirmation email.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>

    <!-- Explore All 60 Signs Banner -->
    <section class="py-20 px-4 bg-gradient-to-b from-ash-950 to-ash-900">
      <div class="container mx-auto max-w-4xl text-center">
        <GlassCard :glow="true" padding="p-12">
          <div class="flex justify-center gap-3 text-4xl mb-6">
            <span>🌳</span><span>🔥</span><span>🌍</span><span>🪙</span><span>🌊</span>
          </div>
          <FireText tag="h2" class="text-4xl sm:text-5xl md:text-6xl mb-4">
            Explore All 60 Zodiac Signs
          </FireText>
          <p class="text-xl text-ash-300 mb-3 leading-relaxed">
            The Fire Horse is just one of 60 unique combinations in the Chinese sexagenary cycle.
          </p>
          <p class="text-lg text-ash-400 mb-8 leading-relaxed">
            12 animals &times; 5 elements &mdash; Wood, Fire, Earth, Metal, Water.
            Discover your exact sign and what it means.
          </p>
          <a
            href="https://wuxingzodiac.me"
            target="_blank"
            rel="noopener"
            class="inline-block btn-fire px-10 py-4 text-lg"
          >
            Visit Wu Xing Zodiac &rarr;
          </a>
        </GlassCard>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 px-4 bg-ash-950">
      <div class="container mx-auto max-w-4xl text-center">
        <GlassCard :glow="true" padding="p-12">
          <FireText tag="h2" class="text-4xl sm:text-5xl md:text-6xl mb-6">
            Discover Your Fire Horse Connection
          </FireText>
          <p class="text-xl text-ash-300 mb-8 leading-relaxed">
            Explore your zodiac compatibility with the Fire Horse
            and share your results with friends and family.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/compatibility">
              <button class="btn-fire px-8 py-4 text-lg">
                Check Your Compatibility
              </button>
            </router-link>
            <router-link to="/encyclopedia">
              <button class="bg-ash-800 text-fire-400 border border-fire-500/30 hover:bg-fire-500/10 hover:border-fire-500/50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Explore the Encyclopedia
              </button>
            </router-link>
          </div>
        </GlassCard>
      </div>
    </section>
  </div>
</template>
