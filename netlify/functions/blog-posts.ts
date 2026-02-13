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
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    // Single post by slug
    if (slug) {
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
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const formattedPost = {
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
      }

      return new Response(JSON.stringify(formattedPost), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // List of posts
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = 12
    const offset = (page - 1) * limit

    const posts = await sql`
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
      ORDER BY published_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM blog_posts
      WHERE is_published = true
    `

    const formattedPosts = posts.map(post => ({
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
    console.error('Error fetching blog posts:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch blog posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: "/api/blog/posts" }
