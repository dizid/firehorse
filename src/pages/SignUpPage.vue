<script setup lang="ts">
import { SignUp } from '@clerk/vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <SignUp routing="path" path="/sign-up" />
  </div>
</template>
