import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../../types/supabase"
import type { CookieOptions } from "@supabase/ssr"

type Cookie = {
  name: string
  value: string
  options?: CookieOptions
}

// Environment variable validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
if (!SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

// Cookie configuration
const getCookieOptions = (): Partial<CookieOptions> => ({
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
})

/**
 * Creates a Supabase client for server components and server actions
 * Uses the service role key for admin operations
 * CAUTION: This bypasses RLS policies - use only when necessary
 */
export function createAdminClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not defined. This is required for admin operations. Check your environment variables.",
    )
  }

  const cookieOptions = getCookieOptions()

  return createSupabaseServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => {
          try {
            const cookieStore = cookies() as any
            return Object.fromEntries(
              [...cookieStore.getAll()].map((cookie) => [cookie.name, cookie.value])
            )
          } catch (error) {
            console.error('Error getting cookies:', error)
            return {}
          }
        },
        setAll: (cookiesList: Cookie[]) => {
          try {
            const cookieStore = cookies() as any
            cookiesList.forEach((cookie: Cookie) => {
              cookieStore.set({
                name: cookie.name,
                value: cookie.value,
                ...cookieOptions,
                ...cookie.options
              })
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}

/**
 * Creates a Supabase client for server components and server actions
 * Uses the anon key and respects RLS policies
 * Recommended for most server-side operations
 */
export function createServerComponentClient() {
  const cookieOptions = getCookieOptions()

  // Ensure we have a valid ANON key
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not defined or is empty")
  }

  return createSupabaseServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => {
          try {
            const cookieStore = cookies() as any
            return Object.fromEntries(
              [...cookieStore.getAll()].map((cookie) => [cookie.name, cookie.value])
            )
          } catch (error) {
            console.error('Error getting cookies:', error)
            return {}
          }
        },
        setAll: (cookiesList: Cookie[]) => {
          try {
            const cookieStore = cookies() as any
            cookiesList.forEach((cookie: Cookie) => {
              cookieStore.set({
                name: cookie.name,
                value: cookie.value,
                ...cookieOptions,
                ...cookie.options
              })
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}

/**
 * Creates a Supabase client for client components
 * Uses the anon key and respects RLS policies
 */
export function createBrowserComponentClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is not defined')
  }
  
  return createSupabaseClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}

// Operation types that require admin privileges
const ADMIN_OPERATIONS = [
  "user:create",
  "user:delete",
  "user:impersonate",
  "system:config",
  "logs:access",
  "billing:manage",
  "api:reset",
  "database:schema",
]

/**
 * Determines if the current operation requires admin privileges
 * Use this to decide which client to create
 */
export function requiresAdminPrivileges(operation: string): boolean {
  return ADMIN_OPERATIONS.includes(operation)
}

/**
 * Factory function that returns the appropriate client based on the operation
 * This helps ensure the principle of least privilege
 */
export function createClientForOperation(operation: string) {
  return requiresAdminPrivileges(operation) ? createAdminClient() : createServerComponentClient()
}
