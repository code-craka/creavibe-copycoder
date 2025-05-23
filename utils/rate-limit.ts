/**
 * Rate limiting utility for API routes
 * Helps prevent brute force attacks on authentication endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client if environment variables are available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Fallback in-memory store if Redis is not configured
const inMemoryStore: Record<string, { count: number; resetTime: number }> = {};

type RateLimitOptions = {
  // Maximum number of requests allowed within the window
  limit?: number;
  // Time window in seconds
  windowInSeconds?: number;
  // Optional identifier function (defaults to IP address)
  identifierFn?: (req: NextRequest) => string;
};

/**
 * Rate limiting middleware for Next.js API routes
 */
export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const {
    limit = 10,
    windowInSeconds = 60,
    identifierFn = (req) => {
      // Extract IP address from standard headers
      const ip = 
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'anonymous';
      return ip;
    },
  } = options;

  const identifier = identifierFn(req);
  const now = Math.floor(Date.now() / 1000);
  const resetTime = now + windowInSeconds;
  const key = `rate-limit:${identifier}`;

  // Use Redis if available, otherwise use in-memory store
  if (redis) {
    // Initialize or increment counter
    const counter = await redis.get<number>(key) || 0;
    
    if (counter === 0) {
      // Set new counter with expiration
      await redis.set(key, 1, { ex: windowInSeconds });
      return { success: true, limit, remaining: limit - 1, reset: resetTime };
    }
    
    if (counter >= limit) {
      // Rate limit exceeded
      const ttl = await redis.ttl(key);
      return { 
        success: false, 
        limit, 
        remaining: 0, 
        reset: now + (ttl > 0 ? ttl : windowInSeconds) 
      };
    }
    
    // Increment counter
    await redis.incr(key);
    return { 
      success: true, 
      limit, 
      remaining: limit - (counter + 1), 
      reset: resetTime 
    };
  } else {
    // In-memory fallback
    if (!inMemoryStore[key]) {
      inMemoryStore[key] = { count: 1, resetTime };
      
      // Set cleanup timeout
      setTimeout(() => {
        delete inMemoryStore[key];
      }, windowInSeconds * 1000);
      
      return { success: true, limit, remaining: limit - 1, reset: resetTime };
    }
    
    // Check if the current window has expired
    if (now > inMemoryStore[key].resetTime) {
      inMemoryStore[key] = { count: 1, resetTime };
      return { success: true, limit, remaining: limit - 1, reset: resetTime };
    }
    
    // Check if rate limit exceeded
    if (inMemoryStore[key].count >= limit) {
      return { 
        success: false, 
        limit, 
        remaining: 0, 
        reset: inMemoryStore[key].resetTime 
      };
    }
    
    // Increment counter
    inMemoryStore[key].count += 1;
    return { 
      success: true, 
      limit, 
      remaining: limit - inMemoryStore[key].count, 
      reset: inMemoryStore[key].resetTime 
    };
  }
}

/**
 * Apply rate limiting to a Next.js API route handler
 * Returns a 429 Too Many Requests response if rate limit is exceeded
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options: RateLimitOptions = {}
) {
  return async function rateLimit_handler(req: NextRequest): Promise<NextResponse> {
    const result = await rateLimit(req, options);
    
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': (result.reset - Math.floor(Date.now() / 1000)).toString(),
          },
        }
      );
    }
    
    const response = await handler(req);
    
    // Add rate limit headers to the response
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());
    
    return response;
  };
}
