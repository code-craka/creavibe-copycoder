"use client"

import { useState, useCallback } from "react"
import { getClientConfig } from "@/lib/config/environment"

interface DeploymentStatus {
  id: string
  status: "pending" | "building" | "ready" | "error"
  url?: string
  createdAt: string
}

export function useDeployment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null)

  // Get client-safe configuration
  const clientConfig = getClientConfig()

  const triggerDeployment = useCallback(async (projectId: string, branch = "main") => {
    setIsLoading(true)
    setError(null)

    try {
      // Call our secure API route instead of directly using Vercel API
      const response = await fetch("/api/deployment/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, branch }),
      })

      if (!response.ok) {
        throw new Error("Failed to trigger deployment")
      }

      const result = await response.json()
      setDeployment(result.deployment)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkDeploymentStatus = useCallback(async (deploymentId: string) => {
    try {
      // Call our secure API route
      const response = await fetch(`/api/deployment/status/${deploymentId}`)

      if (!response.ok) {
        throw new Error("Failed to check deployment status")
      }

      const result = await response.json()
      setDeployment(result.deployment)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    }
  }, [])

  return {
    isLoading,
    error,
    deployment,
    triggerDeployment,
    checkDeploymentStatus,
  }
}
