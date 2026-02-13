import type { ZodiacAnimal, ZodiacElement, CompatibilityResult } from '@/types'

// ============================================
// ZODIAC ANIMALS — 12-year cycle
// ============================================
export const zodiacAnimals: { animal: ZodiacAnimal; name: string; emoji: string; years: number[] }[] = [
  { animal: 'rat', name: 'Rat', emoji: '🐀', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020, 2032] },
  { animal: 'ox', name: 'Ox', emoji: '🐂', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021, 2033] },
  { animal: 'tiger', name: 'Tiger', emoji: '🐅', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034] },
  { animal: 'rabbit', name: 'Rabbit', emoji: '🐇', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023, 2035] },
  { animal: 'dragon', name: 'Dragon', emoji: '🐉', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024, 2036] },
  { animal: 'snake', name: 'Snake', emoji: '🐍', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025, 2037] },
  { animal: 'horse', name: 'Horse', emoji: '🐎', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026, 2038] },
  { animal: 'goat', name: 'Goat', emoji: '🐐', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027, 2039] },
  { animal: 'monkey', name: 'Monkey', emoji: '🐒', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028, 2040] },
  { animal: 'rooster', name: 'Rooster', emoji: '🐓', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029, 2041] },
  { animal: 'dog', name: 'Dog', emoji: '🐕', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030, 2042] },
  { animal: 'pig', name: 'Pig', emoji: '🐖', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031, 2043] },
]

// ============================================
// ZODIAC ELEMENTS — 10-year cycle (2 years each)
// ============================================
export const zodiacElements: { element: ZodiacElement; name: string; color: string }[] = [
  { element: 'wood', name: 'Wood', color: '#22c55e' },
  { element: 'fire', name: 'Fire', color: '#f97316' },
  { element: 'earth', name: 'Earth', color: '#a16207' },
  { element: 'metal', name: 'Metal', color: '#94a3b8' },
  { element: 'water', name: 'Water', color: '#3b82f6' },
]

// Get element from year
export function getElementForYear(year: number): ZodiacElement {
  const elements: ZodiacElement[] = ['metal', 'metal', 'water', 'water', 'wood', 'wood', 'fire', 'fire', 'earth', 'earth']
  const element = elements[year % 10]
  if (!element) throw new Error('Invalid year for element calculation')
  return element
}

// Get animal from year
export function getAnimalForYear(year: number): ZodiacAnimal {
  const animals: ZodiacAnimal[] = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat']
  const animal = animals[year % 12]
  if (!animal) throw new Error('Invalid year for animal calculation')
  return animal
}

// ============================================
// COMPATIBILITY WITH FIRE HORSE
// ============================================
const compatibilityData: Record<ZodiacAnimal, { base: number; summary: string; strengths: string[]; challenges: string[] }> = {
  rat: {
    base: 45,
    summary: 'A challenging but intriguing match. The Rat\'s cunning and the Fire Horse\'s wild energy can clash, but both share ambition and determination.',
    strengths: ['Mutual ambition', 'Both are resourceful', 'Intellectual spark'],
    challenges: ['Different approaches to risk', 'Power struggles', 'Trust issues'],
  },
  ox: {
    base: 35,
    summary: 'A difficult pairing. The Ox craves stability while the Fire Horse lives for freedom and adventure. Respect can bridge the gap.',
    strengths: ['Complementary strengths', 'Ox provides grounding', 'Loyalty runs deep'],
    challenges: ['Fundamentally different values', 'Fire Horse feels trapped', 'Ox feels insecure'],
  },
  tiger: {
    base: 85,
    summary: 'An electric match! Both are bold, passionate, and adventurous. Together they create unstoppable energy — but need space to breathe.',
    strengths: ['Shared passion and courage', 'Mutual respect', 'Exciting partnership', 'Both love adventure'],
    challenges: ['Two dominant personalities', 'Competing for spotlight', 'Explosive arguments'],
  },
  rabbit: {
    base: 40,
    summary: 'A fragile connection. The Rabbit\'s gentle nature can be overwhelmed by the Fire Horse\'s intensity, though the Rabbit brings calm.',
    strengths: ['Balance of energies', 'Rabbit soothes Fire Horse', 'Artistic connection'],
    challenges: ['Fire Horse too intense', 'Rabbit retreats under pressure', 'Communication gaps'],
  },
  dragon: {
    base: 90,
    summary: 'A legendary match! Fire meets fire. The Dragon and Fire Horse are both powerful, magnetic, and destined for greatness together.',
    strengths: ['Enormous combined energy', 'Mutual admiration', 'World-changing ambition', 'Deep passion'],
    challenges: ['Ego clashes', 'Both need to lead', 'Burnout risk'],
  },
  snake: {
    base: 55,
    summary: 'A mysterious attraction. The Snake\'s depth and wisdom fascinate the Fire Horse, while the Horse\'s energy captivates the Snake.',
    strengths: ['Intellectual connection', 'Snake provides strategy', 'Magnetic attraction'],
    challenges: ['Snake is possessive', 'Fire Horse needs freedom', 'Different social needs'],
  },
  horse: {
    base: 75,
    summary: 'Two horses running wild! Natural understanding and shared energy, but the fire element adds intensity that regular Horses may struggle with.',
    strengths: ['Instant understanding', 'Shared love of freedom', 'Energy match', 'Fun together'],
    challenges: ['No one plays anchor', 'Both avoid commitment', 'Financial instability'],
  },
  goat: {
    base: 60,
    summary: 'A warm partnership. The Goat\'s creativity and the Fire Horse\'s energy can produce beautiful results, with mutual appreciation.',
    strengths: ['Creative synergy', 'Goat appreciates Horse\'s protection', 'Artistic bond'],
    challenges: ['Goat too dependent', 'Fire Horse too restless', 'Different pace of life'],
  },
  monkey: {
    base: 70,
    summary: 'A fun and dynamic match! Both are clever, social, and love excitement. The Monkey can keep up with the Fire Horse\'s energy.',
    strengths: ['Intellectual match', 'Shared sense of humor', 'Both adaptable', 'Social chemistry'],
    challenges: ['Monkey can be manipulative', 'Neither is grounding', 'Fidelity questions'],
  },
  rooster: {
    base: 50,
    summary: 'An unlikely pair with potential. The Rooster\'s precision and the Fire Horse\'s passion can complement if both are flexible.',
    strengths: ['Rooster brings order', 'Fire Horse brings excitement', 'Both are hardworking'],
    challenges: ['Rooster too critical', 'Fire Horse too chaotic', 'Constant friction'],
  },
  dog: {
    base: 80,
    summary: 'A beautiful match. The Dog\'s loyalty and the Fire Horse\'s passion create a strong, loving bond built on trust and adventure.',
    strengths: ['Deep loyalty', 'Dog grounds the Fire Horse', 'Honest communication', 'Protective bond'],
    challenges: ['Dog can be anxious', 'Fire Horse unpredictable', 'Dog needs reassurance'],
  },
  pig: {
    base: 65,
    summary: 'A warm and generous pairing. The Pig\'s kindness softens the Fire Horse, while the Horse brings excitement to the Pig\'s life.',
    strengths: ['Pig\'s generosity appreciated', 'Warm home life', 'Both sociable'],
    challenges: ['Pig too trusting', 'Fire Horse too independent', 'Different values around comfort'],
  },
}

