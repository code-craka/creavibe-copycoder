import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

/**
 * Creates a Supabase client for server components and server actions
 * Uses the service role key for admin operations
 * CAUTION: This bypasses RLS policies - use only when necessary
 */
export function createAdminClient() {
  const cookieStore = cookies()

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
  }

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
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

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
      auth: {
        persistSession: true,
      },
    },
  )
}

/**
 * Creates a Supabase client for client components
 * Uses the anon key and respects RLS policies
 */
export function createBrowserComponentClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        storageKey: "supabase-auth",
      },
    },
  )
}

/**
 * Determines if the current operation requires admin privileges
 * Use this to decide which client to create
 */
export function requiresAdminPrivileges(operation: string): boolean {
  const adminOperations = [
    "user:create",
    "user:delete",
    "user:impersonate",
    "system:config",
    "logs:access",
    "billing:manage",
    // Add other admin operations as needed
  ]

  return adminOperations.includes(operation)
}

/**
 * Factory function that returns the appropriate client based on the operation
 * This helps ensure the principle of least privilege
 */
export function createClientForOperation(operation: string) {
  return requiresAdminPrivileges(operation) ? createAdminClient() : createServerComponentClient()
}
