import type { Context } from "@netlify/functions"
import { neon } from '@neondatabase/serverless'
import Stripe from 'stripe'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Stripe signature verification failed:', err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Only process paid sessions
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const userId = session.client_reference_id
    if (!userId) {
      console.error('No client_reference_id on checkout session:', session.id)
      return new Response(JSON.stringify({ error: 'Missing user reference' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const sql = neon(process.env.DATABASE_URL!)

    try {
      await sql`
        UPDATE users
        SET is_paid_member = true, updated_at = NOW()
        WHERE id = ${userId}
      `
      console.log(`User ${userId} upgraded to paid member via Stripe session ${session.id}`)
    } catch (error) {
      console.error('Failed to update user membership:', error)
      return new Response(JSON.stringify({ error: 'Database update failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const config = { path: "/api/stripe-webhook" }
