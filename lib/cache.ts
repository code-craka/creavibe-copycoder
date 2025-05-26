import { withRedis, isRedisAvailable } from "@/lib/redis"

/**
 * Cache options
 */
interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number
}

/**
 * Get a value from the cache
 * @param key Cache key
 * @returns The cached value or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable()) {
    return null
  }

  return withRedis(async (redis) => {
    const value = await redis.get<T>(key)
    return value
  }, null)
}

/**
 * Set a value in the cache
 * @param key Cache key
 * @param value Value to cache
 * @param options Cache options
 * @returns true if successful, false otherwise
 */
export async function setCache<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false
  }

  return withRedis(async (redis) => {
    if (options.ttl) {
      await redis.set(key, value, { ex: options.ttl })
    } else {
      await redis.set(key, value)
    }
    return true
  }, false)
}

/**
 * Delete a value from the cache
 * @param key Cache key
 * @returns true if successful, false otherwise
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false
  }

  return withRedis(async (redis) => {
    await redis.del(key)
    return true
  }, false)
}

/**
 * Get a value from the cache or compute it if not found
 * @param key Cache key
 * @param fn Function to compute the value if not found in cache
 * @param options Cache options
 * @returns The cached or computed value
 */
export async function getCacheOrCompute<T>(key: string, fn: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
  if (!isRedisAvailable()) {
    return fn()
  }

  const cached = await getCache<T>(key)
  if (cached !== null) {
    return cached
  }

  const value = await fn()
  await setCache(key, value, options)
  return value
}
