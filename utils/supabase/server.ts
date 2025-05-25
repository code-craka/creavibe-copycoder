import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from "@/utils/supabase/types"

/**
 * Creates a Supabase client for server-side usage
 * This version doesn't rely on cookies() from next/headers
 * which makes it compatible with both app router and pages router
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}

/**
 * Creates a Supabase client for server components
 * This is kept for backward compatibility but uses the standard client
 */
export function createServerComponentClient(cookieStore: any) {
  return createClient()
}
