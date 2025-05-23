import type { NextRequest } from "next/server"

// Base types for API route handlers
export interface ApiRouteContext<T extends Record<string, string> = Record<string, string>> {
  params: T
}

// Specific parameter types for different routes
export interface DeploymentParams extends Record<string, string> {
  deploymentId: string
}

export interface ProjectParams extends Record<string, string> {
  projectId: string
}

export interface UserParams extends Record<string, string> {
  userId: string
}

// API route handler types
export type ApiRouteHandler<T extends Record<string, string> = Record<string, string>> = (
  request: NextRequest,
  context: ApiRouteContext<T>,
) => Promise<Response>

// Specific handler types
export type DeploymentRouteHandler = ApiRouteHandler<DeploymentParams>
export type ProjectRouteHandler = ApiRouteHandler<ProjectParams>
export type UserRouteHandler = ApiRouteHandler<UserParams>

// Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DeploymentResponse {
  id: string
  status: string
  url?: string
  createdAt: string
  updatedAt?: string
}

export interface ProjectResponse {
  id: string
  name: string
  framework?: string
  createdAt: string
  updatedAt: string
}

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Utility functions for API routes
export function createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function createApiError(error: string, statusCode = 500): ApiResponse {
  return {
    success: false,
    error,
  }
}
