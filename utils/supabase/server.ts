import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for server-side use with cookies
 * This implementation follows the latest Next.js and Supabase recommendations
 */
export function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          try {
            const cookieStore = await cookies()
            return cookieStore.get(name)?.value
          } catch (error) {
            // Handle any errors that might occur when accessing cookies
            console.error('Error accessing cookie:', error)
            return undefined
          }
        },
        async set(name, value, options) {
          try {
            const cookieStore = await cookies()
            cookieStore.set(name, value, options)
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        async remove(name, options) {
          try {
            const cookieStore = await cookies()
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}
