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

// Forum types
export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  threadCount: number
  postCount: number
}

export interface ForumThread {
  id: string
  categoryId: string
  title: string
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  updatedAt: string
  postCount: number
  viewCount: number
  isPinned: boolean
  isLocked: boolean
  lastPostAt: string
  lastPostAuthor: string
}

export interface ForumPost {
  id: string
  threadId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
  upvotes: number
  downvotes: number
  userVote?: 'up' | 'down' | null
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

// User types
export interface UserProfile {
  id: string
  clerkId: string
  username: string
  avatar?: string
  zodiacAnimal?: ZodiacAnimal
  zodiacElement?: ZodiacElement
  birthYear?: number
  isPaidMember: boolean
  joinedAt: string
  postCount: number
  threadCount: number
}

// Navigation
export interface NavItem {
  label: string
  to: string
  icon?: string
}
