import { createClient } from "@supabase/supabase-js"
import type { Database } from "../../types/supabase"

/**
 * Helper functions for working with Row Level Security (RLS) in Supabase
 * These functions help implement and test RLS policies
 */

/**
 * Get the current authenticated user's ID
 * This is useful in RLS policies to restrict access to user's own data
 */
export function getCurrentUserId() {
  return "auth.uid()"
}

/**
 * Check if the current user has a specific role
 * @param role The role to check for
 */
export function hasRole(role: string) {
  return `(SELECT role FROM auth.users WHERE id = auth.uid()) = '${role}'`
}

/**
 * Check if the current user has any of the specified roles
 * @param roles Array of roles to check
 */
export function hasAnyRole(roles: string[]) {
  const roleList = roles.map(role => `'${role}'`).join(", ")
  return `(SELECT role FROM auth.users WHERE id = auth.uid()) IN (${roleList})`
}

/**
 * Check if a record belongs to the current user
 * @param userIdColumn The column containing the user ID
 */
export function isOwner(userIdColumn: string) {
  return `${userIdColumn} = auth.uid()`
}

/**
 * Check if the current timestamp is within a specified range
 * @param startColumn Column containing the start timestamp
 * @param endColumn Column containing the end timestamp
 */
export function isWithinTimeRange(startColumn: string, endColumn: string) {
  return `${startColumn} <= now() AND (${endColumn} IS NULL OR ${endColumn} >= now())`
}

/**
 * Create a test client that impersonates a specific user
 * Useful for testing RLS policies
 * @param userId The user ID to impersonate
 */
export function createTestClientAsUser(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Service Role Key not defined")
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "X-Client-Info": `rls-test-client`,
      },
    },
  }).auth.setSession({
    access_token: userId,
    refresh_token: ""
  })
}
