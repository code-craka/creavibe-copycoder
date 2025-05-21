import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Initialize the Supabase admin client with service role key
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase admin environment variables")
}

// This client should only be used in server contexts (API routes, Server Components, server actions)
// as it has admin privileges
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})
