"use client"

import { useState } from "react"
import { ProjectCard } from "./project-card"
import { ProjectModal } from "./project-modal"
import type { Project } from "@/types/project"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* New Project Card */}
        <Button
          variant="outline"
          className="h-full min-h-[200px] flex flex-col items-center justify-center gap-2 border-dashed bg-surface"
          aria-label="Create new project"
        >
          <Plus className="h-8 w-8" />
          <span>New Project</span>
        </Button>

        {/* Project Cards */}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
        ))}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        isMobile={isMobile}
      />
    </>
  )
}
