import { createAdminClient } from "./clients"

/**
 * Helper function to create RLS policies for a table
 * @param tableName The name of the table to create policies for
 * @param policies Array of policy configurations
 */
export async function createRLSPolicies(
  tableName: string,
  policies: {
    name: string
    definition: string
    check: string
    using?: string
    operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL"
  }[],
) {
  const supabase = createAdminClient()

  // Enable RLS on the table
  await supabase.rpc("enable_rls", { table_name: tableName })

  // Create each policy
  for (const policy of policies) {
    const { name, definition, check, using, operation } = policy

    // Construct the SQL statement
    let sql = `CREATE POLICY "${name}" ON "${tableName}" FOR ${operation}`

    if (using) {
      sql += ` USING (${using})`
    }

    if (check) {
      sql += ` WITH CHECK (${check})`
    }

    // Execute the SQL
    await supabase.rpc("execute_sql", { sql })
  }

  return { success: true }
}

/**
 * Example function to set up RLS policies for the profiles table
 */
export async function setupProfilesRLSPolicies() {
  return createRLSPolicies("profiles", [
    {
      name: "Users can view their own profile",
      definition: "Allow users to view their own profile",
      using: "auth.uid() = id",
      operation: "SELECT",
    },
    {
      name: "Users can update their own profile",
      definition: "Allow users to update their own profile",
      using: "auth.uid() = id",
      check: "auth.uid() = id",
      operation: "UPDATE",
    },
    {
      name: "Public profiles are viewable by everyone",
      definition: "Allow public profiles to be viewed by anyone",
      using: "public = true",
      operation: "SELECT",
    },
  ])
}

/**
 * Example function to set up RLS policies for the api_tokens table
 */
export async function setupApiTokensRLSPolicies() {
  return createRLSPolicies("api_tokens", [
    {
      name: "Users can view their own tokens",
      definition: "Allow users to view their own API tokens",
      using: "auth.uid() = user_id",
      operation: "SELECT",
    },
    {
      name: "Users can create their own tokens",
      definition: "Allow users to create their own API tokens",
      check: "auth.uid() = user_id",
      operation: "INSERT",
    },
    {
      name: "Users can update their own tokens",
      definition: "Allow users to update their own API tokens",
      using: "auth.uid() = user_id",
      check: "auth.uid() = user_id",
      operation: "UPDATE",
    },
    {
      name: "Users can delete their own tokens",
      definition: "Allow users to delete their own API tokens",
      using: "auth.uid() = user_id",
      operation: "DELETE",
    },
  ])
}

/**
 * Example function to set up RLS policies for the api_usage table
 */
export async function setupApiUsageRLSPolicies() {
  return createRLSPolicies("api_usage", [
    {
      name: "Users can view usage for their own tokens",
      definition: "Allow users to view API usage for their own tokens",
      using: "auth.uid() IN (SELECT user_id FROM api_tokens WHERE id = token_id)",
      operation: "SELECT",
    },
    {
      name: "System can insert usage records",
      definition: "Allow the system to insert API usage records",
      check: "true", // This would typically be restricted by application logic
      operation: "INSERT",
    },
  ])
}
