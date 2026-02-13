<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@clerk/vue'
import { useRouter } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import FireButton from '@/components/ui/FireButton.vue'
import type { UserProfile, ZodiacAnimal, ZodiacElement } from '@/types'

const { isSignedIn, isLoaded, getToken } = useAuth()
const router = useRouter()

const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const editing = ref(false)
const saving = ref(false)

const editForm = ref({
  username: '',
  zodiacAnimal: '' as ZodiacAnimal | '',
  zodiacElement: '' as ZodiacElement | '',
  birthYear: null as number | null
})

const zodiacAnimals: ZodiacAnimal[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
]

const zodiacElements: ZodiacElement[] = ['wood', 'fire', 'earth', 'metal', 'water']

async function fetchProfile() {
  if (!isSignedIn.value) return

  loading.value = true
  error.value = null

  try {
    const token = await getToken.value()
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    profile.value = await response.json()

    editForm.value = {
      username: profile.value?.username || '',
      zodiacAnimal: profile.value?.zodiacAnimal || '',
      zodiacElement: profile.value?.zodiacElement || '',
      birthYear: profile.value?.birthYear || null
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  if (!isSignedIn.value) return

  saving.value = true

  try {
    const token = await getToken.value()
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: editForm.value.username,
        zodiacAnimal: editForm.value.zodiacAnimal || null,
        zodiacElement: editForm.value.zodiacElement || null,
        birthYear: editForm.value.birthYear
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    await fetchProfile()
    editing.value = false
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

onMounted(() => {
  if (!isLoaded.value) {
    setTimeout(() => {
      if (!isSignedIn.value) {
        router.push('/sign-in')
      } else {
        fetchProfile()
      }
    }, 500)
  } else if (!isSignedIn.value) {
    router.push('/sign-in')
  } else {
    fetchProfile()
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-display font-bold fire-text mb-4">
          Profile
        </h1>
        <p class="text-ash-300 text-lg">
          Manage your account and zodiac information
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-20"
      >
        <div class="inline-block w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-ash-400">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20"
      >
        <p class="text-fire-400 text-lg">{{ error }}</p>
      </div>

      <!-- Profile Content -->
      <div
        v-else-if="profile"
        class="space-y-6"
      >
        <!-- User Info Card -->
        <GlassCard :glow="true">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div
                v-if="profile.avatar"
                class="w-20 h-20 rounded-full overflow-hidden bg-ash-800"
              >
                <img
                  :src="profile.avatar"
                  :alt="profile.username"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-20 h-20 rounded-full bg-fire-500/20 flex items-center justify-center text-fire-400 font-bold text-3xl"
              >
                {{ profile.username[0]?.toUpperCase() || '?' }}
              </div>

              <div>
                <h2 class="text-2xl font-display font-bold text-ash-100">
                  {{ profile.username }}
                </h2>
                <p class="text-ash-400 text-sm">
                  Member since {{ formatDate(profile.joinedAt) }}
                </p>
                <div class="mt-1">
                  <span
                    v-if="profile.isPaidMember"
                    class="text-xs px-2 py-1 bg-fire-500/20 text-fire-400 rounded font-semibold"
                  >
                    ✨ PAID MEMBER
                  </span>
                  <span
                    v-else
                    class="text-xs px-2 py-1 bg-ash-700 text-ash-400 rounded"
                  >
                    FREE MEMBER
                  </span>
                </div>
              </div>
            </div>

            <FireButton
              v-if="!editing"
              @click="editing = true"
              variant="secondary"
              size="sm"
            >
              Edit Profile
            </FireButton>
          </div>

          <!-- Edit Form -->
          <div
            v-if="editing"
            class="space-y-4 pt-6 border-t border-ash-800"
          >
            <div>
              <label class="block text-sm font-medium text-ash-300 mb-2">
                Username
              </label>
              <input
                v-model="editForm.username"
                type="text"
                class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-ash-300 mb-2">
                  Zodiac Animal
                </label>
                <select
                  v-model="editForm.zodiacAnimal"
                  class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors"
                >
                  <option value="">Select animal</option>
                  <option
                    v-for="animal in zodiacAnimals"
                    :key="animal"
                    :value="animal"
                  >
                    {{ capitalize(animal) }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-ash-300 mb-2">
                  Zodiac Element
                </label>
                <select
                  v-model="editForm.zodiacElement"
                  class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors"
                >
                  <option value="">Select element</option>
                  <option
                    v-for="element in zodiacElements"
                    :key="element"
                    :value="element"
                  >
                    {{ capitalize(element) }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-ash-300 mb-2">
                Birth Year
              </label>
              <input
                v-model.number="editForm.birthYear"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                class="w-full px-4 py-2 bg-ash-900 border border-ash-700 rounded-lg text-ash-100 focus:outline-none focus:border-fire-500 transition-colors"
              />
            </div>

            <div class="flex gap-3">
              <FireButton
                @click="saveProfile"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </FireButton>
              <FireButton
                variant="ghost"
                @click="editing = false"
                :disabled="saving"
              >
                Cancel
              </FireButton>
            </div>
          </div>

          <!-- Display Mode -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-ash-800"
          >
            <div>
              <p class="text-xs text-ash-500 uppercase tracking-wide mb-1">
                Zodiac Animal
              </p>
              <p class="text-ash-100 font-medium">
                {{ profile.zodiacAnimal ? capitalize(profile.zodiacAnimal) : 'Not set' }}
              </p>
            </div>

            <div>
              <p class="text-xs text-ash-500 uppercase tracking-wide mb-1">
                Element
              </p>
              <p class="text-ash-100 font-medium">
                {{ profile.zodiacElement ? capitalize(profile.zodiacElement) : 'Not set' }}
              </p>
            </div>

            <div>
              <p class="text-xs text-ash-500 uppercase tracking-wide mb-1">
                Birth Year
              </p>
              <p class="text-ash-100 font-medium">
                {{ profile.birthYear || 'Not set' }}
              </p>
            </div>
          </div>
        </GlassCard>

        <!-- Activity Stats -->
        <GlassCard>
          <h3 class="text-xl font-display font-bold text-fire-400 mb-4">
            Activity Stats
          </h3>

          <div class="grid grid-cols-2 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-fire-400">
                {{ profile.threadCount }}
              </div>
              <p class="text-sm text-ash-400 mt-1">
                {{ profile.threadCount === 1 ? 'Thread' : 'Threads' }} Started
              </p>
            </div>

            <div class="text-center">
              <div class="text-3xl font-bold text-fire-400">
                {{ profile.postCount }}
              </div>
              <p class="text-sm text-ash-400 mt-1">
                {{ profile.postCount === 1 ? 'Post' : 'Posts' }} Made
              </p>
            </div>
          </div>
        </GlassCard>

        <!-- Membership Card -->
        <GlassCard v-if="!profile.isPaidMember">
          <div class="text-center py-8">
            <h3 class="text-2xl font-display font-bold text-fire-400 mb-2">
              Unlock Premium Features
            </h3>
            <p class="text-ash-300 mb-6">
              Upgrade to a paid membership to post in the forum and access exclusive content
            </p>
            <FireButton size="lg">
              Upgrade Now
            </FireButton>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