// Element modifiers for compatibility
const elementModifiers: Record<ZodiacElement, number> = {
  fire: 10,   // Fire + Fire Horse = extra intense
  wood: 5,    // Wood feeds fire
  earth: -5,  // Earth smothers fire
  metal: -3,  // Metal and fire clash
  water: -8,  // Water douses fire
}

export function calculateCompatibility(animal: ZodiacAnimal, element: ZodiacElement): CompatibilityResult {
  const data = compatibilityData[animal]
  const modifier = elementModifiers[element] || 0

  if (!data) {
    throw new Error(`Invalid zodiac animal: ${animal}`)
  }

  const score = Math.min(100, Math.max(0, data.base + modifier))

  return {
    animal,
    element,
    score,
    summary: data.summary,
    strengths: data.strengths,
    challenges: data.challenges,
  }
}

// Fire Horse years
export const fireHorseYears = [1846, 1906, 1966, 2026, 2086]

// ============================================
// LUNAR NEW YEAR DATES (approximate)
// Chinese New Year falls between Jan 21 - Feb 20
// These are the start dates of each lunar year
// ============================================
const lunarNewYearDates: Record<number, [number, number]> = {
  1924: [2, 5], 1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23],
  1929: [2, 10], 1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26],
  1934: [2, 14], 1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31],
  1939: [2, 19], 1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5],
  1944: [1, 25], 1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10],
  1949: [1, 29], 1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14],
  1954: [2, 3], 1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18],
  1959: [2, 8], 1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25],
  1964: [2, 13], 1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30],
  1969: [2, 17], 1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3],
  1974: [1, 23], 1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7],
  1979: [1, 28], 1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13],
  1984: [2, 2], 1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17],
  1989: [2, 6], 1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23],
  1994: [2, 10], 1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28],
  1999: [2, 16], 2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1],
  2004: [1, 22], 2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7],
  2009: [1, 26], 2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10],
  2014: [1, 31], 2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16],
  2019: [2, 5], 2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22],
  2024: [2, 10], 2025: [1, 29], 2026: [2, 17],
}

// Get the lunar year for a given date, accounting for Lunar New Year boundary
export function getLunarYear(year: number, month: number, day: number): number {
  const lnyDate = lunarNewYearDates[year]
  if (!lnyDate) {
    // Fallback: if year not in table, use Feb 4 as approximate boundary
    if (month < 2 || (month === 2 && day < 4)) {
      return year - 1
    }
    return year
  }
  const [lnyMonth, lnyDay] = lnyDate
  // If the date is before Lunar New Year, it belongs to the previous year's zodiac
  if (month < lnyMonth || (month === lnyMonth && day < lnyDay)) {
    return year - 1
  }
  return year
}

// Get zodiac animal and element from a birthdate
export function getZodiacFromBirthdate(year: number, month: number, day: number): {
  animal: ZodiacAnimal
  element: ZodiacElement
  lunarYear: number
} {
  const lunarYear = getLunarYear(year, month, day)
  return {
    animal: getAnimalForYear(lunarYear),
    element: getElementForYear(lunarYear),
    lunarYear,
  }
}
