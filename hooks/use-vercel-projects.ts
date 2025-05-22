"use client"

import { useState, useEffect, useCallback } from "react"
import { getClientConfig } from "@/lib/config/environment"

interface VercelProject {
  id: string
  name: string
  framework: string
  createdAt: string
}

export function useVercelProjects() {
  const [projects, setProjects] = useState<VercelProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get client-safe configuration
  const clientConfig = getClientConfig()

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Call our secure API route instead of directly using Vercel API
      const response = await fetch("/api/vercel/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const result = await response.json()
      setProjects(result.projects || [])

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  }
}
