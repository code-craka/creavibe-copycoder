"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Download, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Generate mock cohort data
const generateCohortData = () => {
  const cohorts = []
  const now = new Date()

  // Generate 12 monthly cohorts
  for (let i = 0; i < 12; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)

    const cohortDate = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
    const size = Math.floor(Math.random() * 1000) + 500 // Random cohort size between 500-1500

    const retentionData = []

    // Generate retention data for each period (up to 12 periods)
    for (let j = 0; j <= Math.min(i, 11); j++) {
      // First period is always 100%
      if (j === 0) {
        retentionData.push({
          period: j,
          retention: 100,
          users: size,
        })
      } else {
        // Retention generally decreases over time with some randomness
        const decay = Math.pow(0.85, j) + Math.random() * 0.1 - 0.05
        const retention = Math.max(Math.floor(decay * 100), 5) // Minimum 5% retention
        const users = Math.floor(size * (retention / 100))

        retentionData.push({
          period: j,
          retention,
          users,
        })
      }
    }

    cohorts.push({
      date: cohortDate,
      size,
      retentionData,
    })
  }

  return cohorts
}

export function CohortAnalysis() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [cohortData, setCohortData] = useState<any[]>([])
  const [cohortType, setCohortType] = useState("month")
  const [retentionType, setRetentionType] = useState("user")
  const [timeRange, setTimeRange] = useState("12")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setCohortData(generateCohortData())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog, cohortType, retentionType])

  // Get the maximum number of periods available in the data
  const maxPeriods = cohortData.length > 0 ? Math.max(...cohortData.map((cohort) => cohort.retentionData.length)) : 0

  // Calculate the color for a retention cell
  const getRetentionColor = (retention: number) => {
    if (retention >= 80) return "bg-green-700 text-white"
    if (retention >= 60) return "bg-green-500 text-white"
    if (retention >= 40) return "bg-green-300"
    if (retention >= 20) return "bg-green-200"
    if (retention >= 10) return "bg-green-100"
    return "bg-green-50"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Cohort Retention Analysis</CardTitle>
            <CardDescription>
              Track how users from different time periods continue to engage with your product
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={cohortType} onValueChange={setCohortType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Cohort Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={retentionType} onValueChange={setRetentionType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Retention Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User Retention</SelectItem>
                <SelectItem value="session">Session Retention</SelectItem>
                <SelectItem value="feature">Feature Retention</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Last 6 Months</SelectItem>
                <SelectItem value="12">Last 12 Months</SelectItem>
                <SelectItem value="18">Last 18 Months</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left font-medium text-muted-foreground">Cohort</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Users</th>
                  {Array.from({ length: maxPeriods }).map((_, i) => (
                    <th key={i} className="p-2 text-center font-medium text-muted-foreground">
                      {cohortType === "day" && `Day ${i}`}
                      {cohortType === "week" && `Week ${i}`}
                      {cohortType === "month" && `Month ${i}`}
                      {cohortType === "quarter" && `Q${i + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.slice(0, Number.parseInt(timeRange)).map((cohort, cohortIndex) => (
                  <tr key={cohortIndex} className="border-b">
                    <td className="p-2 font-medium">{cohort.date}</td>
                    <td className="p-2">{cohort.size.toLocaleString()}</td>
                    {Array.from({ length: maxPeriods }).map((_, periodIndex) => {
                      const retentionData = cohort.retentionData.find((d: any) => d.period === periodIndex)

                      // If we don't have data for this period (future periods for recent cohorts)
                      if (!retentionData) {
                        return (
                          <td key={periodIndex} className="p-2 text-center">
                            -
                          </td>
                        )
                      }

                      return (
                        <td
                          key={periodIndex}
                          className={`p-2 text-center ${getRetentionColor(retentionData.retention)}`}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-default">{retentionData.retention}%</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{retentionData.users.toLocaleString()} users</p>
                                <p>{retentionData.retention}% retention</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          <span>
            Cohort analysis groups users based on when they first engaged with your product and tracks their retention
            over time. Each row represents a cohort, and each column shows the percentage of users who returned in
            subsequent periods.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
