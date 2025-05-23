import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variable validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
if (!SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

/**
 * Creates a Supabase client for client components
 * Uses the anon key and respects RLS policies
 */
export function createBrowserComponentClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is not defined')
  }
  
  return createClient<Database>(
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
