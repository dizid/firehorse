import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import Stripe from 'stripe'
import { getVerifiedClerkUserId } from './utils/auth'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const clerkId = await getVerifiedClerkUserId(req)
  if (!clerkId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    // Look up user and check if already paid
    const [user] = await sql`
      SELECT id, is_paid_member FROM users WHERE clerk_id = ${clerkId}
    `

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (user.is_paid_member) {
      return new Response(JSON.stringify({ error: 'Already a paid member' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create Stripe Checkout Session
    const origin = req.headers.get('origin') || 'https://firehorse.info'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: process.env.STRIPE_MEMBERSHIP_PRICE_ID!,
        quantity: 1,
      }],
      success_url: `${origin}/profile?payment=success`,
      cancel_url: `${origin}/profile?payment=cancelled`,
      client_reference_id: String(user.id),
      metadata: {
        clerk_id: clerkId,
        user_id: String(user.id),
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: "/api/checkout/create" }
