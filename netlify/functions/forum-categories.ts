import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    const categories = await sql`
      SELECT
        fc.id,
        fc.name,
        fc.slug,
        fc.description,
        fc.icon,
        fc.sort_order,
        COALESCE(COUNT(DISTINCT ft.id), 0)::int AS thread_count,
        COALESCE(COUNT(DISTINCT fp.id), 0)::int AS post_count
      FROM forum_categories fc
      LEFT JOIN forum_threads ft ON fc.id = ft.category_id
      LEFT JOIN forum_posts fp ON ft.id = fp.thread_id
      GROUP BY fc.id, fc.name, fc.slug, fc.description, fc.icon, fc.sort_order
      ORDER BY fc.sort_order ASC
    `

    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      threadCount: cat.thread_count,
      postCount: cat.post_count
    }))

    return new Response(JSON.stringify(formattedCategories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching forum categories:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: "/api/forum/categories" }
