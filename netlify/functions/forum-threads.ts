import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import { getVerifiedClerkUserId } from './utils/auth'

export default async (req: Request, context: Context) => {
  const sql = neon(process.env.DATABASE_URL!)
  const url = new URL(req.url)

  // GET - Fetch threads for a category
  if (req.method === 'GET') {
    try {
      const categorySlug = url.searchParams.get('category')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = 20
      const offset = (page - 1) * limit

      if (!categorySlug) {
        return new Response(JSON.stringify({ error: 'Category slug required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Get category ID
      const [category] = await sql`
        SELECT id FROM forum_categories WHERE slug = ${categorySlug}
      `

      if (!category) {
        return new Response(JSON.stringify({ error: 'Category not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Get threads
      const threads = await sql`
        SELECT
          ft.id,
          ft.category_id,
          ft.title,
          ft.is_pinned,
          ft.is_locked,
          ft.view_count,
          ft.created_at,
          ft.updated_at,
          ft.last_post_at,
          u.id AS author_id,
          u.username AS author_name,
          u.avatar_url AS author_avatar,
          COALESCE(COUNT(DISTINCT fp.id), 0)::int AS post_count,
          (
            SELECT u2.username
            FROM forum_posts fp2
            JOIN users u2 ON fp2.author_id = u2.id
            WHERE fp2.thread_id = ft.id
            ORDER BY fp2.created_at DESC
            LIMIT 1
          ) AS last_post_author
        FROM forum_threads ft
        JOIN users u ON ft.author_id = u.id
        LEFT JOIN forum_posts fp ON ft.id = fp.thread_id
        WHERE ft.category_id = ${category.id}
        GROUP BY ft.id, u.id, u.username, u.avatar_url
        ORDER BY ft.is_pinned DESC, ft.last_post_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `

      // Get total count
      const [{ count }] = await sql`
        SELECT COUNT(*)::int AS count
        FROM forum_threads
        WHERE category_id = ${category.id}
      `

      const formattedThreads = threads.map(thread => ({
        id: thread.id,
        categoryId: thread.category_id,
        title: thread.title,
        authorId: thread.author_id,
        authorName: thread.author_name,
        authorAvatar: thread.author_avatar,
        createdAt: thread.created_at,
        updatedAt: thread.updated_at,
        postCount: thread.post_count,
        viewCount: thread.view_count,
        isPinned: thread.is_pinned,
        isLocked: thread.is_locked,
        lastPostAt: thread.last_post_at,
        lastPostAuthor: thread.last_post_author || thread.author_name
      }))

      return new Response(JSON.stringify({
        threads: formattedThreads,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error fetching threads:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch threads' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // POST - Create new thread
  if (req.method === 'POST') {
    try {
      const clerkId = await getVerifiedClerkUserId(req)
      if (!clerkId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Get user and check paid status
      const [user] = await sql`
        SELECT id, is_paid_member FROM users WHERE clerk_id = ${clerkId}
      `

      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (!user.is_paid_member) {
        return new Response(JSON.stringify({ error: 'Paid membership required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const body = await req.json()
      const { categorySlug, title, content } = body

      if (!categorySlug || !title || !content) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Get category
      const [category] = await sql`
        SELECT id FROM forum_categories WHERE slug = ${categorySlug}
      `

      if (!category) {
        return new Response(JSON.stringify({ error: 'Category not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Create thread
      const [thread] = await sql`
        INSERT INTO forum_threads (category_id, author_id, title, last_post_at)
        VALUES (${category.id}, ${user.id}, ${title}, NOW())
        RETURNING id
      `

      // Create first post
      await sql`
        INSERT INTO forum_posts (thread_id, author_id, content)
        VALUES (${thread.id}, ${user.id}, ${content})
      `

      return new Response(JSON.stringify({
        success: true,
        threadId: thread.id
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error creating thread:', error)
      return new Response(JSON.stringify({ error: 'Failed to create thread' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const config = { path: "/api/forum/threads" }
