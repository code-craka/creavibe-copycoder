"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Generate mock lifecycle data
const generateLifecycleData = () => {
  // Create different distributions for different time periods
  const periods = {
    "7d": [
      { name: "New", value: Math.floor(Math.random() * 300) + 200 },
      { name: "Resurrected", value: Math.floor(Math.random() * 150) + 100 },
      { name: "Returning", value: Math.floor(Math.random() * 500) + 700 },
      { name: "Dormant", value: Math.floor(Math.random() * 200) + 300 },
      { name: "Churned", value: Math.floor(Math.random() * 250) + 250 },
    ],
    "30d": [
      { name: "New", value: Math.floor(Math.random() * 800) + 600 },
      { name: "Resurrected", value: Math.floor(Math.random() * 400) + 300 },
      { name: "Returning", value: Math.floor(Math.random() * 1500) + 2000 },
      { name: "Dormant", value: Math.floor(Math.random() * 600) + 800 },
      { name: "Churned", value: Math.floor(Math.random() * 700) + 900 },
    ],
    "90d": [
      { name: "New", value: Math.floor(Math.random() * 2000) + 1500 },
      { name: "Resurrected", value: Math.floor(Math.random() * 1200) + 800 },
      { name: "Returning", value: Math.floor(Math.random() * 4000) + 6000 },
      { name: "Dormant", value: Math.floor(Math.random() * 1800) + 2200 },
      { name: "Churned", value: Math.floor(Math.random() * 2500) + 3000 },
    ],
  }

  return periods
}

const COLORS = ["#4CAF50", "#8BC34A", "#2196F3", "#FFC107", "#F44336"]

export function LifecycleAnalysis() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [lifecycleData, setLifecycleData] = useState<any>(null)
  const [period, setPeriod] = useState("30d")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setLifecycleData(generateLifecycleData())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  const getLifecycleDefinitions = () => {
    return [
      { name: "New", description: "Users who were active for the first time in this period" },
      { name: "Resurrected", description: "Users who returned after being inactive for a while" },
      { name: "Returning", description: "Users who were active both in this period and the previous period" },
      { name: "Dormant", description: "Users who were active in the previous period but not in this one" },
      { name: "Churned", description: "Users who have been inactive for an extended period" },
    ]
  }

  const getCurrentData = () => {
    if (!lifecycleData) return []
    return lifecycleData[period]
  }

  const getTotalUsers = () => {
    const data = getCurrentData()
    return data.reduce((sum: number, item: any) => sum + item.value, 0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>User Lifecycle</CardTitle>
            <CardDescription>Analyze the distribution of users across different lifecycle stages</CardDescription>
          </div>
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
              <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
              <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCurrentData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCurrentData().map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} users`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Lifecycle Stages</div>
              <div className="space-y-4">
                {getLifecycleDefinitions().map((def, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className="w-3 h-3 mt-1 mr-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <div className="font-medium">{def.name}</div>
                      <div className="text-sm text-muted-foreground">{def.description}</div>
                      {lifecycleData && (
                        <div className="text-sm mt-1">
                          {lifecycleData[period][index].value.toLocaleString()} users (
                          {((lifecycleData[period][index].value / getTotalUsers()) * 100).toFixed(1)}%)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
