"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, ExternalLink, Trash } from "lucide-react"
import type { Project } from "@/types/project"
import { format } from "date-fns"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function ProjectModal({ project, isOpen, onClose, isMobile }: ProjectModalProps) {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!project) return null

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  const formattedCreatedDate = format(new Date(project.created_at), "PPP")
  const formattedUpdatedDate = format(new Date(project.updated_at), "PPP")

  const content = (
    <div className="space-y-6">
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url || "/placeholder.svg"}
            alt={`Thumbnail for ${project.title}`}
            fill
            className="object-cover"
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

      {/* Project Description */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      {/* Project Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Created: {formattedCreatedDate}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Updated: {formattedUpdatedDate}</span>
            </li>
          </ul>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collaborators */}
      {project.collaborators && project.collaborators.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
          <div className="flex flex-wrap gap-2">
            {project.collaborators.map((collaborator, index) => (
              <Badge key={index} variant="secondary">
                {collaborator}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ExternalLink className="h-4 w-4" />
          <span>Open</span>
        </Button>
        <Button variant="destructive" size="sm" className="flex items-center gap-1">
          <Trash className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{project.title}</DrawerTitle>
            <DrawerDescription>Project details</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>Project details</DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
