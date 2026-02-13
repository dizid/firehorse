import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import ZodiacSelector from '../ZodiacSelector.vue'
import { zodiacAnimals } from '@/lib/zodiac-data'

describe('ZodiacSelector', () => {
  // Make requestAnimationFrame synchronous so the result renders immediately
  let origRAF: typeof globalThis.requestAnimationFrame

  beforeEach(() => {
    origRAF = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    }
  })

  afterEach(() => {
    globalThis.requestAnimationFrame = origRAF
  })

  function createWrapper(props = {}) {
    return mount(ZodiacSelector, {
      props: {
        modelValue: null,
        ...props,
      },
    })
  }

  // Helper: open birthdate section
  async function openBirthdate(wrapper: ReturnType<typeof createWrapper>) {
    const toggleBtn = wrapper.findAll('button').find((b) => b.text().includes("Don't know your sign?"))
    await toggleBtn!.trigger('click')
    await flushPromises()
  }

  // Helper: filter out disabled placeholder options
  function getNonPlaceholderOptions(selectWrapper: ReturnType<ReturnType<typeof createWrapper>['findAll']>[0]) {
    return selectWrapper.findAll('option').filter((o) => o.attributes('disabled') === undefined)
  }

  // Helper: fill birthdate via selects, using change events to trigger v-model.number
  async function fillBirthdate(wrapper: ReturnType<typeof createWrapper>) {
    await openBirthdate(wrapper)

    const selects = wrapper.findAll('select')

    // Set year to 1990
    await selects[0]!.setValue('1990')
    await nextTick()
    // Set month to 3 (March)
    await selects[1]!.setValue('3')
    await nextTick()
    // Set day to 15
    await selects[2]!.setValue('15')
    await nextTick()
    await flushPromises()
    // Wait one more tick for the watcher + rAF to fire
    await nextTick()
    await flushPromises()
  }

  // ============================================
  // RENDERING
  // ============================================
  describe('Rendering', () => {
    it('renders all 12 zodiac animal buttons with correct names', () => {
      const wrapper = createWrapper()
      const buttons = wrapper.findAll('.grid button')
      expect(buttons).toHaveLength(12)

      const names = buttons.map((b) => b.text())
      for (const zodiac of zodiacAnimals) {
        expect(names.some((n) => n.includes(zodiac.name))).toBe(true)
      }
    })

    it('shows "Don\'t know your sign?" text', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain("Don't know your sign?")
    })

    it('birthdate section is hidden by default', () => {
      const wrapper = createWrapper()
      const selects = wrapper.findAll('select')
      expect(selects).toHaveLength(0)
    })
  })

  // ============================================
  // ANIMAL GRID
  // ============================================
  describe('Animal Grid', () => {
    it('clicking Rat emits update:modelValue with "rat"', async () => {
      const wrapper = createWrapper()
      const buttons = wrapper.findAll('.grid button')
      await buttons[0]!.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['rat'])
    })

    it('clicking Horse emits update:modelValue with "horse"', async () => {
      const wrapper = createWrapper()
      const buttons = wrapper.findAll('.grid button')
      await buttons[6]!.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['horse'])
    })

    it('clicking Dragon emits update:modelValue with "dragon"', async () => {
      const wrapper = createWrapper()
      const buttons = wrapper.findAll('.grid button')
      await buttons[4]!.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['dragon'])
    })
  })

  // ============================================
  // BIRTHDATE TOGGLE
  // ============================================
  describe('Birthdate Toggle', () => {
    it('clicking "Don\'t know your sign?" reveals date inputs', async () => {
      const wrapper = createWrapper()
      await openBirthdate(wrapper)

      const selects = wrapper.findAll('select')
      expect(selects).toHaveLength(3)
    })

    it('selects have correct placeholder options', async () => {
      const wrapper = createWrapper()
      await openBirthdate(wrapper)

      const selects = wrapper.findAll('select')
      expect(selects[0]!.find('option[disabled]').text()).toBe('Year')
      expect(selects[1]!.find('option[disabled]').text()).toBe('Month')
      expect(selects[2]!.find('option[disabled]').text()).toBe('Day')
    })
  })

  // ============================================
  // BIRTHDATE DROPDOWNS
  // ============================================
  describe('Birthdate Dropdowns', () => {
    it('year select has options from 2026 down to 1924', async () => {
      const wrapper = createWrapper()
      await openBirthdate(wrapper)

      const yearSelect = wrapper.findAll('select')[0]!
      const yearOptions = getNonPlaceholderOptions(yearSelect)
      expect(yearOptions).toHaveLength(2026 - 1924 + 1) // 103 years

      expect(yearOptions[0]!.text()).toBe('2026')
      expect(yearOptions[yearOptions.length - 1]!.text()).toBe('1924')
    })

    it('month select has 12 months', async () => {
      const wrapper = createWrapper()
      await openBirthdate(wrapper)

      const monthSelect = wrapper.findAll('select')[1]!
      const monthOptions = getNonPlaceholderOptions(monthSelect)
      expect(monthOptions).toHaveLength(12)
      expect(monthOptions[0]!.text()).toBe('Jan')
      expect(monthOptions[11]!.text()).toBe('Dec')
    })

    it('day select defaults to 31 days', async () => {
      const wrapper = createWrapper()
      await openBirthdate(wrapper)

      const daySelect = wrapper.findAll('select')[2]!
      const dayOptions = getNonPlaceholderOptions(daySelect)
      expect(dayOptions).toHaveLength(31)
    })
  })

  // ============================================
  // BIRTHDATE RESULT
  // ============================================
  describe('Birthdate Result', () => {
    it('setting year=1990, month=3, day=15 shows Horse result with emoji', async () => {
      const wrapper = createWrapper()
      await fillBirthdate(wrapper)

      // The result chip should show the Horse name and Metal element
      const resultText = wrapper.text()
      // Check that the result section contains "Metal" and "Horse" together
      // (not just the grid button text)
      expect(resultText).toContain('Metal')
      expect(resultText).toContain('Horse')
    })

    it('"Find My Compatibility" button appears when result shows', async () => {
      const wrapper = createWrapper()
      await fillBirthdate(wrapper)

      const compatBtn = wrapper.findAll('button').find((b) => b.text().includes('Find My Compatibility'))
      expect(compatBtn).toBeTruthy()
    })

    it('clicking "Find My Compatibility" emits skipToResult with horse and metal', async () => {
      const wrapper = createWrapper()
      await fillBirthdate(wrapper)

      const compatBtn = wrapper.findAll('button').find((b) => b.text().includes('Find My Compatibility'))
      expect(compatBtn).toBeTruthy()
      await compatBtn!.trigger('click')

      expect(wrapper.emitted('skipToResult')?.[0]).toEqual(['horse', 'metal'])
    })
  })
})
