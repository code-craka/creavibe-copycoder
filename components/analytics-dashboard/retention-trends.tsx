"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Generate mock retention trend data
const generateRetentionTrends = () => {
  const data = []
  const now = new Date()

  // Generate 12 months of data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)

    const month = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

    // Base retention with some randomness
    const day1 = Math.min(100, Math.max(60, 75 + (Math.random() * 20 - 10)))
    const day7 = Math.min(day1, Math.max(30, 45 + (Math.random() * 20 - 10)))
    const day30 = Math.min(day7, Math.max(15, 25 + (Math.random() * 15 - 7.5)))

    data.push({
      month,
      day1,
      day7,
      day30,
    })
  }

  return data
}

export function RetentionTrends() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [trendData, setTrendData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setTrendData(generateRetentionTrends())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retention Trends</CardTitle>
        <CardDescription>Track how retention rates have changed over time</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickFormatter={(value) => value.split(" ")[0]} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, ""]} labelFormatter={(label) => `${label}`} />
                <Legend />
                <Line type="monotone" dataKey="day1" name="Day 1 Retention" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="day7" name="Day 7 Retention" stroke="#82ca9d" />
                <Line type="monotone" dataKey="day30" name="Day 30 Retention" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Day 1 Avg</div>
            <div className="text-xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                `${(trendData.reduce((sum, item) => sum + item.day1, 0) / trendData.length).toFixed(1)}%`
              )}
            </div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Day 7 Avg</div>
            <div className="text-xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                `${(trendData.reduce((sum, item) => sum + item.day7, 0) / trendData.length).toFixed(1)}%`
              )}
            </div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Day 30 Avg</div>
            <div className="text-xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                `${(trendData.reduce((sum, item) => sum + item.day30, 0) / trendData.length).toFixed(1)}%`
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
