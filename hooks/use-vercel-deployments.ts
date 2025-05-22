"use client"

import { useState, useCallback } from "react"

interface VercelDeployment {
  id: string
  status: "BUILDING" | "READY" | "ERROR" | "CANCELED"
  url: string
  createdAt: string
}

interface DeploymentOptions {
  gitRef?: string
  target?: "production" | "preview"
  env?: Record<string, string>
}

export function useVercelDeployments() {
  const [deployments, setDeployments] = useState<VercelDeployment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerDeployment = useCallback(async (projectId: string, options: DeploymentOptions = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call our secure API route
      const response = await fetch("/api/vercel/deployments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          ...options,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to trigger deployment")
      }

      const result = await response.json()
      return result.deployment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchDeployments = useCallback(async (projectId: string, limit = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/vercel/deployments?projectId=${projectId}&limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch deployments")
      }

      const result = await response.json()
      setDeployments(result.deployments || [])

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getDeploymentStatus = useCallback(async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/vercel/deployments/${deploymentId}`)

      if (!response.ok) {
        throw new Error("Failed to get deployment status")
      }

      const result = await response.json()
      return result.deployment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  const cancelDeployment = useCallback(async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/vercel/deployments/${deploymentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel deployment")
      }

      const result = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  return {
    deployments,
    isLoading,
    error,
    triggerDeployment,
    fetchDeployments,
    getDeploymentStatus,
    cancelDeployment,
  }
}
