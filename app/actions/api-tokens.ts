"use server"

import { createServerComponentClient, createAdminClient } from "@/utils/supabase/clients"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import type { ApiToken, ApiUsage, ApiUsageMetrics, ApiEndpointMetrics, ApiStatusMetrics } from "@/types/api-tokens"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Generate a secure API token
function generateToken(): string {
  return `ck_${uuidv4().replace(/-/g, "")}_${Date.now().toString(36)}`
}

// Helper function to get authenticated user with proper error handling
async function getAuthenticatedUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = createServerComponentClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Authentication error:", error)
      return { user: null, error: error.message }
    }

    if (!user) {
      return { user: null, error: "User not authenticated" }
    }

    return { user, error: null }
  } catch (err: any) {
    console.error("Unexpected authentication error:", err)
    return { user: null, error: "Authentication failed" }
  }
}

// Create a new API token
export async function createApiToken(name: string): Promise<{ success: boolean; token?: ApiToken; error?: string }> {
  try {
    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return { success: false, error: "Token name is required and must be a valid string" }
    }

    if (name.trim().length > 100) {
      return { success: false, error: "Token name must be less than 100 characters" }
    }

    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Generate a new token
    const token = generateToken()

    // Create the token data with the correct type
    const tokenData: Database["public"]["Tables"]["api_tokens"]["Insert"] = {
      user_id: user.id,
      token,
      name: name.trim(),
      created_at: new Date().toISOString(),
      revoked: false,
    }

    // Insert the token into the database
    const { data, error } = await supabase.from("api_tokens").insert([tokenData] as any).select().single()

    if (error) {
      console.error("Database error creating API token:", error)
      return { success: false, error: "Failed to create API token. Please try again." }
    }

    revalidatePath("/api-keys")
    return { success: true, token: data as unknown as ApiToken }
  } catch (error: any) {
    console.error("Unexpected error creating API token:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Get all API tokens for the current user
export async function getApiTokens(): Promise<{ success: boolean; tokens?: ApiToken[]; error?: string }> {
  try {
    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get all tokens for the user
    // RLS policy will ensure only the user's tokens are returned
    const { data, error } = await supabase.from("api_tokens").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Database error fetching API tokens:", error)
      return { success: false, error: "Failed to fetch API tokens. Please try again." }
    }

    return { success: true, tokens: (data as unknown as ApiToken[]) || [] }
  } catch (error: any) {
    console.error("Unexpected error fetching API tokens:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Revoke an API token
export async function revokeApiToken(tokenId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Input validation
    if (!tokenId || typeof tokenId !== "string") {
      return { success: false, error: "Valid token ID is required" }
    }

    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Create the update data with the correct type
    const updateData: Database["public"]["Tables"]["api_tokens"]["Update"] = {
      revoked: true,
    }

    // Update the token to be revoked
    // RLS policy will ensure only the user's tokens can be updated
    const { error } = await supabase
      .from("api_tokens")
      .update(updateData as Database["public"]["Tables"]["api_tokens"]["Update"])
      .eq("id", tokenId)

    if (error) {
      console.error("Database error revoking API token:", error)
      return { success: false, error: "Failed to revoke API token. Please try again." }
    }

    revalidatePath("/api-keys")
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error revoking API token:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Get API usage for a specific token
export async function getApiUsage(tokenId: string, limit: number): Promise<{ success: boolean; usage?: ApiUsage[]; error?: string }> {
  try {
    // Input validation
    if (!tokenId || typeof tokenId !== "string") {
      return { success: false, error: "Valid token ID is required" }
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      return { success: false, error: "Valid limit is required" }
    }

    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the token to verify ownership
    // RLS policy will ensure only the user's tokens are returned
    const { data: tokenData, error: tokenError } = await supabase
      .from("api_tokens")
      .select("*")
      .eq("id", tokenId as any)
      .single() as any

    if (tokenError) {
      console.error("Database error fetching token:", tokenError)
      return { success: false, error: "Token not found or access denied" }
    }

    if (!tokenData) {
      return { success: false, error: "Token not found" }
    }

    // Get usage data for the token
    // RLS policy will ensure only usage for the user's tokens is returned
    const { data, error } = await supabase
      .from("api_usage")
      .select("*")
      .eq("token_id", tokenId as any)
      .order("created_at", { ascending: false })
      .limit(limit) as any

    if (error) {
      console.error("Database error fetching API usage:", error)
      return { success: false, error: "Failed to fetch API usage. Please try again." }
    }

    return { success: true, usage: data as unknown as ApiUsage[] }
  } catch (error: any) {
    console.error("Unexpected error fetching API usage:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
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
    if (!tokenId || typeof tokenId !== "string") {
      return { success: false, error: "Valid token ID is required" }
    }

    if (!Number.isInteger(days) || days <= 0 || days > 365) {
      days = 30 // Default to 30 days if invalid
    }

    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return { success: false, error: authError || "User not authenticated" }
    }

    // Use the server component client which respects RLS policies
    const supabase = createServerComponentClient()

    // Get the token to verify ownership
    // RLS policy will ensure only the user's tokens are returned
    const { data: tokenData, error: tokenError } = await supabase
      .from("api_tokens")
      .select("*")
      .eq("id", tokenId)
      .single()

    if (tokenError) {
      console.error("Database error fetching token:", tokenError)
      return { success: false, error: "Token not found or access denied" }
    }

    if (!tokenData) {
      return { success: false, error: "Token not found" }
    }

    // Calculate the date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get usage data for the token within the date range
    // RLS policy will ensure only usage for the user's tokens is returned
    const { data, error } = await supabase
      .from("api_usage")
      .select("*")
      .eq("token_id", tokenId as any)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (error) {
      console.error("Database error fetching API usage metrics:", error)
      return { success: false, error: "Failed to fetch API usage metrics. Please try again." }
    }

    const usageData = (data as unknown as ApiUsage[]) || []

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
    usageData.forEach((usage) => {
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
    console.error("Unexpected error fetching API usage metrics:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Admin function to reset API usage data
// This requires admin privileges
export async function resetApiUsageData(): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the admin client which bypasses RLS
    const supabase = createAdminClient()

    // This operation requires admin privileges
    const { error } = await supabase.from("api_usage").delete().neq("id" as any, "placeholder") // Delete all records

    if (error) {
      console.error("Database error resetting API usage data:", error)
      return { success: false, error: "Failed to reset API usage data. Please try again." }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error resetting API usage data:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}
