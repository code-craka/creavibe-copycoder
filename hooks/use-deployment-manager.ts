"use client"

import { useState, useCallback, useEffect } from "react"
import { getClientConfig } from "@/lib/config/environment"

interface Deployment {
  id: string
  status: "pending" | "building" | "ready" | "error" | "canceled"
  url?: string
  createdAt: string
  branch: string
  errorMessage?: string
}

interface DeploymentManagerState {
  deployments: Deployment[]
  isLoading: boolean
  error: string | null
  currentDeployment: Deployment | null
}

export function useDeploymentManager(projectId?: string) {
  const [state, setState] = useState<DeploymentManagerState>({
    deployments: [],
    isLoading: false,
    error: null,
    currentDeployment: null,
  })

  // Get client-safe configuration
  const clientConfig = getClientConfig()

  const triggerDeployment = useCallback(async (projectId: string, branch = "main") => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch("/api/deployment/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, branch }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to trigger deployment")
      }

      const result = await response.json()

      setState((prev) => ({
        ...prev,
        currentDeployment: result.deployment,
        deployments: [result.deployment, ...prev.deployments],
      }))

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const cancelDeployment = useCallback(async (deploymentId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch("/api/deployment/manage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deploymentId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to cancel deployment")
      }

      const result = await response.json()

      setState((prev) => ({
        ...prev,
        deployments: prev.deployments.map((dep) => (dep.id === deploymentId ? { ...dep, status: "canceled" } : dep)),
      }))

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const fetchDeployments = useCallback(async (projectId: string, limit = 10) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/deployment/manage?projectId=${projectId}&limit=${limit}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch deployments")
      }

      const result = await response.json()

      setState((prev) => ({
        ...prev,
        deployments: result.deployments,
      }))

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const checkDeploymentStatus = useCallback(async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/deployment/status/${deploymentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to check deployment status")
      }

      const result = await response.json()

      setState((prev) => ({
        ...prev,
        deployments: prev.deployments.map((dep) => (dep.id === deploymentId ? { ...dep, ...result.deployment } : dep)),
        currentDeployment:
          prev.currentDeployment?.id === deploymentId
            ? { ...prev.currentDeployment, ...result.deployment }
            : prev.currentDeployment,
      }))

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw err
    }
  }, [])

  // Auto-fetch deployments when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchDeployments(projectId)
    }
  }, [projectId, fetchDeployments])

  // Poll for deployment status updates
  useEffect(() => {
    if (
      !state.currentDeployment ||
      state.currentDeployment.status === "ready" ||
      state.currentDeployment.status === "error" ||
      state.currentDeployment.status === "canceled"
    ) {
      return
    }

    const interval = setInterval(() => {
      checkDeploymentStatus(state.currentDeployment!.id)
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [state.currentDeployment, checkDeploymentStatus])

  return {
    ...state,
    triggerDeployment,
    cancelDeployment,
    fetchDeployments,
    checkDeploymentStatus,
    refreshDeployments: () => projectId && fetchDeployments(projectId),
  }
}
