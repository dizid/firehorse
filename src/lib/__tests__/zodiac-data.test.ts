import { describe, it, expect } from 'vitest'
import {
  getAnimalForYear,
  getElementForYear,
  getLunarYear,
  getZodiacFromBirthdate,
  calculateCompatibility,
  zodiacAnimals,
} from '@/lib/zodiac-data'
import type { ZodiacAnimal, ZodiacElement } from '@/types'

// ============================================
// getAnimalForYear
// ============================================
describe('getAnimalForYear', () => {
  it('maps all 12 animals correctly for known base years', () => {
    expect(getAnimalForYear(1924)).toBe('rat')
    expect(getAnimalForYear(1925)).toBe('ox')
    expect(getAnimalForYear(1926)).toBe('tiger')
    expect(getAnimalForYear(1927)).toBe('rabbit')
    expect(getAnimalForYear(1928)).toBe('dragon')
    expect(getAnimalForYear(1929)).toBe('snake')
    expect(getAnimalForYear(1930)).toBe('horse')
    expect(getAnimalForYear(1931)).toBe('goat')
    expect(getAnimalForYear(1932)).toBe('monkey')
    expect(getAnimalForYear(1933)).toBe('rooster')
    expect(getAnimalForYear(1934)).toBe('dog')
    expect(getAnimalForYear(1935)).toBe('pig')
  })

  it('cycles correctly: 1924 = rat AND 2020 = rat (12-year cycle)', () => {
    expect(getAnimalForYear(1924)).toBe('rat')
    expect(getAnimalForYear(2020)).toBe('rat')
  })

  it('matches zodiacAnimals[].years cross-reference', () => {
    for (const entry of zodiacAnimals) {
      for (const year of entry.years) {
        expect(getAnimalForYear(year)).toBe(entry.animal)
      }
    }
  })
})

// ============================================
// getElementForYear
// ============================================
describe('getElementForYear', () => {
  it('maps all 5 elements correctly for known years', () => {
    expect(getElementForYear(2020)).toBe('metal')
    expect(getElementForYear(2022)).toBe('water')
    expect(getElementForYear(2024)).toBe('wood')
    expect(getElementForYear(2026)).toBe('fire')
    expect(getElementForYear(2028)).toBe('earth')
  })

  it('assigns same element to 2-year pairs', () => {
    expect(getElementForYear(2020)).toBe('metal')
    expect(getElementForYear(2021)).toBe('metal')

    expect(getElementForYear(2022)).toBe('water')
    expect(getElementForYear(2023)).toBe('water')

    expect(getElementForYear(2024)).toBe('wood')
    expect(getElementForYear(2025)).toBe('wood')

    expect(getElementForYear(2026)).toBe('fire')
    expect(getElementForYear(2027)).toBe('fire')

    expect(getElementForYear(2028)).toBe('earth')
    expect(getElementForYear(2029)).toBe('earth')
  })

  it('cycles every 10 years: 2020 = metal AND 2030 = metal', () => {
    expect(getElementForYear(2020)).toBe('metal')
    expect(getElementForYear(2030)).toBe('metal')
  })
})

// ============================================
// getLunarYear
// ============================================
describe('getLunarYear', () => {
  // 1990 LNY = Jan 27
  it('returns same year when date is after LNY', () => {
    expect(getLunarYear(1990, 3, 15)).toBe(1990)
  })

  it('returns previous year when date is before LNY', () => {
    expect(getLunarYear(1990, 1, 15)).toBe(1989)
  })

  it('returns same year on LNY day itself', () => {
    expect(getLunarYear(1990, 1, 27)).toBe(1990)
  })

  it('returns previous year on day before LNY', () => {
    expect(getLunarYear(1990, 1, 26)).toBe(1989)
  })

  // 2026 LNY = Feb 17
  it('handles 2026 Feb boundary: Feb 16 = 2025, Feb 17 = 2026', () => {
    expect(getLunarYear(2026, 2, 16)).toBe(2025)
    expect(getLunarYear(2026, 2, 17)).toBe(2026)
  })

  // 1966 Fire Horse LNY = Jan 21
  it('handles 1966 Fire Horse: Jan 20 = 1965, Jan 21 = 1966', () => {
    expect(getLunarYear(1966, 1, 20)).toBe(1965)
    expect(getLunarYear(1966, 1, 21)).toBe(1966)
  })

  // Fallback: year outside table uses Feb 4 as boundary
  it('fallback for years outside table: uses Feb 4 as boundary', () => {
    expect(getLunarYear(1920, 1, 15)).toBe(1919)
    expect(getLunarYear(1920, 3, 1)).toBe(1920)
  })

  it('fallback boundary: Feb 3 = previous year, Feb 4 = same year', () => {
    expect(getLunarYear(1920, 2, 3)).toBe(1919)
    expect(getLunarYear(1920, 2, 4)).toBe(1920)
  })
})

