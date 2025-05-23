import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import type { CookieOptions } from "@supabase/ssr"

type Cookie = {
  name: string
  value: string
  options?: CookieOptions
}

// Ensure environment variables are properly typed and handled
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
  }
  return url
}

const getAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  }
  return key
}

const getServiceRoleKey = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }
  return key
}

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
  const cookieOptions = getCookieOptions()

  // This function should only be called in a server context
  // Dynamically import cookies to avoid issues with client components
  const { cookies } = require('next/headers')

  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getServiceRoleKey(),
    {
      cookies: {
        getAll: async () => {
          try {
            const cookieStore = await cookies()
            const allCookies = await cookieStore.getAll()
            return allCookies.map((cookie: { name: string; value: string }) => ({
              name: cookie.name,
              value: cookie.value
            }))
          } catch (error) {
            console.error('Error getting cookies:', error)
            return []
          }
        },
        setAll: async (cookiesList: Array<{ name: string; value: string; options?: any }>) => {
          try {
            const cookieStore = await cookies()
            for (const cookie of cookiesList) {
              cookieStore.set({
                name: cookie.name,
                value: cookie.value,
                ...cookieOptions,
                ...(cookie.options || {})
              })
            }
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
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

  // This function should only be called in a server context
  // Dynamically import cookies to avoid issues with client components
  const { cookies } = require('next/headers')

  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getAnonKey(),
    {
      cookies: {
        getAll: async () => {
          try {
            const cookieStore = await cookies()
            const allCookies = await cookieStore.getAll()
            return allCookies.map((cookie: { name: string; value: string }) => ({
              name: cookie.name,
              value: cookie.value
            }))
          } catch (error) {
            console.error('Error getting cookies:', error)
            return []
          }
        },
        setAll: async (cookiesList: Array<{ name: string; value: string; options?: any }>) => {
          try {
            const cookieStore = await cookies()
            for (const cookie of cookiesList) {
              cookieStore.set({
                name: cookie.name,
                value: cookie.value,
                ...cookieOptions,
                ...(cookie.options || {})
              })
            }
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

// Browser client has been moved to browser-client.ts

/**
 * Creates a Supabase client for server actions
 * Uses the anon key and respects RLS policies
 * Designed for use with form actions and other server mutations
 */
export function createServerActionClient({ cookies }: { cookies: () => Cookie[] }) {
  const cookieOptions = getCookieOptions()

  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getAnonKey(),
    {
      cookies: {
        getAll: () => {
          return cookies().map((cookie: Cookie) => ({
            name: cookie.name,
            value: cookie.value
          }))
        },
        setAll: (cookiesList: Array<{ name: string; value: string; options?: any }>) => {
          for (const cookie of cookiesList) {
            cookies().push({
              name: cookie.name,
              value: cookie.value,
              options: {
                ...cookieOptions,
                ...(cookie.options || {})
              }
            })
          }
        },
      }
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
