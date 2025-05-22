"use client"

import { useState, useCallback } from "react"

export function useCustomOperations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performOperation = useCallback(async (operation: string, data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call our secure API route for custom operations
      const response = await fetch("/api/custom/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to perform operation")
      }

      const result = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCustomData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Call our secure API route that uses CUSTOM_KEY
      const response = await fetch("/api/custom/operations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch custom data")
      }

      const result = await response.json()
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    performOperation,
    fetchCustomData,
  }
}
