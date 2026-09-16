<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
import EmberParticles from '@/components/ui/EmberParticles.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Floating ember particles (background decoration) -->
    <EmberParticles />

    <!-- Sticky navigation -->
    <NavBar />

    <!-- Page content with transitions -->
    <main class="flex-1 relative z-10">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="flex items-center justify-center min-h-[50vh]">
                <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <FooterBar />
  </div>
</template>
