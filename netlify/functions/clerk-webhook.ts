import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import { createHmac, timingSafeEqual } from 'crypto'

// Verify Clerk webhook signature using HMAC (no external deps)
function verifyWebhook(payload: string, headers: Headers, secret: string): boolean {
  const svixId = headers.get('svix-id')
  const svixTimestamp = headers.get('svix-timestamp')
  const svixSignature = headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) return false

  // Reject if timestamp is older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(svixTimestamp)) > 300) return false

  // Clerk webhook secrets start with "whsec_" — strip prefix and decode base64
  const secretBytes = Buffer.from(secret.replace('whsec_', ''), 'base64')
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest('base64')

  // svix-signature can have multiple sigs like "v1,abc v1,def" — check each
  const signatures = svixSignature.split(' ')
  for (const sig of signatures) {
    const sigValue = sig.split(',')[1]
    if (!sigValue) continue
    try {
      const a = Buffer.from(expected)
      const b = Buffer.from(sigValue)
      if (a.length === b.length && timingSafeEqual(a, b)) return true
    } catch {
      continue
    }
  }

  return false
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    console.error('CLERK_WEBHOOK_SECRET not set')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const payload = await req.text()

  if (!verifyWebhook(payload, req.headers, secret)) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const event = JSON.parse(payload)
  const sql = neon(process.env.DATABASE_URL!)

  try {
    switch (event.type) {
      case 'user.created': {
        const { id, first_name, last_name, username, image_url } = event.data
        const displayName = username || [first_name, last_name].filter(Boolean).join(' ') || 'User'

        await sql`
          INSERT INTO users (clerk_id, username, avatar_url)
          VALUES (${id}, ${displayName}, ${image_url})
          ON CONFLICT (clerk_id) DO NOTHING
        `
        break
      }

      case 'user.updated': {
        const { id, first_name, last_name, username, image_url } = event.data
        const displayName = username || [first_name, last_name].filter(Boolean).join(' ') || 'User'

        await sql`
          UPDATE users
          SET username = ${displayName}, avatar_url = ${image_url}, updated_at = NOW()
          WHERE clerk_id = ${id}
        `
        break
      }

      case 'user.deleted': {
        const { id } = event.data
        await sql`DELETE FROM users WHERE clerk_id = ${id}`
        break
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: "/api/clerk-webhook" }
