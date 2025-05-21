import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { OverviewMetrics } from "@/components/analytics-dashboard/overview-metrics"
import { UserActivityChart } from "@/components/analytics-dashboard/user-activity-chart"
import { ConversionFunnels } from "@/components/analytics-dashboard/conversion-funnels"
import { PageAnalytics } from "@/components/analytics-dashboard/page-analytics"
import { ABTestingResults } from "@/components/analytics-dashboard/ab-testing-results"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics Dashboard - CreaVibe",
  description: "Track and analyze user behavior and performance metrics",
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics Dashboard" description="Track and analyze user behavior and performance metrics">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewMetrics />
          <UserActivityChart />
          <PageAnalytics />
        </TabsContent>

        <TabsContent value="funnels" className="space-y-4">
          <ConversionFunnels />
        </TabsContent>

        <TabsContent value="heatmaps" className="space-y-4">
          <PageAnalytics showHeatmaps />
        </TabsContent>

        <TabsContent value="abtests" className="space-y-4">
          <ABTestingResults />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <EventsExplorer />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

function EventsExplorer() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Events Explorer</h2>
      <p className="text-muted-foreground mb-6">
        Coming soon. This feature will allow you to explore all tracked events.
      </p>
    </div>
  )
}
