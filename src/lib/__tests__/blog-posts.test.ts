import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  CODE_BLOG_POSTS,
  codeBlogPostSummaries,
  getCodeBlogPost,
  mergeBlogPosts,
} from '@/content/blog-posts.mjs'
import { encyclopediaArticles } from '@/lib/encyclopedia-data'

// Published database posts on firehorse.info (Nov 2026), for internal-link checks
const DATABASE_SLUGS = [
  'welcome-to-firehorse',
  '2026-year-of-fire-horse',
  'fire-horse-compatibility-test',
  'famous-fire-horses-history',
  'japan-fire-horse-superstition-birth-rate',
  'chinese-zodiac-elements-guide',
]

// Tags the blog's prose styles cover (BlogPostPage.vue); lists and tables are unstyled there
const ALLOWED_TAGS = new Set(['p', 'h2', 'h3', 'strong', 'em', 'a', 'blockquote'])

// ============================================
// The code posts themselves
// ============================================
describe('code blog posts', () => {
  it('have unique, URL-safe slugs and ids of the form code-<slug>', () => {
    const slugs = CODE_BLOG_POSTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const post of CODE_BLOG_POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/)
      expect(post.id).toBe(`code-${post.slug}`)
    }
  })

  it('do not reuse a database post slug', () => {
    for (const post of CODE_BLOG_POSTS) expect(DATABASE_SLUGS).not.toContain(post.slug)
  })

  it('have a valid date, a short title and an excerpt that fits a meta description', () => {
    for (const post of CODE_BLOG_POSTS) {
      expect(Number.isNaN(new Date(post.publishedAt).getTime())).toBe(false)
      expect(post.title.length).toBeLessThanOrEqual(65)
      expect(post.excerpt.length).toBeGreaterThan(50)
      expect(post.excerpt.length).toBeLessThanOrEqual(160)
      expect(post.tags.length).toBeGreaterThan(0)
      expect(post.readTime).toBeGreaterThan(0)
    }
  })

  it('use only the HTML tags the blog styles, and no em dashes', () => {
    for (const post of CODE_BLOG_POSTS) {
      const tags = [...post.content.matchAll(/<([a-z0-9]+)[\s>]/g)].map((m) => m[1])
      for (const tag of tags) expect(ALLOWED_TAGS, `${post.slug}: <${tag}>`).toContain(tag)
      expect(post.content).not.toContain('—')
      expect(post.title + post.excerpt).not.toContain('—')
    }
  })

  it('open outside links in a new tab with rel=noopener, and only link to pages that exist', () => {
    const encyclopediaSlugs = encyclopediaArticles.map((a) => a.slug)
    const blogSlugs = [...DATABASE_SLUGS, ...CODE_BLOG_POSTS.map((p) => p.slug)]
    for (const post of CODE_BLOG_POSTS) {
      const links = [...post.content.matchAll(/<a ([^>]*)>/g)].map((m) => m[1] ?? '')
      expect(links.length).toBeGreaterThan(0)
      for (const attrs of links) {
        const href = /href="([^"]+)"/.exec(attrs)?.[1] ?? ''
        if (href.startsWith('https://')) {
          expect(attrs, href).toContain('target="_blank"')
          expect(attrs, href).toContain('rel="noopener"')
        } else if (href.startsWith('/blog/')) {
          expect(blogSlugs, href).toContain(href.slice('/blog/'.length))
        } else if (href.startsWith('/encyclopedia/')) {
          expect(encyclopediaSlugs, href).toContain(href.slice('/encyclopedia/'.length))
        } else {
          throw new Error(`${post.slug}: unexpected link ${href}`)
        }
      }
    }
  })
})

// ============================================
// Helpers
// ============================================
describe('getCodeBlogPost', () => {
  it('finds a code post by slug and returns null otherwise', () => {
    const first = CODE_BLOG_POSTS[0]!
    expect(getCodeBlogPost(first.slug)?.title).toBe(first.title)
    expect(getCodeBlogPost('no-such-post')).toBeNull()
  })
})

