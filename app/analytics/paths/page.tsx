import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function UserPathsPage() {
  return (
    <DashboardLayout title="User Paths" description="Analyze how users navigate through your application">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Flow Visualization</CardTitle>
            <CardDescription>See how users move through your application</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] relative">
            <Image
              src="/placeholder.svg?height=600&width=1200&query=user+flow+diagram+with+nodes+and+connections+showing+website+navigation+paths"
              alt="User flow visualization"
              fill
              className="object-contain"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Entry Pages</CardTitle>
              <CardDescription>Where users begin their journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Homepage</div>
                  <div>68%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Features</div>
                  <div>12%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Pricing</div>
                  <div>8%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Blog</div>
                  <div>7%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Other</div>
                  <div>5%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Exit Pages</CardTitle>
              <CardDescription>Where users leave your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Pricing</div>
                  <div>24%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Homepage</div>
                  <div>22%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Contact</div>
                  <div>18%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Features</div>
                  <div>15%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Other</div>
                  <div>21%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common User Journeys</CardTitle>
            <CardDescription>Most frequent paths taken by users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="font-medium">Journey 1: Homepage → Features → Pricing → Signup</div>
                <div className="text-sm text-muted-foreground">32% of conversions follow this path</div>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Homepage</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Features</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Pricing</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Signup</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Journey 2: Homepage → Pricing → Signup</div>
                <div className="text-sm text-muted-foreground">24% of conversions follow this path</div>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Homepage</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Pricing</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Signup</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Journey 3: Blog → Features → Pricing → Signup</div>
                <div className="text-sm text-muted-foreground">18% of conversions follow this path</div>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Blog</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Features</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Pricing</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Signup</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
