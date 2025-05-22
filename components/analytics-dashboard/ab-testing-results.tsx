"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpRight, AlertCircle } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for A/B tests
const MOCK_TESTS = [
  {
    id: "test-1",
    name: "Homepage Hero Design",
    status: "running",
    startDate: "2023-05-01",
    variants: [
      { name: "Control", users: 2450, conversions: 245, conversionRate: 10 },
      { name: "Variant A", users: 2480, conversions: 322, conversionRate: 13 },
    ],
    goal: "Sign Up Click",
    significance: 95,
  },
  {
    id: "test-2",
    name: "Pricing Page Layout",
    status: "completed",
    startDate: "2023-04-15",
    endDate: "2023-04-30",
    variants: [
      { name: "Control", users: 1850, conversions: 148, conversionRate: 8 },
      { name: "Variant A", users: 1820, conversions: 200, conversionRate: 11 },
    ],
    goal: "Plan Selection",
    significance: 98,
    winner: "Variant A",
  },
  {
    id: "test-3",
    name: "Checkout Flow",
    status: "running",
    startDate: "2023-05-10",
    variants: [
      { name: "Control", users: 980, conversions: 294, conversionRate: 30 },
      { name: "Variant A", users: 1020, conversions: 316, conversionRate: 31 },
    ],
    goal: "Purchase Completion",
    significance: 62,
  },
]

export function ABTestingResults() {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<any[]>([])
  const [activeTest, setActiveTest] = useState<string>("test-1")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setTests(MOCK_TESTS)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog])

  const selectedTest = tests.find((test) => test.id === activeTest) || {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getBarColor = (variant: any, selectedTest: any) => {
    if (selectedTest.winner === variant.name) return "#22c55e"
    return variant.name === "Control" ? "#8884d8" : "#82ca9d"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">A/B Testing</h2>
          <p className="text-muted-foreground">Experiment with different UI elements and features</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Experiments</CardTitle>
            <CardDescription>Select an experiment to view results</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeTest === test.id ? "bg-primary/10" : "bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => setActiveTest(test.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{test.name}</div>
                      <Badge variant="outline" className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Goal: {test.goal}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Started: {new Date(test.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{loading ? <Skeleton className="h-6 w-48" /> : selectedTest.name}</CardTitle>
                <CardDescription>
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : <>Goal: {selectedTest.goal}</>}
                </CardDescription>
              </div>
              {!loading && (
                <Badge variant="outline" className={getStatusColor(selectedTest.status)}>
                  {selectedTest.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={selectedTest.variants}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        label={{ value: "Conversion Rate (%)", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
                      <Legend />
                      <Bar dataKey="conversionRate" name="Conversion Rate" radius={[0, 4, 4, 0]}>
                        {selectedTest.variants.map((variant: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(variant, selectedTest)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTest.variants.map((variant: any, index: number) => (
                    <Card key={index} className={selectedTest.winner === variant.name ? "border-green-500" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{variant.name}</CardTitle>
                          {selectedTest.winner === variant.name && <Badge className="bg-green-500">Winner</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Users</div>
                            <div className="text-lg font-medium">{variant.users.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Conversions</div>
                            <div className="text-lg font-medium">{variant.conversions.toLocaleString()}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm text-muted-foreground">Conversion Rate</div>
                            <div className="text-lg font-medium">{variant.conversionRate}%</div>
                          </div>
                        </div>
                      </CardContent>
                      {index === 1 && variant.conversionRate > selectedTest.variants[0].conversionRate && (
                        <CardFooter className="pt-0">
                          <div className="text-sm text-green-500 flex items-center">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {(
                              ((variant.conversionRate - selectedTest.variants[0].conversionRate) /
                                selectedTest.variants[0].conversionRate) *
                              100
                            ).toFixed(1)}
                            % improvement
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Statistical Significance</div>
                    <div className="text-sm">{selectedTest.significance}%</div>
                  </div>
                  <Progress value={selectedTest.significance} className="h-2" />
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {selectedTest.significance >= 95
                      ? "Results are statistically significant (95%+ confidence)"
                      : "Not enough data for statistical significance yet"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
