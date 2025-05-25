"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
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
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Generate a new token
    const token = generateToken()

    // Insert the token into the database
    const { data, error } = await supabase
      .from("api_tokens")
      .insert({
        user_id: user.id,
        token,
        name,
        created_at: new Date().toISOString(),
        revoked: false,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/api-keys")
    return { success: true, token: data as ApiToken }
  } catch (_error) {
    return { success: false, error: "Failed to create API token" }
  }
}

// Get all API tokens for the current user
export async function getApiTokens(): Promise<{ success: boolean; tokens?: ApiToken[]; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get all tokens for the user
    const { data, error } = await supabase
      .from("api_tokens")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, tokens: data as ApiToken[] }
  } catch (_error) {
    return { success: false, error: "Failed to fetch API tokens" }
  }
}

// Revoke an API token
export async function revokeApiToken(tokenId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Update the token to be revoked
    const { error } = await supabase
      .from("api_tokens")
      .update({ revoked: true })
      .eq("id", tokenId)
      .eq("user_id", user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/api-keys")
    return { success: true }
  } catch (_error) {
    return { success: false, error: "Failed to revoke API token" }
  }
}

// Get API usage for a specific token
export async function getApiUsage(tokenId: string): Promise<{ success: boolean; usage?: ApiUsage[]; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get the token to verify ownership
    const { data: tokenData, error: tokenError } = await supabase
      .from("api_tokens")
      .select("*")
      .eq("id", tokenId)
      .eq("user_id", user.id)
      .single()

    if (tokenError || !tokenData) {
      return { success: false, error: "Token not found or not owned by user" }
    }

    // Get usage data for the token
    const { data, error } = await supabase
      .from("api_usage")
      .select("*")
      .eq("token_id", tokenId)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, usage: data as ApiUsage[] }
  } catch (_error) {
    return { success: false, error: "Failed to fetch API usage" }
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
    const cookieStore = cookies()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get the token to verify ownership
    const { data: tokenData, error: tokenError } = await supabase
      .from("api_tokens")
      .select("*")
      .eq("id", tokenId)
      .eq("user_id", user.id)
      .single()

    if (tokenError || !tokenData) {
      return { success: false, error: "Token not found or not owned by user" }
    }

    // Calculate the date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get usage data for the token within the date range
    const { data, error } = await supabase
      .from("api_usage")
      .select("*")
      .eq("token_id", tokenId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (error) {
      return { success: false, error: error.message }
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
  } catch (_error) {
    return { success: false, error: "Failed to fetch API usage metrics" }
  }
}
