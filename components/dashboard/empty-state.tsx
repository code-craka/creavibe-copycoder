"use client"
import { motion } from "framer-motion"
import { AddProjectDialog } from "./add-project-dialog"

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 px-4"
    >
      <div className="max-w-md mx-auto">
        <svg
          className="mx-auto h-40 w-40 text-muted-foreground/30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold">No projects yet</h3>
        <p className="mt-2 text-muted-foreground">
          Get started by creating your first project. You can add details, collaborators, and more.
        </p>
        <div className="mt-6">
          <AddProjectDialog />
        </div>
      </div>
    </motion.div>
  )
}
