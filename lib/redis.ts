import { Redis } from "@upstash/redis"

// Initialize Redis client with error handling
let redis: Redis | null = null

try {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Upstash Redis environment variables are not set. Redis functionality will be disabled.")
  } else {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
}

/**
 * Get the Redis client instance
 * @returns The Redis client instance or null if not initialized
 */
export function getRedisClient(): Redis | null {
  return redis
}

/**
 * Check if Redis is available
 * @returns true if Redis is available, false otherwise
 */
export function isRedisAvailable(): boolean {
  return redis !== null
}

/**
 * Execute a Redis operation with error handling
 * @param operation Function that performs Redis operations
 * @param fallbackValue Fallback value to return if Redis is not available or an error occurs
 * @returns The result of the operation or the fallback value
 */
export async function withRedis<T>(operation: (client: Redis) => Promise<T>, fallbackValue: T): Promise<T> {
  if (!redis) {
    console.warn("Redis operation attempted but Redis is not available")
    return fallbackValue
  }

  try {
    return await operation(redis)
  } catch (error) {
    console.error("Redis operation failed:", error)
    return fallbackValue
  }
}
