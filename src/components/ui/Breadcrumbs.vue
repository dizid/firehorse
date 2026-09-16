<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Crumb {
  label: string
  to?: string
}

defineProps<{ items: Crumb[] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-6">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-ash-400">
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="flex items-center gap-2"
      >
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-fire-400 transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="text-ash-200"
          aria-current="page"
        >
          {{ item.label }}
        </span>
        <span
          v-if="index < items.length - 1"
          class="text-ash-600"
          aria-hidden="true"
        >/</span>
      </li>
    </ol>
  </nav>
</template>
