import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import { getVerifiedClerkUserId } from './utils/auth'

export default async (req: Request, context: Context) => {
  const clerkId = await getVerifiedClerkUserId(req)
  if (!clerkId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const sql = neon(process.env.DATABASE_URL!)

  // GET - Fetch user profile
  if (req.method === 'GET') {
    try {
      const [user] = await sql`
        SELECT
          u.id,
          u.clerk_id,
          u.username,
          u.avatar_url,
          u.zodiac_animal,
          u.zodiac_element,
          u.birth_year,
          u.is_paid_member,
          u.created_at,
          COALESCE(COUNT(DISTINCT ft.id), 0)::int AS thread_count,
          COALESCE(COUNT(DISTINCT fp.id), 0)::int AS post_count
        FROM users u
        LEFT JOIN forum_threads ft ON u.id = ft.author_id
        LEFT JOIN forum_posts fp ON u.id = fp.author_id
        WHERE u.clerk_id = ${clerkId}
        GROUP BY u.id
      `

      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const profile = {
        id: user.id,
        clerkId: user.clerk_id,
        username: user.username,
        avatar: user.avatar_url,
        zodiacAnimal: user.zodiac_animal,
        zodiacElement: user.zodiac_element,
        birthYear: user.birth_year,
        isPaidMember: user.is_paid_member,
        joinedAt: user.created_at,
        postCount: user.post_count,
        threadCount: user.thread_count
      }

      return new Response(JSON.stringify(profile), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // PUT - Update user profile
  if (req.method === 'PUT') {
    try {
      const body = await req.json()
      const { username, zodiacAnimal, zodiacElement, birthYear, avatarUrl } = body

      // Build update query dynamically based on provided fields
      const updates: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (username !== undefined) {
        updates.push(`username = $${paramIndex++}`)
        values.push(username)
      }
      if (zodiacAnimal !== undefined) {
        updates.push(`zodiac_animal = $${paramIndex++}`)
        values.push(zodiacAnimal)
      }
      if (zodiacElement !== undefined) {
        updates.push(`zodiac_element = $${paramIndex++}`)
        values.push(zodiacElement)
      }
      if (birthYear !== undefined) {
        updates.push(`birth_year = $${paramIndex++}`)
        values.push(birthYear)
      }
      if (avatarUrl !== undefined) {
        updates.push(`avatar_url = $${paramIndex++}`)
        values.push(avatarUrl)
      }

      updates.push(`updated_at = NOW()`)

      if (updates.length === 1) {
        return new Response(JSON.stringify({ error: 'No fields to update' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Execute update
      const [updated] = await sql`
        UPDATE users
        SET
          ${username !== undefined ? sql`username = ${username},` : sql``}
          ${zodiacAnimal !== undefined ? sql`zodiac_animal = ${zodiacAnimal},` : sql``}
          ${zodiacElement !== undefined ? sql`zodiac_element = ${zodiacElement},` : sql``}
          ${birthYear !== undefined ? sql`birth_year = ${birthYear},` : sql``}
          ${avatarUrl !== undefined ? sql`avatar_url = ${avatarUrl},` : sql``}
          updated_at = NOW()
        WHERE clerk_id = ${clerkId}
        RETURNING id
      `

      if (!updated) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Profile updated successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
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

export const config = { path: "/api/user/profile" }
