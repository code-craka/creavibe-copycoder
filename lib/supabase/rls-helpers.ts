import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a Supabase client with RLS enabled
export const createRLSClient = (supabaseUrl: string, supabaseKey: string, userId?: string) => {
  const client = createClient<Database>(supabaseUrl, supabaseKey)

  // If userId is provided, set the user context for RLS policies
  if (userId) {
    // This sets the user ID for RLS policies
    client.auth.setAuth(userId)
  }

  return client
}

// Helper function to validate that a user can only access their own data
export const validateUserAccess = async (
  supabase: any,
  table: string,
  recordId: string,
  userId: string,
): Promise<boolean> => {
  const { data, error } = await supabase.from(table).select("user_id").eq("id", recordId).single()

  if (error || !data) {
    return false
  }

  return data.user_id === userId
}

// Example RLS policy for projects table
/*
CREATE POLICY "Users can only view their own projects" 
ON projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own projects" 
ON projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own projects" 
ON projects
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own projects" 
ON projects
FOR DELETE
USING (auth.uid() = user_id);
*/
