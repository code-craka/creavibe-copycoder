import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Environment variable validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// We don't throw here because this is only needed for admin operations

// Cookie configuration
const getCookieOptions = () => ({
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: "/",
  sameSite: "lax" as const,
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

  const cookieStore = cookies()
  const cookieOptions = getCookieOptions()

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({
          name,
          value,
          ...cookieOptions,
          ...options,
        })
      },
      remove(name: string, options: any) {
        cookieStore.set({
          name,
          value: "",
          ...cookieOptions,
          ...options,
          maxAge: 0,
        })
      },
    },
    auth: {
      persistSession: true,
    },
  })
}

/**
 * Creates a Supabase client for server components and server actions
 * Uses the anon key and respects RLS policies
 * Recommended for most server-side operations
 */
export function createServerComponentClient() {
  const cookieStore = cookies()
  const cookieOptions = getCookieOptions()

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({
          name,
          value,
          ...cookieOptions,
          ...options,
        })
      },
      remove(name: string, options: any) {
        cookieStore.set({
          name,
          value: "",
          ...cookieOptions,
          ...options,
          maxAge: 0,
        })
      },
    },
    auth: {
      persistSession: true,
    },
  })
}

/**
 * Creates a Supabase client for client components
 * Uses the anon key and respects RLS policies
 */
export function createBrowserComponentClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: "supabase-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
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
