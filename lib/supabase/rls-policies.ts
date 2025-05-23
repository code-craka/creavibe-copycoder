import { createAdminClient } from "./clients"

/**
 * Functions for managing Row Level Security (RLS) policies in Supabase
 * These functions help create, update, and apply RLS policies to tables
 */

/**
 * Apply RLS policies to a table
 * @param tableName The name of the table to apply policies to
 * @param enableRLS Whether to enable RLS on the table
 */
export async function applyRLSToTable(tableName: string, enableRLS = true) {
  const supabase = createAdminClient()
  
  // Enable or disable RLS on the table
  const rlsStatus = enableRLS ? "ENABLE" : "DISABLE"
  const { error } = await supabase.rpc("execute_sql", {
    sql: `ALTER TABLE "${tableName}" ${rlsStatus} ROW LEVEL SECURITY;`
  })
  
  if (error) {
    console.error(`Error applying RLS to table ${tableName}:`, error)
    throw new Error(`Failed to apply RLS to table ${tableName}: ${error.message}`)
  }
  
  return { success: true, tableName, rlsEnabled: enableRLS }
}

/**
 * Create an RLS policy for a table
 * @param options Policy options
 */
export async function createRLSPolicy(options: {
  tableName: string
  policyName: string
  operation: "ALL" | "SELECT" | "INSERT" | "UPDATE" | "DELETE"
  using?: string
  check?: string
  withCheck?: string
}) {
  const { tableName, policyName, operation, using, check, withCheck } = options
  const supabase = createAdminClient()
  
  let sql = `CREATE POLICY "${policyName}" ON "${tableName}" FOR ${operation}`
  
  if (using) {
    sql += ` USING (${using})`
  }
  
  if (check) {
    sql += ` WITH CHECK (${check})`
  } else if (withCheck) {
    sql += ` WITH CHECK (${withCheck})`
  }
  
  sql += ";"
  
  const { error } = await supabase.rpc("execute_sql", { sql })
  
  if (error) {
    console.error(`Error creating RLS policy ${policyName} on table ${tableName}:`, error)
    throw new Error(`Failed to create RLS policy: ${error.message}`)
  }
  
  return { success: true, tableName, policyName, operation }
}

/**
 * Drop an RLS policy from a table
 * @param tableName The name of the table
 * @param policyName The name of the policy to drop
 */
export async function dropRLSPolicy(tableName: string, policyName: string) {
  const supabase = createAdminClient()
  
  const { error } = await supabase.rpc("execute_sql", {
    sql: `DROP POLICY IF EXISTS "${policyName}" ON "${tableName}";`
  })
  
  if (error) {
    console.error(`Error dropping RLS policy ${policyName} from table ${tableName}:`, error)
    throw new Error(`Failed to drop RLS policy: ${error.message}`)
  }
  
  return { success: true, tableName, policyName }
}

/**
 * Apply common RLS policies to a user-owned table
 * This creates standard policies for user data:
 * - Users can read their own data
 * - Users can insert their own data
 * - Users can update their own data
 * - Users can delete their own data
 * - Admins can do everything
 * 
 * @param tableName The name of the table
 * @param userIdColumn The column containing the user ID (default: 'user_id')
 */
export async function applyUserOwnedTablePolicies(tableName: string, userIdColumn = "user_id") {
  // Enable RLS on the table
  await applyRLSToTable(tableName, true)
  
  // Create policies
  const policies = [
    // Select policy - users can read their own data
    {
      tableName,
      policyName: `${tableName}_select_policy`,
      operation: "SELECT" as const,
      using: `(${userIdColumn} = auth.uid()) OR (auth.jwt() ->> 'role' = 'admin')`
    },
    // Insert policy - users can insert their own data
    {
      tableName,
      policyName: `${tableName}_insert_policy`,
      operation: "INSERT" as const,
      withCheck: `(${userIdColumn} = auth.uid()) OR (auth.jwt() ->> 'role' = 'admin')`
    },
    // Update policy - users can update their own data
    {
      tableName,
      policyName: `${tableName}_update_policy`,
      operation: "UPDATE" as const,
      using: `(${userIdColumn} = auth.uid()) OR (auth.jwt() ->> 'role' = 'admin')`
    },
    // Delete policy - users can delete their own data
    {
      tableName,
      policyName: `${tableName}_delete_policy`,
      operation: "DELETE" as const,
      using: `(${userIdColumn} = auth.uid()) OR (auth.jwt() ->> 'role' = 'admin')`
    }
  ]
  
  // Apply all policies
  for (const policy of policies) {
    await createRLSPolicy(policy)
  }
  
  return { success: true, tableName, policiesApplied: policies.length }
}
