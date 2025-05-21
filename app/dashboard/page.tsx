import { Suspense } from "react"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Sample project data for development/testing
const sampleProjects = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete redesign of the company website with new branding and improved user experience.",
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-05-20T14:45:00Z",
    user_id: "user123",
    status: "published" as const,
    thumbnail_url: "/abstract-website-design.png",
    tags: ["Web Design", "UI/UX", "Branding"],
    collaborators: ["john@example.com", "sarah@example.com"],
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Creating a cross-platform mobile application for iOS and Android using React Native.",
    created_at: "2023-02-10T09:15:00Z",
    updated_at: "2023-06-05T11:20:00Z",
    user_id: "user123",
    status: "draft" as const,
    thumbnail_url: "/mobile-app-showcase.png",
    tags: ["React Native", "Mobile", "Cross-platform"],
    collaborators: ["alex@example.com"],
  },
  {
    id: "3",
    title: "E-commerce Platform",
    description: "Building a scalable e-commerce platform with payment processing and inventory management.",
    created_at: "2023-03-05T13:45:00Z",
    updated_at: "2023-06-10T16:30:00Z",
    user_id: "user123",
    status: "published" as const,
    thumbnail_url: "/ecommerce-concept.png",
    tags: ["E-commerce", "Payment", "Inventory"],
    collaborators: ["mike@example.com", "lisa@example.com", "david@example.com"],
  },
  {
    id: "4",
    title: "Brand Identity Guide",
    description:
      "Comprehensive brand identity guide including logo usage, color palette, typography, and visual elements.",
    created_at: "2023-04-20T08:00:00Z",
    updated_at: "2023-05-15T10:10:00Z",
    user_id: "user123",
    status: "archived" as const,
    thumbnail_url: "/brand-identity-concept.png",
    tags: ["Branding", "Design", "Guidelines"],
    collaborators: [],
  },
  {
    id: "5",
    title: "Marketing Campaign",
    description: "Digital marketing campaign for product launch including social media, email, and content strategy.",
    created_at: "2023-05-01T11:30:00Z",
    updated_at: "2023-06-15T09:45:00Z",
    user_id: "user123",
    status: "draft" as const,
    thumbnail_url: "/marketing-strategy-meeting.png",
    tags: ["Marketing", "Social Media", "Content"],
    collaborators: ["emma@example.com", "ryan@example.com"],
  },
]

async function ProjectsContent() {
  // In a real application, we would fetch projects from Supabase
  // const { data: projects, error } = await getProjects();

  // For now, we'll use sample data
  const projects = sampleProjects

  // Simulate loading time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (!projects) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No projects found</h2>
        <p className="text-muted-foreground mb-6">Create your first project to get started</p>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Create Project</span>
        </Button>
      </div>
    )
  }

  return <ProjectGrid projects={projects} />
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" id="dashboard-heading">
            Your Projects
          </h1>
          <p className="text-muted-foreground mt-1">Manage and organize all your creative projects</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Refresh</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      <main aria-labelledby="dashboard-heading">
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsContent />
        </Suspense>
      </main>
    </div>
  )
}
