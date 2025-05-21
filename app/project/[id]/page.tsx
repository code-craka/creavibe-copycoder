import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProjectById } from "@/app/actions/projects"
import { getGenerations } from "@/app/actions/generations"
import { PromptForm } from "@/components/project/prompt-form"
import { GenerationCard } from "@/components/project/generation-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const projectResponse = await getProjectById(params.id)

  if (!projectResponse.data) {
    notFound()
  }

  const project = projectResponse.data
  const generationsResponse = await getGenerations(params.id)
  const generations = generationsResponse.data || []

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-text/70 hover:text-text flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">{project.title}</h1>
            {project.description && <p className="text-text/70 mt-2">{project.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-text/70 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{generations.length} generations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Generate Content
          </h2>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <PromptForm
              projectId={params.id}
              onGenerationComplete={() => {
                // This would trigger a refresh in a client component
              }}
            />
          </Suspense>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-4">Generation History</h2>

          <Suspense fallback={<GenerationsLoadingSkeleton />}>
            {generations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {generations.map((generation) => (
                  <GenerationCard key={generation.id} generation={generation} />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-text mb-2">No generations yet</h3>
                <p className="text-text/70">Use the form above to generate your first content for this project.</p>
              </div>
            )}
          </Suspense>
        </section>
      </div>
    </main>
  )
}

function GenerationsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4 border-b border-border">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
