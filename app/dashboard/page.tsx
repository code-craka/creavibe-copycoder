import React, { Suspense } from "react"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/dashboard/empty-state"
import { AddProjectDialog } from "@/components/dashboard/add-project-dialog"
import { getProjects, getUserProfile } from "@/app/actions/projects"
import { createServerComponentClient } from "@/utils/supabase/clients"
import { redirect } from "next/navigation"
import { UserProfileMenu } from "@/components/dashboard/user-profile-menu"
import { PageLayout } from "@/components/layout/page-layout"
import type { Metadata } from "next"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard - CreaVibe",
  description: "Manage and organize all your creative projects",
}

function ProjectsContent() {
  // Use React.use to handle the promise in a way that works with Suspense
  const projectsPromise = getProjects();
  const { data: projects, error } = React.use(projectsPromise);
  
  // Ensure projects match our updated Project type
  const typedProjects = projects || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Error loading projects</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return <EmptyState />
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

export default async function DashboardPage() {
  // Create a new Supabase client for this server component
  const supabase = createServerComponentClient()

  // Use getUser instead of getSession for better security
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile()
  const userName = profile?.full_name || user.email?.split("@")[0] || "there"

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <UserProfileMenu user={user} profileData={profile} />
              <div>
                <h1 className="text-3xl font-bold tracking-tight" id="dashboard-heading">
                  Welcome, {userName}
                </h1>
                <p className="text-muted-foreground mt-1">Manage and organize all your creative projects</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Refresh</span>
            </Button>
            <AddProjectDialog />
          </div>
        </div>

        <main aria-labelledby="dashboard-heading">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsContent />
          </Suspense>
        </main>
      </div>
    </PageLayout>
  )
}
