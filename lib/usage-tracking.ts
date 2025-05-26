import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserSubscription, getPlanFeatures } from "@/lib/subscription"

export type ResourceType = "api_requests" | "storage" | "projects" | "collaborators"

/**
 * Logs usage for a specific resource type
 */
export async function logUsage(userId: string, resourceType: ResourceType, quantity: number, metadata?: any) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.rpc("log_usage", {
    p_user_id: userId,
    p_resource_type: resourceType,
    p_quantity: quantity,
    p_metadata: metadata ? JSON.stringify(metadata) : null,
  })

  if (error) {
    console.error("Error logging usage:", error)
    throw new Error(`Failed to log usage: ${error.message}`)
  }

  return { success: true }
}

/**
 * Gets current usage metrics for a user
 */
export async function getUserUsage(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("usage_metrics")
    .select("resource_type, current_usage, last_reset, updated_at")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching usage metrics:", error)
    throw new Error(`Failed to fetch usage metrics: ${error.message}`)
  }

  // Convert to a more usable format
  const usageMap: Record<ResourceType, { current: number; lastReset: Date; updatedAt: Date }> = {
    api_requests: { current: 0, lastReset: new Date(), updatedAt: new Date() },
    storage: { current: 0, lastReset: new Date(), updatedAt: new Date() },
    projects: { current: 0, lastReset: new Date(), updatedAt: new Date() },
    collaborators: { current: 0, lastReset: new Date(), updatedAt: new Date() },
  }

  data.forEach((item) => {
    if (item.resource_type in usageMap) {
      usageMap[item.resource_type as ResourceType] = {
        current: item.current_usage,
        lastReset: new Date(item.last_reset),
        updatedAt: new Date(item.updated_at),
      }
    }
  })

  return usageMap
}

/**
 * Checks if a user has exceeded their plan limits
 */
export async function checkUsageLimits(userId: string, resourceType: ResourceType, additionalQuantity = 0) {
  // Get the user's subscription
  const subscription = await getUserSubscription()
  const planFeatures = getPlanFeatures(subscription.plan)

  // Get current usage
  const usage = await getUserUsage(userId)
  const currentUsage = usage[resourceType].current
  const projectedUsage = currentUsage + additionalQuantity

  // Check against plan limits
  let limit: number
  switch (resourceType) {
    case "api_requests":
      limit = planFeatures.apiRateLimit
      break
    case "storage":
      limit = planFeatures.storageLimit
      break
    case "projects":
      limit = planFeatures.maxProjects
      break
    case "collaborators":
      limit = planFeatures.collaborators
      break
    default:
      limit = 0
  }

  // -1 indicates unlimited
  if (limit === -1) {
    return { withinLimits: true, currentUsage, limit, remaining: -1 }
  }

  const withinLimits = projectedUsage <= limit
  const remaining = Math.max(0, limit - currentUsage)

  return { withinLimits, currentUsage, limit, remaining }
}

/**
 * Resets usage metrics for a user (e.g., at the start of a billing cycle)
 */
export async function resetUsageMetrics(userId: string, resourceType?: ResourceType) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.rpc("reset_usage_metrics", {
    p_user_id: userId,
    p_resource_type: resourceType || null,
  })

  if (error) {
    console.error("Error resetting usage metrics:", error)
    throw new Error(`Failed to reset usage metrics: ${error.message}`)
  }

  return { success: true }
}
