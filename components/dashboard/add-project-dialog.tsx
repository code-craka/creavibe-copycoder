"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createProject } from "@/app/actions/projects"
import { Loader2, Plus } from "lucide-react"
import { successToast, errorToast } from "@/lib/toast"
import { motion, AnimatePresence } from "framer-motion"

export function AddProjectDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)

    try {
      const { data, error } = await createProject(formData)

      if (error) {
        if (typeof error === "object" && error !== null) {
          setErrors(error as Record<string, string[]>)
          errorToast("Validation Error", {
            description: "Please check the form for errors",
          })
        } else {
          errorToast("Error", {
            description: typeof error === "string" ? error : "Failed to create project",
          })
        }
      } else {
        successToast("Success", {
          description: "Project created successfully",
        })
        setIsOpen(false)
        event.currentTarget.reset()
      }
    } catch (error) {
      errorToast("Error", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 hover-lift">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent forceMount className="sm:max-w-[525px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new project. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="title" placeholder="Enter project title" />
                  {errors.title && <p className="text-sm text-destructive">{errors.title[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter project description (optional)"
                    className="min-h-[100px]"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description[0]}</p>}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="relative overflow-hidden">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                    {isSubmitting && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-primary-foreground/20"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                      />
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
