import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { LifecycleAnalysis } from "@/components/analytics-dashboard/lifecycle-analysis"
import { RetentionTrends } from "@/components/analytics-dashboard/retention-trends"
import { CohortInsights } from "@/components/analytics-dashboard/cohort-insights"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Lifecycle - CreaVibe Analytics",
  description: "Analyze user lifecycle stages and transitions",
}

export default function LifecyclePage() {
  return (
    <DashboardLayout title="User Lifecycle" description="Analyze user lifecycle stages and transitions">
      <div className="space-y-6">
        <LifecycleAnalysis />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetentionTrends />
          <CohortInsights />
        </div>
      </div>
    </DashboardLayout>
  )
}
