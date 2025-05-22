"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for the chart
const generateMockData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      users: Math.floor(Math.random() * 500) + 500,
      newUsers: Math.floor(Math.random() * 200) + 100,
      sessions: Math.floor(Math.random() * 800) + 700,
    })
  }

  return data
}

export function UserActivityChart() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const [metric, setMetric] = useState<"users" | "newUsers" | "sessions">("users")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setChartData(generateMockData())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getMetricName = () => {
    switch (metric) {
      case "users":
        return "Active Users"
      case "newUsers":
        return "New Users"
      case "sessions":
        return "Sessions"
    }
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>User engagement over time</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Tabs value={metric} onValueChange={(v) => setMetric(v as any)}>
            <TabsList>
              <TabsTrigger value="users">Active Users</TabsTrigger>
              <TabsTrigger value="newUsers">New Users</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)}>
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-[350px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  formatter={(value) => [`${value}`, getMetricName()]}
                />
                <Legend />
                <Line type="monotone" dataKey={metric} name={getMetricName()} stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  formatter={(value) => [`${value}`, getMetricName()]}
                />
                <Legend />
                <Bar dataKey={metric} name={getMetricName()} fill="#8884d8" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
