import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import { getVerifiedClerkUserId } from './utils/auth'

export default async (req: Request, context: Context) => {
  const sql = neon(process.env.DATABASE_URL!)
  const url = new URL(req.url)

  // GET - Fetch posts for a thread
  if (req.method === 'GET') {
    try {
      const threadId = url.searchParams.get('thread')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = 20
      const offset = (page - 1) * limit

      if (!threadId) {
        return new Response(JSON.stringify({ error: 'Thread ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Get current user for vote status
      const clerkId = await getVerifiedClerkUserId(req)
      let currentUserId: string | null = null

      if (clerkId) {
        const [user] = await sql`
          SELECT id FROM users WHERE clerk_id = ${clerkId}
        `
        currentUserId = user?.id || null
      }

      // Increment view count
      await sql`
        UPDATE forum_threads
        SET view_count = view_count + 1
        WHERE id = ${threadId}
      `

      // Get posts with user vote status
      const posts = await sql`
        SELECT
          fp.id,
          fp.thread_id,
          fp.content,
          fp.upvotes,
          fp.downvotes,
          fp.created_at,
          fp.updated_at,
          u.id AS author_id,
          u.username AS author_name,
          u.avatar_url AS author_avatar,
          ${currentUserId ? sql`
            (SELECT vote_type FROM post_votes
             WHERE post_id = fp.id AND user_id = ${currentUserId}
            ) AS user_vote
          ` : sql`NULL AS user_vote`}
        FROM forum_posts fp
        JOIN users u ON fp.author_id = u.id
        WHERE fp.thread_id = ${threadId}
        ORDER BY fp.created_at ASC
        LIMIT ${limit}
        OFFSET ${offset}
      `

      // Get total count
      const [{ count }] = await sql`
        SELECT COUNT(*)::int AS count
        FROM forum_posts
        WHERE thread_id = ${threadId}
      `

      const formattedPosts = posts.map(post => ({
        id: post.id,
        threadId: post.thread_id,
        authorId: post.author_id,
        authorName: post.author_name,
        authorAvatar: post.author_avatar,
        content: post.content,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        userVote: post.user_vote
      }))

      return new Response(JSON.stringify({
        posts: formattedPosts,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // POST - Create new post
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
      const { threadId, content } = body

      if (!threadId || !content) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Check if thread exists and is not locked
      const [thread] = await sql`
        SELECT is_locked FROM forum_threads WHERE id = ${threadId}
      `

      if (!thread) {
        return new Response(JSON.stringify({ error: 'Thread not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (thread.is_locked) {
        return new Response(JSON.stringify({ error: 'Thread is locked' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Create post
      const [post] = await sql`
        INSERT INTO forum_posts (thread_id, author_id, content)
        VALUES (${threadId}, ${user.id}, ${content})
        RETURNING id
      `

      // Update thread's last_post_at
      await sql`
        UPDATE forum_threads
        SET last_post_at = NOW()
        WHERE id = ${threadId}
      `

      return new Response(JSON.stringify({
        success: true,
        postId: post.id
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error creating post:', error)
      return new Response(JSON.stringify({ error: 'Failed to create post' }), {
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

export const config = { path: "/api/forum/posts" }
