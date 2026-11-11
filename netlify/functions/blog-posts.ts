import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
// Relative import: the `@/` alias only works in Vite, not in the functions bundle
import { codeBlogPostSummaries, getCodeBlogPost, mergeBlogPosts } from '../../src/content/blog-posts.mjs'

/** Posts per page (BlogPage.vue uses the same number) */
const PAGE_SIZE = 12

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    // Single post by slug. Code posts (src/content/blog-posts.mjs) need no database.
    if (slug) {
      const codePost = getCodeBlogPost(slug)
      if (codePost) return json(codePost, 200)

      const sql = neon(process.env.DATABASE_URL!)
      const [post] = await sql`
        SELECT
          id,
          slug,
          title,
          excerpt,
          content,
          cover_image,
          author_name,
          tags,
          read_time,
          published_at,
          created_at
        FROM blog_posts
        WHERE slug = ${slug} AND is_published = true
      `

      if (!post) {
        return json({ error: 'Post not found' }, 404)
      }

      return json({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.cover_image,
        authorName: post.author_name,
        tags: post.tags,
        readTime: post.read_time,
        publishedAt: post.published_at
      }, 200)
    }

    // List of posts: every published database post (a handful of rows) merged
    // with the code posts, newest first, then one page of PAGE_SIZE.
    const pageNumber = parseInt(url.searchParams.get('page') || '1')
    const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1

    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql`
      SELECT
        id,
        slug,
        title,
        excerpt,
        cover_image,
        author_name,
        tags,
        read_time,
        published_at
      FROM blog_posts
      WHERE is_published = true
    `

    const databasePosts = rows.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.cover_image,
      authorName: post.author_name,
      tags: post.tags,
      readTime: post.read_time,
      publishedAt: post.published_at
    }))

    const allPosts = mergeBlogPosts(databasePosts, codeBlogPostSummaries())
    const total = allPosts.length

    return json({
      posts: allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE))
    }, 200)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return json({ error: 'Failed to fetch blog posts' }, 500)
  }
}

export const config = { path: "/api/blog/posts" }
