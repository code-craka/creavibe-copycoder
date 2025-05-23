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

  async getDeployment(deploymentId: string) {
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
      console.error("Failed to get deployment:", error)
      throw error
    }
  }

  async getProject(projectId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get project:", error)
      throw error
    }
  }
  
  async getProjectInfo(projectId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to get project info:", error)
      throw error
    }
  }

  async listDeployments(projectId: string, limit = 10) {
    try {
      const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to list deployments:", error)
      throw error
    }
  }

  async updateProject(projectId: string, data: any) {
    try {
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update project:", error)
      throw error
    }
  }

  async deleteProject(projectId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to delete project:", error)
      throw error
    }
  }

  async cancelDeployment(deploymentId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v12/deployments/${deploymentId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to cancel deployment:", error)
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

// Utility function to validate Vercel webhook signatures
export function validateVercelWebhook(payload: string, signature: string): boolean {
  if (typeof window !== "undefined") {
    throw new Error("Webhook validation can only be performed on the server side")
  }

  const config = getServerConfig()
  const crypto = require("crypto")

  const expectedSignature = crypto
    .createHmac("sha1", config.vercel.automationBypassSecret)
    .update(payload)
    .digest("hex")

  return `sha1=${expectedSignature}` === signature
}
