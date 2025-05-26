import { getUserUsage } from "@/lib/usage-tracking"
import { getPlanFeatures, type SubscriptionPlan } from "@/lib/subscription"
import { Progress } from "@/components/ui/progress"

interface UsageMetricsProps {
  plan: SubscriptionPlan
  userId: string
}

export async function UsageMetrics({ plan, userId }: UsageMetricsProps) {
  const usage = await getUserUsage(userId)
  const planFeatures = getPlanFeatures(plan)

  // Helper function to calculate percentage
  const calculatePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min(100, Math.round((current / limit) * 100))
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">API Requests</span>
          <span className="text-sm text-muted-foreground">
            {usage.api_requests.current} / {planFeatures.apiRateLimit === -1 ? "Unlimited" : planFeatures.apiRateLimit}
          </span>
        </div>
        <Progress value={calculatePercentage(usage.api_requests.current, planFeatures.apiRateLimit)} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Storage</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(usage.storage.current / 1024)} MB /{" "}
            {planFeatures.storageLimit === -1 ? "Unlimited" : `${planFeatures.storageLimit / 1000} GB`}
          </span>
        </div>
        <Progress value={calculatePercentage(usage.storage.current, planFeatures.storageLimit)} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Projects</span>
          <span className="text-sm text-muted-foreground">
            {usage.projects.current} / {planFeatures.maxProjects === -1 ? "Unlimited" : planFeatures.maxProjects}
          </span>
        </div>
        <Progress value={calculatePercentage(usage.projects.current, planFeatures.maxProjects)} className="h-2" />
      </div>

      <div className="text-xs text-muted-foreground mt-4">
        <p>Last updated: {new Date(usage.api_requests.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  )
}
