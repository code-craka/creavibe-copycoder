import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { CohortAnalysis } from "@/components/analytics-dashboard/cohort-analysis"
import { CohortInsights } from "@/components/analytics-dashboard/cohort-insights"
import { RetentionTrends } from "@/components/analytics-dashboard/retention-trends"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cohort Analysis - CreaVibe Analytics",
  description: "Analyze user retention and engagement patterns across different cohorts",
}

export default function CohortsPage() {
  return (
    <DashboardLayout
      title="Cohort Analysis"
      description="Track user retention and engagement patterns across different cohorts"
    >
      <div className="space-y-6">
        <CohortAnalysis />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetentionTrends />
          <CohortInsights />
        </div>
      </div>
    </DashboardLayout>
  )
}
