import { NextResponse } from "next/server"
import { getCacheOrCompute } from "@/lib/cache"

// Example of an expensive operation that should be cached
async function fetchExpensiveData() {
  // Simulate a slow API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    data: "This is expensive data that should be cached",
    timestamp: new Date().toISOString(),
  }
}

export async function GET() {
  // Get the data from cache or compute it if not found
  // Cache for 60 seconds
  const data = await getCacheOrCompute("expensive-data", fetchExpensiveData, { ttl: 60 })

  return NextResponse.json({
    ...data,
    cached: true,
    cachedAt: new Date().toISOString(),
  })
}
