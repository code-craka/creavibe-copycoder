"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePostHog } from "posthog-js/react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface PageAnalyticsProps {
  showHeatmaps?: boolean
}

export function PageAnalytics({ showHeatmaps = false }: PageAnalyticsProps) {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState("/")
  const [heatmapType, setHeatmapType] = useState<"clicks" | "movement" | "scroll">("clicks")

  useEffect(() => {
    // In a real implementation, we would fetch this data from PostHog
    // For now, we'll simulate loading and then show mock data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [posthog, selectedPage, heatmapType])

  const pages = [
    { value: "/", label: "Homepage" },
    { value: "/features", label: "Features Page" },
    { value: "/pricing", label: "Pricing Page" },
    { value: "/dashboard", label: "Dashboard" },
    { value: "/login", label: "Login Page" },
  ]

  const getHeatmapImage = () => {
    // In a real implementation, we would get actual heatmap images from PostHog
    // For now, we'll use placeholder images
    switch (heatmapType) {
      case "clicks":
        return "/website-heatmap.png"
      case "movement":
        return "/placeholder.svg?height=600&width=800&query=website+mouse+movement+heatmap+visualization+with+blue+and+green+paths"
      case "scroll":
        return "/placeholder.svg?height=600&width=800&query=website+scroll+depth+heatmap+visualization+with+color+gradient"
      default:
        return "/placeholder.svg?height=600&width=800&query=website+heatmap+visualization"
    }
  }

  const pageMetrics = {
    "/": {
      views: 8432,
      avgTime: "2:45",
      bounceRate: "32%",
      exitRate: "24%",
    },
    "/features": {
      views: 3256,
      avgTime: "3:12",
      bounceRate: "28%",
      exitRate: "19%",
    },
    "/pricing": {
      views: 2845,
      avgTime: "2:05",
      bounceRate: "35%",
      exitRate: "22%",
    },
    "/dashboard": {
      views: 1932,
      avgTime: "8:45",
      bounceRate: "12%",
      exitRate: "15%",
    },
    "/login": {
      views: 4521,
      avgTime: "1:20",
      bounceRate: "42%",
      exitRate: "38%",
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>{showHeatmaps ? "Page Heatmaps" : "Page Analytics"}</CardTitle>
            <CardDescription>
              {showHeatmaps
                ? "Visualize user interactions on specific pages"
                : "Analyze performance of individual pages"}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.value} value={page.value}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showHeatmaps && (
              <Tabs value={heatmapType} onValueChange={(v) => setHeatmapType(v as any)}>
                <TabsList>
                  <TabsTrigger value="clicks">Clicks</TabsTrigger>
                  <TabsTrigger value="movement">Movement</TabsTrigger>
                  <TabsTrigger value="scroll">Scroll</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="space-y-6">
            {!showHeatmaps && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Page Views</div>
                  <div className="text-2xl font-bold">
                    {pageMetrics[selectedPage as keyof typeof pageMetrics]?.views.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Time on Page</div>
                  <div className="text-2xl font-bold">
                    {pageMetrics[selectedPage as keyof typeof pageMetrics]?.avgTime}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Bounce Rate</div>
                  <div className="text-2xl font-bold">
                    {pageMetrics[selectedPage as keyof typeof pageMetrics]?.bounceRate}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Exit Rate</div>
                  <div className="text-2xl font-bold">
                    {pageMetrics[selectedPage as keyof typeof pageMetrics]?.exitRate}
                  </div>
                </div>
              </div>
            )}

            {showHeatmaps && (
              <div className="relative h-[400px] w-full border rounded-lg overflow-hidden">
                <Image
                  src={getHeatmapImage() || "/placeholder.svg"}
                  alt={`${heatmapType} heatmap for ${selectedPage}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                  {heatmapType === "clicks" && "Click heatmap shows where users click most frequently on the page."}
                  {heatmapType === "movement" && "Movement heatmap shows where users move their cursor on the page."}
                  {heatmapType === "scroll" && "Scroll heatmap shows how far users scroll down the page."}
                </div>
              </div>
            )}

            {!showHeatmaps && (
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Insights:</strong> This page has a{" "}
                  {pageMetrics[selectedPage as keyof typeof pageMetrics]?.bounceRate} bounce rate, which is{" "}
                  {Number.parseInt(pageMetrics[selectedPage as keyof typeof pageMetrics]?.bounceRate) > 30
                    ? "higher"
                    : "lower"}{" "}
                  than average. Users spend an average of{" "}
                  {pageMetrics[selectedPage as keyof typeof pageMetrics]?.avgTime} on this page.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
