"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, MousePointerClick, Clock, ArrowRight } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  change?: number
  icon: React.ReactNode
  loading?: boolean
}

function MetricCard({ title, value, description, change, icon, loading = false }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-full" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={change >= 0 ? "text-green-500" : "text-red-500"}>{Math.abs(change)}%</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewMetrics() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    pageviews: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setMetrics({
        activeUsers: 1248,
        pageviews: 5624,
        avgSessionDuration: 3.2,
        conversionRate: 4.3,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        description="Daily active users"
        change={12.5}
        icon={<Users />}
        loading={loading}
      />
      <MetricCard
        title="Page Views"
        value={metrics.pageviews.toLocaleString()}
        description="Total page views today"
        change={8.2}
        icon={<MousePointerClick />}
        loading={loading}
      />
      <MetricCard
        title="Avg. Session"
        value={`${metrics.avgSessionDuration} min`}
        description="Average session duration"
        change={-2.1}
        icon={<Clock />}
        loading={loading}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        description="Signup to activation"
        change={1.8}
        icon={<ArrowRight />}
        loading={loading}
      />
    </div>
  )
}
