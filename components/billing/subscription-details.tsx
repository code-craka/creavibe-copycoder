import type { SubscriptionPlan } from "@/lib/subscription"
import { Check } from "lucide-react"

interface SubscriptionDetailsProps {
  plan: SubscriptionPlan
  isSubscribed: boolean
  features: {
    name: string
    maxProjects: number
    apiRateLimit: number
    storageLimit: number
    collaborators: number
    supportResponseTime: string
  }
}

export function SubscriptionDetails({ plan, isSubscribed, features }: SubscriptionDetailsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{features.name} Plan</h3>

      {isSubscribed ? (
        <p className="text-sm text-muted-foreground mb-4">
          Your subscription is active. You have access to all {features.name} plan features.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          {plan === "free"
            ? "You are currently on the Free plan. Upgrade to get more features."
            : "Your subscription is inactive. Reactivate to regain access to premium features."}
        </p>
      )}

      <div className="grid gap-2">
        <div className="flex items-start">
          <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
          <span className="text-sm">
            {features.maxProjects === -1 ? "Unlimited projects" : `Up to ${features.maxProjects} projects`}
          </span>
        </div>
        <div className="flex items-start">
          <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
          <span className="text-sm">{features.apiRateLimit} API requests per day</span>
        </div>
        <div className="flex items-start">
          <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
          <span className="text-sm">{features.storageLimit / 1000} GB storage</span>
        </div>
        <div className="flex items-start">
          <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
          <span className="text-sm">
            {features.collaborators === -1
              ? "Unlimited collaborators"
              : `${features.collaborators} collaborator${features.collaborators !== 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="flex items-start">
          <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
          <span className="text-sm">{features.supportResponseTime} support response time</span>
        </div>
      </div>
    </div>
  )
}
