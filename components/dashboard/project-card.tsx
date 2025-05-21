"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { Project } from "@/types/project"
import { formatDistanceToNow } from "date-fns"

interface ProjectCardProps {
  project: Project
  onSelect: (project: Project) => void
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false)

  const formattedDate = formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  return (
    <Card
      className="h-full flex flex-col transition-all duration-200 hover:shadow-md bg-surface"
      onClick={() => onSelect(project)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(project)
        }
      }}
      role="button"
      aria-label={`View details for ${project.title}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        {project.thumbnail_url && !imageError ? (
          <Image
            src={project.thumbnail_url || "/placeholder.svg"}
            alt={`Thumbnail for ${project.title}`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No thumbnail</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={statusColors[project.status]}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground line-clamp-2 text-sm">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          {project.collaborators && project.collaborators.length > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <Users className="h-3 w-3" />
              <span>{project.collaborators.length}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
