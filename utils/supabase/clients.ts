import { createClient } from "./server"
import type { Database } from "./types"

// Re-export the createServerComponentClient function
export function createServerComponentClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY")
  }

  // Create a client that doesn't need cookies for server components
  return createClient()
}