describe('codeBlogPostSummaries', () => {
  it('drops the full text but keeps everything a blog card needs', () => {
    for (const summary of codeBlogPostSummaries()) {
      expect(summary).not.toHaveProperty('content')
      expect(summary.title).toBeTruthy()
      expect(summary.slug).toBeTruthy()
    }
  })
})

describe('mergeBlogPosts', () => {
  const db = [
    { slug: 'old', publishedAt: '2026-02-13T00:00:00.000Z', from: 'db' },
    { slug: 'clash', publishedAt: '2026-02-14T00:00:00.000Z', from: 'db' },
  ]
  const code = [
    { slug: 'new', publishedAt: '2026-11-11T03:00:00.000Z', from: 'code' },
    { slug: 'clash', publishedAt: '2026-03-01T00:00:00.000Z', from: 'code' },
  ]

  it('sorts newest first', () => {
    expect(mergeBlogPosts(db, code).map((p) => p.slug)).toEqual(['new', 'clash', 'old'])
  })

  it('keeps the code post when a slug exists in both', () => {
    const merged = mergeBlogPosts(db, code)
    expect(merged.filter((p) => p.slug === 'clash')).toEqual([code[1]])
  })

  it('accepts Date objects from the database driver', () => {
    const merged = mergeBlogPosts(
      [{ slug: 'd', publishedAt: new Date('2026-12-01T00:00:00Z') }],
      [{ slug: 'c', publishedAt: '2026-11-01T00:00:00Z' }],
    )
    expect(merged.map((p) => p.slug)).toEqual(['d', 'c'])
  })
})

// ============================================
// The blog API function (database mocked)
// ============================================
const sqlMock = vi.fn()
vi.mock('@neondatabase/serverless', () => ({ neon: () => sqlMock }))

const dbRow = {
  id: 1,
  slug: 'welcome-to-firehorse',
  title: 'Welcome',
  excerpt: 'Hello',
  cover_image: null,
  author_name: 'FireHorse Team',
  tags: ['news'],
  read_time: 3,
  published_at: '2026-02-13T00:00:00.000Z',
}

async function callApi(query: string) {
  const { default: handler } = await import('../../../netlify/functions/blog-posts')
  const response = await handler(new Request(`https://firehorse.info/api/blog/posts${query}`), {} as never)
  return { status: response.status, body: await response.json() }
}

describe('GET /api/blog/posts', () => {
  beforeEach(() => {
    sqlMock.mockReset()
    process.env.DATABASE_URL = 'postgres://test'
  })

  it('serves a code post by slug without touching the database', async () => {
    const post = CODE_BLOG_POSTS[0]!
    const { status, body } = await callApi(`?slug=${post.slug}`)
    expect(status).toBe(200)
    expect(body.title).toBe(post.title)
    expect(body.content).toBe(post.content)
    expect(sqlMock).not.toHaveBeenCalled()
  })

  it('still serves database posts by slug, and 404s for unknown slugs', async () => {
    sqlMock.mockResolvedValueOnce([{ ...dbRow, content: '<p>Hi</p>' }])
    const found = await callApi('?slug=welcome-to-firehorse')
    expect(found.status).toBe(200)
    expect(found.body.authorName).toBe('FireHorse Team')

    sqlMock.mockResolvedValueOnce([])
    expect((await callApi('?slug=nope')).status).toBe(404)
  })

  it('lists code and database posts together, newest first, without full text', async () => {
    sqlMock.mockResolvedValueOnce([dbRow])
    const { status, body } = await callApi('?page=1')
    expect(status).toBe(200)
    expect(body.total).toBe(CODE_BLOG_POSTS.length + 1)
    expect(body.totalPages).toBe(1)
    expect(body.posts[body.posts.length - 1].slug).toBe('welcome-to-firehorse')
    for (const post of body.posts) expect(post).not.toHaveProperty('content')
  })

  it('treats a bad page number as page 1', async () => {
    sqlMock.mockResolvedValueOnce([dbRow])
    const { body } = await callApi('?page=abc')
    expect(body.page).toBe(1)
    expect(body.posts.length).toBe(CODE_BLOG_POSTS.length + 1)
  })
})
