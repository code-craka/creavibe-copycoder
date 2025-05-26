import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRedisClient, isRedisAvailable } from "@/lib/redis"

// Configure rate limits
const RATE_LIMIT_CONFIG = {
  // Default limit for all routes
  default: {
    limit: 60, // requests
    window: 60, // seconds
  },
  // Specific limits for sensitive routes
  auth: {
    limit: 10, // requests
    window: 60, // seconds
  },
  api: {
    limit: 30, // requests
    window: 60, // seconds
  },
}

// Get the appropriate rate limit config based on the path
function getRateLimitConfig(path: string) {
  if (path.startsWith("/api/auth")) {
    return RATE_LIMIT_CONFIG.auth
  } else if (path.startsWith("/api/")) {
    return RATE_LIMIT_CONFIG.api
  }
  return RATE_LIMIT_CONFIG.default
}

// Generate a unique key for the rate limit
function getRateLimitKey(req: NextRequest, isAuthenticated: boolean) {
  // Use IP address as the identifier
  const ip = req.ip || "anonymous"
  const path = req.nextUrl.pathname

  // If authenticated, include user ID in the key for more granular control
  const userPrefix = isAuthenticated ? "user:" : "anon:"

  return `rate-limit:${userPrefix}${ip}:${path}`
}

export async function rateLimitMiddleware(req: NextRequest, isAuthenticated = false) {
  // Skip rate limiting if Redis is not available
  if (!isRedisAvailable()) {
    console.warn("Rate limiting is disabled because Redis is not available")
    return NextResponse.next()
  }

  const redis = getRedisClient()
  if (!redis) {
    return NextResponse.next()
  }

  // Skip rate limiting for non-API routes if desired
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const config = getRateLimitConfig(req.nextUrl.pathname)
  const key = getRateLimitKey(req, isAuthenticated)

  try {
    // Get current count
    const currentCount = (await redis.get<number>(key)) || 0

    // Check if rate limit is exceeded
    if (currentCount >= config.limit) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + config.window).toString(),
          },
        },
      )
    }

    // Increment the counter
    await redis.incr(key)

    // Set expiration if this is the first request in the window
    if (currentCount === 0) {
      await redis.expire(key, config.window)
    }

    // Calculate remaining requests
    const remaining = Math.max(0, config.limit - (currentCount + 1))

    // Continue with the request
    const response = NextResponse.next()

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", config.limit.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", (Math.floor(Date.now() / 1000) + config.window).toString())

    return response
  } catch (error) {
    console.error("Rate limiting error:", error)
    // In case of Redis errors, allow the request to proceed
    return NextResponse.next()
  }
}
