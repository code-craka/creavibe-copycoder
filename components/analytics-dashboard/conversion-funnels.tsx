"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts"

// Mock data for the funnels
const MOCK_FUNNELS = {
  signup: [
    { name: "Visit Homepage", value: 12500, fill: "#8884d8" },
    { name: "View Signup", value: 5200, fill: "#83a6ed" },
    { name: "Start Signup", value: 3700, fill: "#8dd1e1" },
    { name: "Complete Signup", value: 2100, fill: "#82ca9d" },
  ],
  onboarding: [
    { name: "Account Created", value: 4300, fill: "#8884d8" },
    { name: "Profile Completed", value: 3200, fill: "#83a6ed" },
    { name: "First Project", value: 1800, fill: "#8dd1e1" },
    { name: "Invite Team", value: 950, fill: "#82ca9d" },
    { name: "First Content", value: 620, fill: "#a4de6c" },
  ],
  purchase: [
    { name: "View Pricing", value: 7800, fill: "#8884d8" },
    { name: "Select Plan", value: 4100, fill: "#83a6ed" },
    { name: "Add Payment", value: 2300, fill: "#8dd1e1" },
    { name: "Complete Purchase", value: 1700, fill: "#82ca9d" },
  ],
}

export function ConversionFunnels() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [funnelData, setFunnelData] = useState<any[]>([])
  const [activeFunnel, setActiveFunnel] = useState<"signup" | "onboarding" | "purchase">("signup")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setFunnelData(MOCK_FUNNELS[activeFunnel])
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog, activeFunnel])

  // Calculate conversion rates between steps
  const getConversionRates = () => {
    if (!funnelData.length) return []

    return funnelData.map((step, index) => {
      if (index === 0) return { ...step, rate: 100 }

      const prevValue = funnelData[index - 1].value
      const rate = (step.value / prevValue) * 100

      return {
        ...step,
        rate: Math.round(rate),
      }
    })
  }

  const conversionRates = getConversionRates()

  // Calculate overall conversion rate
  const getOverallRate = () => {
    if (funnelData.length < 2) return 0
    const first = funnelData[0].value
    const last = funnelData[funnelData.length - 1].value
    return Math.round((last / first) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Conversion Funnels</h2>
          <p className="text-muted-foreground">Track user progression through critical paths</p>
        </div>
        <div className="flex space-x-2">
          <Tabs value={activeFunnel} onValueChange={(v) => setActiveFunnel(v as any)}>
            <TabsList>
              <TabsTrigger value="signup">Signup</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Funnel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Funnel Visualization</CardTitle>
            <CardDescription>
              {loading ? <Skeleton className="h-4 w-48" /> : `Overall conversion rate: ${getOverallRate()}%`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} users`, "Count"]} />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step Conversion</CardTitle>
              <CardDescription>Conversion rates between steps</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {conversionRates.map((step, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[150px]">{step.name}</span>
                      <div className="flex items-center">
                        {index > 0 && <span className="text-sm font-medium">{step.rate}%</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funnel Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Biggest drop:</strong>{" "}
                    {conversionRates.length > 1
                      ? `${
                          conversionRates.reduce(
                            (prev, curr, i) => (i > 0 && curr.rate < prev.rate ? curr : prev),
                            conversionRates[1],
                          ).name
                        }`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Opportunity:</strong> Improve the signup form completion rate to increase conversions.
                  </p>
                  <p>
                    <strong>Recommendation:</strong> Simplify the form fields and add progress indicators.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
