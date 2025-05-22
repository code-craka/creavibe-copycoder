"use server"

import { createServerComponentClient, createAdminClient, safeQuery } from "@/lib/supabase/clients"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import type { ApiToken, ApiUsage, ApiUsageMetrics, ApiEndpointMetrics, ApiStatusMetrics } from "@/types/api-tokens"

// Generate a secure API token
function generateToken(): string {
  return `ck_${uuidv4().replace(/-/g, "")}_${Date.now().toString(36)}`
}

// Create a new API token
export async function createApiToken(name: string): Promise<{ success: boolean; token?: ApiToken; error?: string }> {
  try {
    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the current user with safe query handling
    const { data: authData, error: authError } = await safeQuery(() => supabase.auth.getUser())

    if (authError || !authData?.user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    const user = authData.user

    // Validate input
    if (!name || name.trim().length === 0) {
      return { success: false, error: "Token name is required" }
    }

    // Generate a new token
    const token = generateToken()

    // Insert the token into the database with safe query handling
    const { data, error } = await safeQuery(() =>
      supabase
        .from("api_tokens")
        .insert({
          user_id: user.id,
          token,
          name: name.trim(),
          created_at: new Date().toISOString(),
          revoked: false,
        })
        .select()
        .single(),
    )

    if (error) {
      return { success: false, error }
    }

    revalidatePath("/api-keys")
    return { success: true, token: data as ApiToken }
  } catch (error: any) {
    console.error("Error creating API token:", error)
    return { success: false, error: error.message || "Failed to create API token" }
  }
}

// Get all API tokens for the current user
export async function getApiTokens(): Promise<{ success: boolean; tokens?: ApiToken[]; error?: string }> {
  try {
    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the current user with safe query handling
    const { data: authData, error: authError } = await safeQuery(() => supabase.auth.getUser())

    if (authError || !authData?.user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Get all tokens for the user with safe query handling
    // RLS policy will ensure only the user's tokens are returned
    const { data, error } = await safeQuery(() =>
      supabase.from("api_tokens").select("*").order("created_at", { ascending: false }),
    )

    if (error) {
      return { success: false, error }
    }

    return { success: true, tokens: data as ApiToken[] }
  } catch (error: any) {
    console.error("Error fetching API tokens:", error)
    return { success: false, error: error.message || "Failed to fetch API tokens" }
  }
}

// Revoke an API token
export async function revokeApiToken(tokenId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Input validation
    if (!tokenId) {
      return { success: false, error: "Token ID is required" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the current user with safe query handling
    const { data: authData, error: authError } = await safeQuery(() => supabase.auth.getUser())

    if (authError || !authData?.user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Update the token to be revoked with safe query handling
    // RLS policy will ensure only the user's tokens can be updated
    const { error } = await safeQuery(() => supabase.from("api_tokens").update({ revoked: true }).eq("id", tokenId))

    if (error) {
      return { success: false, error }
    }

    revalidatePath("/api-keys")
    return { success: true }
  } catch (error: any) {
    console.error("Error revoking API token:", error)
    return { success: false, error: error.message || "Failed to revoke API token" }
  }
}

// Get API usage for a specific token
export async function getApiUsage(tokenId: string): Promise<{ success: boolean; usage?: ApiUsage[]; error?: string }> {
  try {
    // Input validation
    if (!tokenId) {
      return { success: false, error: "Token ID is required" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the current user with safe query handling
    const { data: authData, error: authError } = await safeQuery(() => supabase.auth.getUser())

    if (authError || !authData?.user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Get the token to verify ownership with safe query handling
    // RLS policy will ensure only the user's tokens are returned
    const { data: tokenData, error: tokenError } = await safeQuery(() =>
      supabase.from("api_tokens").select("*").eq("id", tokenId).single(),
    )

    if (tokenError || !tokenData) {
      return { success: false, error: tokenError || "Token not found or not owned by user" }
    }

    // Get usage data for the token with safe query handling
    // RLS policy will ensure only usage for the user's tokens is returned
    const { data, error } = await safeQuery(() =>
      supabase.from("api_usage").select("*").eq("token_id", tokenId).order("created_at", { ascending: false }),
    )

    if (error) {
      return { success: false, error }
    }

    return { success: true, usage: data as ApiUsage[] }
  } catch (error: any) {
    console.error("Error fetching API usage:", error)
    return { success: false, error: error.message || "Failed to fetch API usage" }
  }
}

// Get API usage metrics for charts
export async function getApiUsageMetrics(
  tokenId: string,
  days = 30,
): Promise<{
  success: boolean
  dailyMetrics?: ApiUsageMetrics[]
  endpointMetrics?: ApiEndpointMetrics[]
  statusMetrics?: ApiStatusMetrics[]
  error?: string
}> {
  try {
    // Input validation
    if (!tokenId) {
      return { success: false, error: "Token ID is required" }
    }

    if (isNaN(days) || days <= 0) {
      days = 30 // Default to 30 days if invalid
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the current user with safe query handling
    const { data: authData, error: authError } = await safeQuery(() => supabase.auth.getUser())

    if (authError || !authData?.user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Get the token to verify ownership with safe query handling
    // RLS policy will ensure only the user's tokens are returned
    const { data: tokenData, error: tokenError } = await safeQuery(() =>
      supabase.from("api_tokens").select("*").eq("id", tokenId).single(),
    )

    if (tokenError || !tokenData) {
      return { success: false, error: tokenError || "Token not found or not owned by user" }
    }

    // Calculate the date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get usage data for the token within the date range with safe query handling
    // RLS policy will ensure only usage for the user's tokens is returned
    const { data, error } = await safeQuery(() =>
      supabase
        .from("api_usage")
        .select("*")
        .eq("token_id", tokenId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString()),
    )

    if (error) {
      return { success: false, error }
    }

    // Process data for daily metrics
    const dailyUsage = new Map<string, number>()
    const endpointUsage = new Map<string, number>()
    const statusUsage = new Map<number, number>()

    // Initialize daily usage for all days in the range
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      dailyUsage.set(dateString, 0)
    }
    // Count usage by day, endpoint, and status
    ;(data as ApiUsage[]).forEach((usage) => {
      const dateString = new Date(usage.created_at).toISOString().split("T")[0]

      // Update daily usage
      dailyUsage.set(dateString, (dailyUsage.get(dateString) || 0) + 1)

      // Update endpoint usage
      endpointUsage.set(usage.endpoint, (endpointUsage.get(usage.endpoint) || 0) + 1)

      // Update status usage
      statusUsage.set(usage.status, (statusUsage.get(usage.status) || 0) + 1)
    })

    // Convert maps to arrays for the response
    const dailyMetrics: ApiUsageMetrics[] = Array.from(dailyUsage.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const endpointMetrics: ApiEndpointMetrics[] = Array.from(endpointUsage.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)

    const statusMetrics: ApiStatusMetrics[] = Array.from(statusUsage.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => a.status - b.status)

    return {
      success: true,
      dailyMetrics,
      endpointMetrics,
      statusMetrics,
    }
  } catch (error: any) {
    console.error("Error fetching API usage metrics:", error)
    return { success: false, error: error.message || "Failed to fetch API usage metrics" }
  }
}

// Admin function to reset API usage data
// This requires admin privileges
export async function resetApiUsageData(): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the admin client which bypasses RLS
    const supabase = createAdminClient()

    // This operation requires admin privileges
    const { error } = await safeQuery(
      () => supabase.from("api_usage").delete().neq("id", "placeholder"), // Delete all records
    )

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error resetting API usage data:", error)
    return { success: false, error: error.message || "Failed to reset API usage data" }
  }
}
