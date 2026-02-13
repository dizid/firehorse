import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import { getVerifiedClerkUserId } from './utils/auth'

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const clerkId = await getVerifiedClerkUserId(req)
    if (!clerkId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get user
    const [user] = await sql`
      SELECT id FROM users WHERE clerk_id = ${clerkId}
    `

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { postId, voteType } = body

    if (!postId || !['up', 'down'].includes(voteType)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check existing vote
    const [existingVote] = await sql`
      SELECT vote_type FROM post_votes
      WHERE post_id = ${postId} AND user_id = ${user.id}
    `

    if (existingVote) {
      // If same vote, remove it
      if (existingVote.vote_type === voteType) {
        await sql`
          DELETE FROM post_votes
          WHERE post_id = ${postId} AND user_id = ${user.id}
        `

        // Decrement vote count
        if (voteType === 'up') {
          await sql`
            UPDATE forum_posts
            SET upvotes = GREATEST(0, upvotes - 1)
            WHERE id = ${postId}
          `
        } else {
          await sql`
            UPDATE forum_posts
            SET downvotes = GREATEST(0, downvotes - 1)
            WHERE id = ${postId}
          `
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'removed'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        // Switch vote type
        await sql`
          UPDATE post_votes
          SET vote_type = ${voteType}
          WHERE post_id = ${postId} AND user_id = ${user.id}
        `

        // Update vote counts (decrement old, increment new)
        if (voteType === 'up') {
          await sql`
            UPDATE forum_posts
            SET upvotes = upvotes + 1,
                downvotes = GREATEST(0, downvotes - 1)
            WHERE id = ${postId}
          `
        } else {
          await sql`
            UPDATE forum_posts
            SET downvotes = downvotes + 1,
                upvotes = GREATEST(0, upvotes - 1)
            WHERE id = ${postId}
          `
        }

        return new Response(JSON.stringify({
          success: true,
          action: 'switched'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      // Add new vote
      await sql`
        INSERT INTO post_votes (post_id, user_id, vote_type)
        VALUES (${postId}, ${user.id}, ${voteType})
      `

      // Increment vote count
      if (voteType === 'up') {
        await sql`
          UPDATE forum_posts
          SET upvotes = upvotes + 1
          WHERE id = ${postId}
        `
      } else {
        await sql`
          UPDATE forum_posts
          SET downvotes = downvotes + 1
          WHERE id = ${postId}
        `
      }

      return new Response(JSON.stringify({
        success: true,
        action: 'added'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error handling vote:', error)
    return new Response(JSON.stringify({ error: 'Failed to process vote' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: "/api/forum/vote" }
