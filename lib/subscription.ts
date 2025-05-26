import { getSupabaseServerClient } from "@/lib/supabase/server"

export type SubscriptionPlan = "free" | "pro" | "enterprise"

export async function getUserSubscription() {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { plan: "free" as SubscriptionPlan, isSubscribed: false }
  }

  // Get the user's profile with subscription information
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return { plan: "free" as SubscriptionPlan, isSubscribed: false }
  }

  const isSubscribed = profile.plan !== "free" && !!profile.stripe_subscription_id

  return {
    plan: profile.plan as SubscriptionPlan,
    isSubscribed,
    stripeCustomerId: profile.stripe_customer_id,
    stripeSubscriptionId: profile.stripe_subscription_id,
  }
}

export function getPlanFeatures(plan: SubscriptionPlan) {
  const plans = {
    free: {
      name: "Free",
      maxProjects: 5,
      apiRateLimit: 100, // requests per day
      storageLimit: 100, // MB
      collaborators: 1,
      supportResponseTime: "24 hours",
    },
    pro: {
      name: "Pro",
      maxProjects: 50,
      apiRateLimit: 1000, // requests per day
      storageLimit: 5000, // MB
      collaborators: 5,
      supportResponseTime: "4 hours",
    },
    enterprise: {
      name: "Enterprise",
      maxProjects: -1, // unlimited
      apiRateLimit: 10000, // requests per day
      storageLimit: 50000, // MB
      collaborators: -1, // unlimited
      supportResponseTime: "1 hour",
    },
  }

  return plans[plan]
}
