<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="relative z-10 border-t border-fire-500/10 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-1">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🔥</span>
            <span class="font-display text-lg font-bold fire-text">FireHorse</span>
          </RouterLink>
          <p class="text-sm text-ash-400 leading-relaxed">
            Celebrating the Year of the Fire Horse 2026.
            Born to blaze.
          </p>
        </div>

        <!-- Explore -->
        <div>
          <h3 class="font-display text-sm font-bold text-fire-400 uppercase tracking-wider mb-4">
            Explore
          </h3>
          <ul class="space-y-2">
            <li><RouterLink to="/encyclopedia" class="text-sm text-ash-400 hover:text-fire-300 transition-colors">Encyclopedia</RouterLink></li>
            <li><RouterLink to="/compatibility" class="text-sm text-ash-400 hover:text-fire-300 transition-colors">Compatibility</RouterLink></li>
            <li><RouterLink to="/blog" class="text-sm text-ash-400 hover:text-fire-300 transition-colors">Blog</RouterLink></li>
            <li><a href="https://wuxingzodiac.me" target="_blank" rel="noopener" class="text-sm text-ash-400 hover:text-fire-300 transition-colors">All 60 Zodiac Signs &rarr;</a></li>
          </ul>
        </div>

        <!-- Fire Horse Year -->
        <div>
          <h3 class="font-display text-sm font-bold text-fire-400 uppercase tracking-wider mb-4">
            2026
          </h3>
          <p class="text-sm text-ash-400 leading-relaxed">
            The Fire Horse returns every 60 years.
            1906 · 1966 · <span class="text-fire-400 font-semibold">2026</span> · 2086
          </p>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-ash-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs text-ash-500">
          &copy; 2026 FireHorse. Built with fire.
        </p>
        <p class="text-xs text-ash-600">
          丙午 — Year of the Fire Horse
        </p>
      </div>
    </div>
  </footer>
</template>
