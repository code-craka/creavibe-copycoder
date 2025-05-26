import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"

type RateLimitOptions = {
  identifier: string
  limit: number
  timeframe: number // in seconds
}

type RateLimitResponse = {
  success: boolean
  limit: number
  remaining: number
  reset: number // timestamp in ms when the rate limit resets
}

// Initialize Redis client
let redis: Redis | null = null

try {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
}

export async function rateLimit({ identifier, limit, timeframe }: RateLimitOptions): Promise<RateLimitResponse> {
  // If Redis is not available, allow the request but log a warning
  if (!redis) {
    console.warn("Redis client not available, rate limiting is disabled")
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + timeframe * 1000,
    }
  }

  const key = `rate-limit:${identifier}`
  const now = Date.now()
  const windowExpiry = now + timeframe * 1000

  try {
    // Get the current count and expiry time
    const [count, expiry] = (await redis.pipeline().incr(key).pttl(key).exec()) as [number, number]

    // If this is the first request in the window, set the expiry
    if (count === 1) {
      await redis.pexpire(key, timeframe * 1000)
    }

    // Calculate when the rate limit resets
    const reset = expiry === -1 ? windowExpiry : now + expiry

    // Check if the request should be rate limited
    const success = count <= limit
    const remaining = Math.max(0, limit - count)

    return {
      success,
      limit,
      remaining,
      reset,
    }
  } catch (error) {
    console.error("Rate limiting error:", error)

    // If there's an error with Redis, allow the request but log the error
    return {
      success: true,
      limit,
      remaining: limit,
      reset: windowExpiry,
    }
  }
}
