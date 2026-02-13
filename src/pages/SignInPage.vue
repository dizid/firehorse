<script setup lang="ts">
import { SignIn } from '@clerk/vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <SignIn routing="path" path="/sign-in" />
  </div>
</template>