// ============================================
// getZodiacFromBirthdate
// ============================================
describe('getZodiacFromBirthdate', () => {
  it('returns correct zodiac for date after LNY (1990, 3, 15)', () => {
    const result = getZodiacFromBirthdate(1990, 3, 15)
    expect(result).toEqual({ animal: 'horse', element: 'metal', lunarYear: 1990 })
  })

  it('returns previous lunar year zodiac for date before LNY (1990, 1, 15)', () => {
    const result = getZodiacFromBirthdate(1990, 1, 15)
    expect(result).toEqual({ animal: 'snake', element: 'earth', lunarYear: 1989 })
  })

  it('identifies 1966 Fire Horse for date after LNY (1966, 2, 1)', () => {
    const result = getZodiacFromBirthdate(1966, 2, 1)
    expect(result).toEqual({ animal: 'horse', element: 'fire', lunarYear: 1966 })
  })

  it('returns 1965 snake for date before 1966 LNY (1966, 1, 20)', () => {
    const result = getZodiacFromBirthdate(1966, 1, 20)
    expect(result).toEqual({ animal: 'snake', element: 'wood', lunarYear: 1965 })
  })

  it('identifies 2026 Fire Horse for date on LNY (2026, 2, 17)', () => {
    const result = getZodiacFromBirthdate(2026, 2, 17)
    expect(result).toEqual({ animal: 'horse', element: 'fire', lunarYear: 2026 })
  })

  it('returns 2025 snake for date before 2026 LNY (2026, 2, 16)', () => {
    const result = getZodiacFromBirthdate(2026, 2, 16)
    expect(result).toEqual({ animal: 'snake', element: 'wood', lunarYear: 2025 })
  })
})

// ============================================
// calculateCompatibility
// ============================================
describe('calculateCompatibility', () => {
  const allAnimals: ZodiacAnimal[] = [
    'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
    'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
  ]

  it('returns valid results with all required fields for every animal', () => {
    for (const animal of allAnimals) {
      const result = calculateCompatibility(animal, 'fire')
      expect(result).toHaveProperty('animal', animal)
      expect(result).toHaveProperty('element', 'fire')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('strengths')
      expect(result).toHaveProperty('challenges')
      expect(typeof result.score).toBe('number')
      expect(typeof result.summary).toBe('string')
      expect(Array.isArray(result.strengths)).toBe(true)
      expect(Array.isArray(result.challenges)).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    }
  })

  it('applies element modifiers correctly', () => {
    // fire = +10, wood = +5, earth = -5, metal = -3, water = -8
    // Using rat (base 45) as test subject
    const fire = calculateCompatibility('rat', 'fire')
    const wood = calculateCompatibility('rat', 'wood')
    const earth = calculateCompatibility('rat', 'earth')
    const metal = calculateCompatibility('rat', 'metal')
    const water = calculateCompatibility('rat', 'water')

    expect(fire.score).toBe(55)   // 45 + 10
    expect(wood.score).toBe(50)   // 45 + 5
    expect(earth.score).toBe(40)  // 45 - 5
    expect(metal.score).toBe(42)  // 45 - 3
    expect(water.score).toBe(37)  // 45 - 8
  })

  it('clamps score to max 100: dragon(90) + fire(+10) = 100', () => {
    const result = calculateCompatibility('dragon', 'fire')
    expect(result.score).toBe(100)
  })

  it('clamps score to min 0: ox(35) + water(-8) = 27 (still positive)', () => {
    const result = calculateCompatibility('ox', 'water')
    expect(result.score).toBe(27)
  })

  it('never returns a score below 0', () => {
    // Test all combinations to be sure
    const elements: ZodiacElement[] = ['wood', 'fire', 'earth', 'metal', 'water']
    for (const animal of allAnimals) {
      for (const element of elements) {
        const result = calculateCompatibility(animal, element)
        expect(result.score).toBeGreaterThanOrEqual(0)
        expect(result.score).toBeLessThanOrEqual(100)
      }
    }
  })
})
