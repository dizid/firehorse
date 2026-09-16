import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

// Load .env.local for the build-time SSG step (Netlify CI provides env vars directly)
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

async function getBlogSlugs(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    console.warn('[vite-ssg] DATABASE_URL not set — blog posts will not be prerendered')
    return []
  }
  try {
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`SELECT slug FROM blog_posts WHERE is_published = true`
    return rows.map((r: any) => r.slug as string)
  } catch (err) {
    console.warn('[vite-ssg] failed to query blog_posts:', (err as Error).message)
    return []
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), netlify()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // @ts-expect-error — ssgOptions is augmented onto UserConfig by vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    async includedRoutes(paths: string[]) {
      const blogSlugs = await getBlogSlugs()
      const dynamic = [
        ...ENCYCLOPEDIA_SLUGS.map((s) => `/encyclopedia/${s}`),
        ...blogSlugs.map((s) => `/blog/${s}`),
      ]
      // Drop dynamic placeholders + catch-all + dev-only routes; keep static paths + resolved dynamics
      const staticPaths = paths.filter(
        (p) =>
          !p.includes(':') &&
          !p.includes('pathMatch') &&
          !p.includes('*') &&
          p !== '/preview',
      )
      return [...staticPaths, ...dynamic]
    },
  },
})
