import { getServerConfig } from "@/lib/config/environment"

export class VercelService {
  private config: ReturnType<typeof getServerConfig>

  constructor() {
    // This will throw an error if called on the client side
    this.config = getServerConfig()
  }

  async triggerDeployment(projectId: string, branch = "main") {
    try {
      const response = await fetch(`https://api.vercel.com/v1/deployments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectId,
          gitSource: {
            type: "github",
            ref: branch,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to trigger deployment:", error)
      throw error
    }
  }

  async getDeploymentStatus(deploymentId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v1/deployments/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get deployment status:", error)
      throw error
    }
  }
}

// Factory function to create service instance (server-side only)
export function createVercelService() {
  if (typeof window !== "undefined") {
    throw new Error("VercelService can only be instantiated on the server side")
  }
  return new VercelService()
}
