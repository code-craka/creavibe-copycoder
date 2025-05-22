import { getServerConfig } from "@/lib/config/environment"

export interface VercelDeployment {
  id: string
  url: string
  status: "BUILDING" | "READY" | "ERROR" | "CANCELED"
  createdAt: string
  meta?: Record<string, any>
}

export interface VercelProject {
  id: string
  name: string
  framework: string
  createdAt: string
}

export class VercelService {
  private config: ReturnType<typeof getServerConfig>
  private baseUrl = "https://api.vercel.com"

  constructor() {
    // This will throw an error if called on the client side
    this.config = getServerConfig()

    if (!this.config.vercel.automationBypassSecret) {
      throw new Error("VERCEL_AUTOMATION_BYPASS_SECRET is required for Vercel operations")
    }
  }

  private async makeVercelRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.vercel.automationBypassSecret}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Vercel API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  async getProjects(): Promise<VercelProject[]> {
    try {
      const data = await this.makeVercelRequest("/v9/projects")
      return data.projects || []
    } catch (error) {
      console.error("Failed to fetch Vercel projects:", error)
      throw new Error("Unable to fetch projects from Vercel")
    }
  }

  async getProject(projectId: string): Promise<VercelProject> {
    try {
      const data = await this.makeVercelRequest(`/v9/projects/${projectId}`)
      return data
    } catch (error) {
      console.error(`Failed to fetch Vercel project ${projectId}:`, error)
      throw new Error(`Unable to fetch project ${projectId} from Vercel`)
    }
  }

  async triggerDeployment(
    projectId: string,
    options: {
      gitRef?: string
      target?: "production" | "preview"
      env?: Record<string, string>
    } = {},
  ): Promise<VercelDeployment> {
    try {
      const { gitRef = "main", target = "production", env = {} } = options

      const deploymentData = {
        name: projectId,
        gitSource: {
          type: "github",
          ref: gitRef,
        },
        target,
        env,
        projectSettings: {
          framework: "nextjs",
        },
      }

      const data = await this.makeVercelRequest("/v13/deployments", {
        method: "POST",
        body: JSON.stringify(deploymentData),
      })

      return {
        id: data.id,
        url: data.url,
        status: data.readyState,
        createdAt: data.createdAt,
        meta: data.meta,
      }
    } catch (error) {
      console.error("Failed to trigger Vercel deployment:", error)
      throw new Error("Unable to trigger deployment")
    }
  }

  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    try {
      const data = await this.makeVercelRequest(`/v13/deployments/${deploymentId}`)

      return {
        id: data.id,
        url: data.url,
        status: data.readyState,
        createdAt: data.createdAt,
        meta: data.meta,
      }
    } catch (error) {
      console.error(`Failed to fetch deployment ${deploymentId}:`, error)
      throw new Error(`Unable to fetch deployment ${deploymentId}`)
    }
  }

  async getDeployments(projectId: string, limit = 10): Promise<VercelDeployment[]> {
    try {
      const data = await this.makeVercelRequest(`/v6/deployments?projectId=${projectId}&limit=${limit}`)

      return data.deployments.map((deployment: any) => ({
        id: deployment.id,
        url: deployment.url,
        status: deployment.readyState,
        createdAt: deployment.createdAt,
        meta: deployment.meta,
      }))
    } catch (error) {
      console.error(`Failed to fetch deployments for project ${projectId}:`, error)
      throw new Error(`Unable to fetch deployments for project ${projectId}`)
    }
  }

  async cancelDeployment(deploymentId: string): Promise<boolean> {
    try {
      await this.makeVercelRequest(`/v12/deployments/${deploymentId}/cancel`, {
        method: "PATCH",
      })
      return true
    } catch (error) {
      console.error(`Failed to cancel deployment ${deploymentId}:`, error)
      throw new Error(`Unable to cancel deployment ${deploymentId}`)
    }
  }

  // Custom key operations using CUSTOM_KEY
  async performCustomOperation(operation: string, data: any): Promise<any> {
    try {
      // Use the custom key for specialized operations
      const customKey = this.config.custom.key

      // Example: Custom webhook or API call using the custom key
      const response = await fetch("https://your-custom-api.com/webhook", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${customKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          data,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Custom operation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Custom operation ${operation} failed:`, error)
      throw new Error(`Unable to perform custom operation: ${operation}`)
    }
  }
}

// Factory function to create service instance (server-side only)
export function createVercelService(): VercelService {
  if (typeof window !== "undefined") {
    throw new Error(
      "🚨 SECURITY VIOLATION: VercelService can only be instantiated on the server side. " +
        "This prevents sensitive API keys from being exposed to client-side code.",
    )
  }
  return new VercelService()
}

// Utility function to validate Vercel configuration
export function validateVercelConfig(): boolean {
  try {
    const config = getServerConfig()
    return !!(config.vercel.automationBypassSecret && config.custom.key)
  } catch (error) {
    console.error("Vercel configuration validation failed:", error)
    return false
  }
}
