"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Generate mock cohort insights
const generateCohortInsights = () => {
  return {
    bestCohort: {
      name: "Oct 2023",
      retention: 68,
      change: 12.5,
    },
    worstCohort: {
      name: "Feb 2023",
      retention: 42,
      change: -8.3,
    },
    recentTrend: {
      direction: Math.random() > 0.5 ? "up" : "down",
      value: Math.floor(Math.random() * 15) + 1,
    },
    retentionFactors: [
      {
        name: "Completed Onboarding",
        impact: 85,
      },
      {
        name: "Created First Project",
        impact: 72,
      },
      {
        name: "Invited Team Members",
        impact: 64,
      },
      {
        name: "Used Templates",
        impact: 58,
      },
      {
        name: "Connected API",
        impact: 45,
      },
    ],
  }
}

export function CohortInsights() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setInsights(generateCohortInsights())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Insights</CardTitle>
        <CardDescription>Key insights and factors affecting user retention</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Best Performing Cohort</div>
                <div className="text-2xl font-bold">{insights.bestCohort.name}</div>
                <div className="flex items-center mt-1">
                  <div className="mr-2">{insights.bestCohort.retention}% retention</div>
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">{insights.bestCohort.change}%</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Worst Performing Cohort</div>
                <div className="text-2xl font-bold">{insights.worstCohort.name}</div>
                <div className="flex items-center mt-1">
                  <div className="mr-2">{insights.worstCohort.retention}% retention</div>
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(insights.worstCohort.change)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="font-medium">Recent Retention Trend</div>
                {insights.recentTrend.direction === "up" ? (
                  <div className="ml-auto flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Up {insights.recentTrend.value}%</span>
                  </div>
                ) : (
                  <div className="ml-auto flex items-center text-red-500">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>Down {insights.recentTrend.value}%</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {insights.recentTrend.direction === "up"
                  ? "Recent cohorts are showing improved retention compared to previous periods."
                  : "Recent cohorts are showing decreased retention compared to previous periods."}
              </div>
            </div>

            <div>
              <div className="font-medium mb-3">Key Retention Factors</div>
              <div className="space-y-3">
                {insights.retentionFactors.map((factor: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">{factor.name}</div>
                      <div className="text-sm font-medium">{factor.impact}% impact</div>
                    </div>
                    <Progress value={factor.impact} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>
                  These factors have the strongest correlation with user retention. Focus on improving these areas to
                  increase overall retention rates.
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
