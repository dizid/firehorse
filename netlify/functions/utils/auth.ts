import { verifyToken } from '@clerk/backend'

/**
 * Verify the Clerk JWT from the Authorization header and return the user's Clerk ID.
 * Returns null if no token is present or verification fails.
 *
 * Uses CLERK_JWT_KEY for networkless verification when available (~1ms).
 * Falls back to CLERK_SECRET_KEY + JWKS fetch from Clerk API.
 */
export async function getVerifiedClerkUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null

  const token = auth.split(' ')[1]
  if (!token) return null

  try {
    const payload = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: ['https://firehorse.info'],
    })

    return payload.sub || null
  } catch (error) {
    console.error('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
