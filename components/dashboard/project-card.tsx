"use client"

import type { Project } from "@/types/project"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { motion } from "framer-motion"
import { DeleteProjectDialog } from "./delete-project-dialog"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    published: "bg-green-500/10 text-green-500 border-green-500/20",
    archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  const statusColor = project.status ? statusColors[project.status] : statusColors.draft

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 bg-surface text-text border-border">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <span className="text-primary/40 text-lg font-medium">{project.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className={`${statusColor}`}>
                {project.status || "Draft"}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-lg">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <p className="text-muted-foreground text-sm line-clamp-2">
              {project.description || "No description provided"}
            </p>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
            <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild aria-label="View project details">
                <Link href={`/project/${project.id}`}>
                  <MoreHorizontal className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      <DeleteProjectDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        projectId={project.id}
        projectTitle={project.title}
      />
    </>
  )
}
