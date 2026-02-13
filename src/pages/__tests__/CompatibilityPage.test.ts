import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CompatibilityPage from '../CompatibilityPage.vue'

// Mock useAnalytics — it references window.gtag
vi.mock('@/composables/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCompatibilityComplete: vi.fn(),
    trackShareResult: vi.fn(),
    trackEvent: vi.fn(),
  }),
}))

describe('CompatibilityPage', () => {
  function createWrapper() {
    return mount(CompatibilityPage, {
      global: {
        stubs: {
          // Stub CompatibilityResult to avoid its onMounted timer + window.open/clipboard usage
          CompatibilityResult: {
            template: '<div data-testid="compat-result">Result Stub</div>',
            props: ['result'],
          },
        },
      },
    })
  }

  // ============================================
  // INITIAL STATE
  // ============================================
  describe('Initial State', () => {
    it('shows step 1 (Animal selection) on mount', () => {
      const wrapper = createWrapper()
      // Step 1 renders ZodiacSelector which has "Select Your Zodiac Animal"
      expect(wrapper.text()).toContain('Select Your Zodiac Animal')
    })

    it('progress indicator shows step 1 as active', () => {
      const wrapper = createWrapper()
      // All three step circles
      const stepCircles = wrapper.findAll('.flex.items-center.justify-center.w-10.h-10')
      expect(stepCircles).toHaveLength(3)

      // Step 1 should have fire styling (bg-fire-500)
      expect(stepCircles[0]!.classes()).toContain('bg-fire-500')
      // Step 2 should NOT have fire styling
      expect(stepCircles[1]!.classes()).not.toContain('bg-fire-500')
      // Step 3 should NOT have fire styling
      expect(stepCircles[2]!.classes()).not.toContain('bg-fire-500')
    })
  })

  // ============================================
  // SKIP-TO-RESULT INTEGRATION
  // ============================================
  describe('Skip-to-Result Integration', () => {
    it('when ZodiacSelector emits skipToResult, page jumps to step 3', async () => {
      const wrapper = createWrapper()

      // Find the ZodiacSelector component instance and emit skipToResult
      const zodiacSelector = wrapper.findComponent({ name: 'ZodiacSelector' })
      expect(zodiacSelector.exists()).toBe(true)

      zodiacSelector.vm.$emit('skipToResult', 'horse', 'metal')
      await flushPromises()

      // Step 1 content should be gone (v-if hides it)
      expect(wrapper.text()).not.toContain('Select Your Zodiac Animal')
      // Result section should be visible
      expect(wrapper.text()).toContain('Your Compatibility with Fire Horse')
    })

    it('result section is visible after skipToResult', async () => {
      const wrapper = createWrapper()

      const zodiacSelector = wrapper.findComponent({ name: 'ZodiacSelector' })
      zodiacSelector.vm.$emit('skipToResult', 'dragon', 'fire')
      await flushPromises()

      // The stubbed CompatibilityResult should be in the DOM
      expect(wrapper.find('[data-testid="compat-result"]').exists()).toBe(true)
    })
  })
})
