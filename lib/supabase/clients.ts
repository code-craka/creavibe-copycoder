import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ADMIN_OPERATIONS } from "./config"

// Cache for server component clients to improve performance
let serverClientCache: ReturnType<typeof createServerComponentClient> | null = null
let adminClientCache: ReturnType<typeof createAdminClient> | null = null

/**
 * Creates a Supabase client for server components and server actions
 * Uses the service role key for admin operations
 * CAUTION: This bypasses RLS policies - use only when necessary
 */
export function createAdminClient() {
  // Use cached client if available (improves performance for multiple calls)
  if (adminClientCache) return adminClientCache

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not defined. This is required for admin operations. Check your environment variables.",
    )
  }

  const cookieStore = cookies()

  const client = createServerClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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

  // Cache the client for future use
  adminClientCache = client
  return client
}

/**
 * Creates a Supabase client for server components and server actions
 * Uses the anon key and respects RLS policies
 * Recommended for most server-side operations
 */
export function createServerComponentClient() {
  // Use cached client if available (improves performance for multiple calls)
  if (serverClientCache) return serverClientCache

  if (!SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Check your environment variables.")
  }

  const cookieStore = cookies()

  const client = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

  // Cache the client for future use
  serverClientCache = client
  return client
}

/**
 * Creates a Supabase client for client components
 * Uses the anon key and respects RLS policies
 */
export function createBrowserComponentClient() {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Check your environment variables.")
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: "supabase-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

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

/**
 * Safely executes a Supabase query with proper error handling
 * @param queryFn Function that executes the Supabase query
 * @returns Object with data, error, and status
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const { data, error } = await queryFn()

    if (error) {
      console.error("Supabase query error:", error)
      return {
        data: null,
        error: error.message || "An error occurred while executing the query",
        status: error.code === "PGRST116" ? 404 : error.code === "42501" ? 403 : 500,
      }
    }

    return { data, error: null, status: 200 }
  } catch (err: any) {
    console.error("Unexpected error during Supabase query:", err)
    return {
      data: null,
      error: err.message || "An unexpected error occurred",
      status: 500,
    }
  }
}
