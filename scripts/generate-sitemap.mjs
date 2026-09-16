#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

// Load .env.local if present (Netlify build supplies env vars directly).
if (existsSync('.env.local')) {
  for (const raw of readFileSync('.env.local', 'utf-8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

const BASE = 'https://firehorse.info'

// Keep in sync with src/lib/encyclopedia-data.ts
const ENCYCLOPEDIA_SLUGS = [
  'origin-of-the-fire-horse',
  'fire-horse-personality-traits',
  'the-1966-hinoeuma-phenomenon',
  'fire-horse-chinese-culture',
  'fire-horse-japanese-culture',
  'famous-fire-horses',
  'fire-horse-myths-superstitions',
  '2026-next-fire-horse-generation',
]

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/encyclopedia', changefreq: 'weekly', priority: '0.8' },
  { path: '/compatibility', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
]

const today = new Date().toISOString().split('T')[0]

async function fetchBlogPosts() {
  if (!process.env.DATABASE_URL) {
    console.warn('[sitemap] DATABASE_URL not set — sitemap will omit blog posts')
    return []
  }
  try {
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`
      SELECT slug, published_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC
    `
    return rows
  } catch (err) {
    console.warn('[sitemap] failed to query blog_posts:', err.message)
    return []
  }
}

function urlBlock(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const blogPosts = await fetchBlogPosts()

  const blocks = [
    ...STATIC_ROUTES.map((r) =>
      urlBlock(BASE + r.path, today, r.changefreq, r.priority),
    ),
    ...ENCYCLOPEDIA_SLUGS.map((slug) =>
      urlBlock(`${BASE}/encyclopedia/${slug}`, today, 'monthly', '0.7'),
    ),
    ...blogPosts.map((p) => {
      const lastmod =
        p.published_at instanceof Date
          ? p.published_at.toISOString().split('T')[0]
          : (p.published_at || today).toString().split('T')[0]
      return urlBlock(`${BASE}/blog/${p.slug}`, lastmod, 'monthly', '0.6')
    }),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blocks.join('\n')}
</urlset>
`

  writeFileSync('public/sitemap.xml', xml)
  console.log(
    `[sitemap] wrote ${blocks.length} URLs to public/sitemap.xml (${blogPosts.length} blog posts)`,
  )
}

main().catch((err) => {
  console.error('[sitemap] fatal:', err)
  process.exit(1)
})
