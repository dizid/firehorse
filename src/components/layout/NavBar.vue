<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth, SignInButton, UserButton } from '@clerk/vue'

const route = useRoute()
const { isSignedIn } = useAuth()
const mobileOpen = ref(false)

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Encyclopedia', to: '/encyclopedia' },
  { label: 'Compatibility', to: '/compatibility' },
  { label: 'Forum', to: '/forum' },
  { label: 'Blog', to: '/blog' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="sticky top-0 z-50 glass-strong">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl">🔥</span>
          <span class="font-display text-xl font-bold fire-text">
            FireHorse
          </span>
        </RouterLink>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
            :class="[
              isActive(item.to)
                ? 'text-fire-400 bg-fire-500/10'
                : 'text-ash-300 hover:text-fire-300 hover:bg-white/5'
            ]"
          >
            {{ item.label }}
            <!-- Active indicator -->
            <span
              v-if="isActive(item.to)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-fire-500 to-ember-500 rounded-full"
            />
          </RouterLink>
        </div>

        <!-- Auth + mobile toggle -->
        <div class="flex items-center gap-3">
          <!-- Auth -->
          <template v-if="isSignedIn">
            <UserButton />
          </template>
          <template v-else>
            <SignInButton mode="modal">
              <button class="btn-fire text-sm py-2 px-4">
                Sign In
              </button>
            </SignInButton>
          </template>

          <!-- Mobile hamburger -->
          <button
            class="md:hidden p-2 text-ash-300 hover:text-fire-400 transition-colors"
            @click="mobileOpen = !mobileOpen"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!mobileOpen"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="md:hidden glass border-t border-fire-500/10">
        <div class="px-4 py-3 space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block px-4 py-3 rounded-lg text-base font-medium transition-colors"
            :class="[
              isActive(item.to)
                ? 'text-fire-400 bg-fire-500/10'
                : 'text-ash-300 hover:text-fire-300 hover:bg-white/5'
            ]"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
