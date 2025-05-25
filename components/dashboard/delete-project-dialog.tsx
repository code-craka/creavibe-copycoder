"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProject } from "@/app/actions/projects"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DeleteProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
}

export function DeleteProjectDialog({ isOpen, onClose, projectId, projectTitle }: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('id', projectId)
      const { error } = await deleteProject(formData)

      if (error) {
        toast({
          title: "Error",
          description: typeof error === "string" ? error : "Failed to delete project",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
        onClose()
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium">{projectTitle}</span>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
