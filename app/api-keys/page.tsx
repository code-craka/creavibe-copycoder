import { Suspense } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getApiTokens, createApiToken, revokeApiToken, getApiUsage, getApiUsageMetrics } from "../actions/api-tokens"
import { ApiKeysClient } from "./client"

// Loading skeleton for the page
function ApiKeysLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

export default async function ApiKeysPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch API tokens
  const { tokens, error } = await getApiTokens()

  // Fetch usage data for the first token if available
  let usageData = null
  let usageMetrics = null

  if (tokens && tokens.length > 0) {
    const activeToken = tokens.find((token) => !token.revoked) || tokens[0]
    const { usage } = await getApiUsage(activeToken.id)
    const metrics = await getApiUsageMetrics(activeToken.id)

    usageData = usage || []
    usageMetrics = {
      dailyMetrics: metrics.dailyMetrics || [],
      endpointMetrics: metrics.endpointMetrics || [],
      statusMetrics: metrics.statusMetrics || [],
    }
  }

  // Handle token creation
  async function handleCreateToken(name: string) {
    "use server"
    const result = await createApiToken(name)
    return result.token
  }

  // Handle token revocation
  async function handleRevokeToken(tokenId: string) {
    "use server"
    await revokeApiToken(tokenId)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys to access the CreaVibe API.</p>
      </div>

      <Alert>
        <AlertTitle>Keep your API keys secure</AlertTitle>
        <AlertDescription>
          Your API keys grant access to your account and should be kept secure. Do not share your API keys in public
          repositories or client-side code.
        </AlertDescription>
      </Alert>

      <Suspense fallback={<ApiKeysLoading />}>
        <ApiKeysClient
          tokens={tokens || []}
          usage={usageData || []}
          usageMetrics={usageMetrics}
          onCreateToken={handleCreateToken}
          onRevokeToken={handleRevokeToken}
          error={error}
        />
      </Suspense>
    </div>
  )
}
