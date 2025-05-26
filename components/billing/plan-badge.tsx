import type { SubscriptionPlan } from "@/lib/subscription"
import { cn } from "@/lib/utils"

interface PlanBadgeProps {
  plan: SubscriptionPlan
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const badgeStyles = {
    free: "bg-gray-100 text-gray-800",
    pro: "bg-blue-100 text-blue-800",
    enterprise: "bg-purple-100 text-purple-800",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeStyles[plan],
        className,
      )}
    >
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  )
}
