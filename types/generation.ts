export interface Generation {
  id: string
  project_id: string
  user_id: string
  prompt: string
  result: string
  created_at: string
  model: string
  format: "text" | "markdown" | "html" | "json"
  status: "pending" | "completed" | "failed"
  metadata?: {
    tokens?: {
      prompt: number
      completion: number
      total: number
    }
    duration?: number
    settings?: Record<string, any>
  }
}

export interface GenerationResponse {
  data: Generation | null
  error: Error | null
}

export interface GenerationsResponse {
  data: Generation[] | null
  error: Error | null
}

export interface GenerationRequest {
  projectId: string
  prompt: string
  model?: string
  format?: "text" | "markdown" | "html" | "json"
}
