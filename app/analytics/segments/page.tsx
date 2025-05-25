import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SegmentsPage() {
  return (
    <DashboardLayout title="User Segments" description="Create and manage user segments for targeted analysis">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SegmentCard
          name="Active Users"
          description="Users who have been active in the last 30 days"
          count={4328}
          properties={[{ name: "Last Active", value: "< 30 days ago" }]}
        />

        <SegmentCard
          name="Power Users"
          description="Users who use the app frequently and create lots of content"
          count={1245}
          properties={[
            { name: "Sessions per Week", value: "> 5" },
            { name: "Content Created", value: "> 10" },
          ]}
        />

        <SegmentCard
          name="At Risk"
          description="Users who haven't been active recently"
          count={876}
          properties={[
            { name: "Last Active", value: "> 14 days ago" },
            { name: "Previously Active", value: "true" },
          ]}
        />

        <SegmentCard
          name="Free Trial"
          description="Users currently on free trial"
          count={2134}
          properties={[
            { name: "Plan", value: "trial" },
            { name: "Trial End Date", value: "> today" },
          ]}
        />

        <SegmentCard
          name="Enterprise"
          description="Enterprise plan customers"
          count={342}
          properties={[{ name: "Plan", value: "enterprise" }]}
        />

        <SegmentCard
          name="New Users"
          description="Users who signed up in the last 7 days"
          count={587}
          properties={[{ name: "Created At", value: "< 7 days ago" }]}
        />
      </div>
    </DashboardLayout>
  )
}

interface SegmentCardProps {
  name: string
  description: string
  count: number
  properties: { name: string; value: string }[]
}

function SegmentCard({ name, description, count, properties }: SegmentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {count.toLocaleString()} users
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {properties.map((property, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="text-muted-foreground">{property.name}</div>
              <div className="font-medium">{property.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
