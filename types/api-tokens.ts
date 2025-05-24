export interface ApiToken {
  id: string
  user_id: string
  token: string
  name: string
  last_used_at: string | null
  created_at: string
  revoked: boolean
}

export interface ApiUsage {
  id: string
  token_id: string
  endpoint: string
  status: number
  created_at: string
}

export interface ApiUsageMetrics {
  date: string
  count: number
}

export interface ApiEndpointMetrics {
  endpoint: string
  count: number
}

export interface ApiStatusMetrics {
  status: number
  count: number
}
