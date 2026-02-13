import { neon } from '@neondatabase/serverless'

// Create a reusable SQL tagged template function
// Used in Netlify Functions (server-side only)
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return neon(databaseUrl)
}
