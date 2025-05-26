"use server"

import { createClient } from "@/utils/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import type { ApiToken, ApiUsage, ApiUsageMetrics, ApiEndpointMetrics, ApiStatusMetrics } from "@/types/api-tokens"
import type { Database } from "@/utils/supabase/types"
import { createSuccessResponse, createErrorResponse, ErrorCode, requireAuthentication, ApiResponse } from "@/utils/api-response"
import { logger } from "@/utils/logger"
import { checkRateLimit } from "@/utils/rate-limit"
import { handleDatabaseError, handleCatchError } from "@/utils/error-handling"

// Generate a secure API token
function generateToken(): string {
  return `ck_${uuidv4().replace(/-/g, "")}_${Date.now().toString(36)}`;
}

// Create a new API token
export async function createApiToken(name: string): Promise<ApiResponse<ApiToken>> {
  return logger.trackPerformance('createApiToken', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError
      
      // Session is now guaranteed to be non-null
      const userId = session!.user.id
      
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `create_api_token:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 5, 60) // 5 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Generate a new token
      const token = generateToken()

      // Insert the token into the database
      const { data, error } = await supabase
        .from("api_tokens")
        .insert({
          user_id: userId,
          token,
          name,
          created_at: new Date().toISOString(),
          revoked: false,
        })
        .select()
        .single() as { data: ApiToken | null, error: any }

      if (error) {
        return handleDatabaseError(error, "createApiToken", { userId })
      }

      revalidatePath("/api-keys")
      return createSuccessResponse(data as ApiToken)
    } catch (error) {
      return handleCatchError(error, "createApiToken", {})
    }
  }, { component: 'api-tokens' })
}

// Get all API tokens for the current user
export async function getApiTokens(): Promise<ApiResponse<ApiToken[]>> {
  return logger.trackPerformance('getApiTokens', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError
      
      // Session is now guaranteed to be non-null
      const userId = session!.user.id
      
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `get_api_tokens:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 20, 60) // 20 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Get all tokens for the user
      const { data, error } = await supabase
        .from("api_tokens")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }) as { data: ApiToken[] | null, error: any }

      if (error) {
        return handleDatabaseError(error, "getApiTokens", { userId })
      }

      return createSuccessResponse(data as ApiToken[] || [])
    } catch (error) {
      return handleCatchError(error, "getApiTokens", {})
    }
  }, { component: 'api-tokens' })
}

// Revoke an API token
export async function revokeApiToken(tokenId: string): Promise<ApiResponse<{ success: boolean }>> {
  return logger.trackPerformance('revokeApiToken', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError
      
      // Session is now guaranteed to be non-null
      const userId = session!.user.id
      
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `revoke_api_token:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 10, 60) // 10 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Update the token to be revoked
      const { error } = await supabase
        .from("api_tokens")
        .update({ revoked: true })
        .eq("id", tokenId)
        .eq("user_id", userId) as { data: null, error: any }

      if (error) {
        return handleDatabaseError(error, "revokeApiToken", { userId, tokenId })
      }

      revalidatePath("/api-keys")
      return createSuccessResponse({ success: true })
    } catch (error) {
      return handleCatchError(error, "revokeApiToken", { tokenId })
    }
  }, { component: 'api-tokens' })
}

// Get API usage for a specific token
export async function getApiUsage(tokenId: string): Promise<ApiResponse<ApiUsage[]>> {
  return logger.trackPerformance('getApiUsage', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError
      
      // Session is now guaranteed to be non-null
      const userId = session!.user.id
      
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `get_api_usage:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 20, 60) // 20 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Get the token to verify ownership
      const { data: tokenData, error: tokenError } = await supabase
        .from("api_tokens")
        .select("*")
        .eq("id", tokenId)
        .eq("user_id", userId)
        .single()

      if (tokenError || !tokenData) {
        return createErrorResponse(
          ErrorCode.RECORD_NOT_FOUND,
          "Token not found or not owned by user"
        )
      }

      // Get usage data for the token
      const { data, error } = await supabase
        .from("api_usage")
        .select("*")
        .eq("token_id", tokenId)
        .order("created_at", { ascending: false }) as { data: ApiUsage[] | null, error: any }

      if (error) {
        return handleDatabaseError(error, "getApiUsage", { userId, tokenId })
      }

      return createSuccessResponse(data as ApiUsage[] || [])
    } catch (error) {
      return handleCatchError(error, "getApiUsage", { tokenId })
    }
  }, { component: 'api-tokens' })
}

// Get API usage metrics for charts
export async function getApiUsageMetrics(
  tokenId: string,
  days = 30,
): Promise<ApiResponse<{
  dailyMetrics: ApiUsageMetrics[]
  endpointMetrics: ApiEndpointMetrics[]
  statusMetrics: ApiStatusMetrics[]
}>> {
  return logger.trackPerformance('getApiUsageMetrics', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError
      
      // Session is now guaranteed to be non-null
      const userId = session!.user.id
      
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `get_api_metrics:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 10, 60) // 10 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Get the token to verify ownership
      const { data: tokenData, error: tokenError } = await supabase
        .from("api_tokens")
        .select("*")
        .eq("id", tokenId)
        .eq("user_id", userId)
        .single()

      if (tokenError || !tokenData) {
        return createErrorResponse(
          ErrorCode.RECORD_NOT_FOUND,
          "Token not found or not owned by user"
        )
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
        .lte("created_at", endDate.toISOString()) as { data: ApiUsage[] | null, error: any }

      if (error) {
        return handleDatabaseError(error, "getApiUsageMetrics", { userId, tokenId, days })
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

      return createSuccessResponse({
        dailyMetrics,
        endpointMetrics,
        statusMetrics,
      })
    } catch (error) {
      return handleCatchError(error, "getApiUsageMetrics", { tokenId, days })
    }
  }, { component: 'api-tokens' })
}
