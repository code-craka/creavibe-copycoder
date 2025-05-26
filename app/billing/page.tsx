import type { Metadata } from "next"
import { getUserSubscription, getPlanFeatures } from "@/lib/subscription"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BillingPortalButton } from "@/components/billing/billing-portal-button"
import { SubscriptionDetails } from "@/components/billing/subscription-details"
import { UsageMetrics } from "@/components/billing/usage-metrics"
import { InvoiceList } from "@/components/billing/invoice-list"
import { PlanBadge } from "@/components/billing/plan-badge"

export const metadata: Metadata = {
  title: "Billing | Creavibe",
  description: "Manage your subscription and billing details",
}

export default async function BillingPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/billing")
  }

  // Get subscription details
  const subscription = await getUserSubscription()
  const planFeatures = getPlanFeatures(subscription.plan)

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, view invoices, and monitor your usage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="col-span-full lg:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <PlanBadge plan={subscription.plan} />
              </div>

              <SubscriptionDetails
                plan={subscription.plan}
                isSubscribed={subscription.isSubscribed}
                features={planFeatures}
              />

              <div className="mt-6">
                <BillingPortalButton
                  isSubscribed={subscription.isSubscribed}
                  hasCustomerId={!!subscription.stripeCustomerId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-full lg:col-span-1">
          <div className="rounded-lg border bg-card text-card-foreground shadow h-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Usage</h2>
              <UsageMetrics plan={subscription.plan} userId={user.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invoices</h2>
          <InvoiceList customerId={subscription.stripeCustomerId} />
        </div>
      </div>
    </div>
  )
}
