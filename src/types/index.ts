// ============================================
// FIREHORSE TYPE DEFINITIONS
// ============================================

// Zodiac types
export type ZodiacAnimal =
  | 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig'

export type ZodiacElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

export interface ZodiacSign {
  animal: ZodiacAnimal
  element: ZodiacElement
  year: number
}

export interface CompatibilityResult {
  animal: ZodiacAnimal
  element: ZodiacElement
  score: number // 0-100
  summary: string
  strengths: string[]
  challenges: string[]
}

// Encyclopedia types
export interface EncyclopediaArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: 'history' | 'traits' | 'culture' | 'famous' | 'myths'
  image?: string
}

export interface TimelineEvent {
  year: number
  title: string
  description: string
  significance: string
}

// Blog types
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  authorName: string
  publishedAt: string
  tags: string[]
  readTime: number
}

// Navigation
export interface NavItem {
  label: string
  to: string
  icon?: string
}
