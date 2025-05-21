"use client"

import { useState } from "react"
import type { ApiToken, ApiUsage, ApiUsageMetrics, ApiEndpointMetrics, ApiStatusMetrics } from "@/types/api-tokens"
import { TokenDisplay } from "@/components/api-keys/token-display"
import { CreateToken } from "@/components/api-keys/create-token"
import { UsageChart } from "@/components/api-keys/usage-chart"
import { UsageTable } from "@/components/api-keys/usage-table"
import { EmptyState } from "@/components/api-keys/empty-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface ApiKeysClientProps {
  tokens: ApiToken[]
  usage: ApiUsage[]
  usageMetrics: {
    dailyMetrics: ApiUsageMetrics[]
    endpointMetrics: ApiEndpointMetrics[]
    statusMetrics: ApiStatusMetrics[]
  } | null
  onCreateToken: (name: string) => Promise<ApiToken | undefined>
  onRevokeToken: (tokenId: string) => Promise<void>
  error?: string
}

export function ApiKeysClient({
  tokens,
  usage,
  usageMetrics,
  onCreateToken,
  onRevokeToken,
  error,
}: ApiKeysClientProps) {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(
    tokens.find((token) => !token.revoked)?.id || tokens[0]?.id || null,
  )
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { toast } = useToast()

  // Handle token creation
  const handleCreateToken = async (name: string) => {
    try {
      const token = await onCreateToken(name)

      if (token) {
        toast({
          title: "API token created",
          description: "Your new API token has been created successfully.",
        })

        setActiveTokenId(token.id)
        return token
      }
    } catch (error) {
      toast({
        title: "Failed to create token",
        description: "There was an error creating your API token.",
        variant: "destructive",
      })
    }
  }

  // Handle token revocation
  const handleRevokeToken = async (tokenId: string) => {
    try {
      await onRevokeToken(tokenId)

      toast({
        title: "API token revoked",
        description: "Your API token has been revoked successfully.",
      })

      // If the active token was revoked, select another active token
      if (activeTokenId === tokenId) {
        const nextActiveToken = tokens.find((token) => !token.revoked && token.id !== tokenId)
        setActiveTokenId(nextActiveToken?.id || tokens[0]?.id)
      }
    } catch (error) {
      toast({
        title: "Failed to revoke token",
        description: "There was an error revoking your API token.",
        variant: "destructive",
      })
    }
  }

  // If there's an error, display it
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p>Error: {error}</p>
      </div>
    )
  }

  // If there are no tokens, show the empty state
  if (tokens.length === 0) {
    return (
      <div className="space-y-8">
        {showCreateForm ? (
          <CreateToken onCreateToken={handleCreateToken} />
        ) : (
          <EmptyState onCreateToken={() => setShowCreateForm(true)} />
        )}
      </div>
    )
  }

  // Get the active token
  const activeToken = tokens.find((token) => token.id === activeTokenId) || tokens[0]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your API Tokens</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {tokens.map((token) => (
            <TokenDisplay key={token.id} token={token} onRevoke={handleRevokeToken} />
          ))}

          <CreateToken onCreateToken={handleCreateToken} />
        </div>
      </div>

      {usageMetrics && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">API Usage</h2>

          <Tabs defaultValue={activeTokenId || tokens[0]?.id}>
            <TabsList className="mb-4">
              {tokens.map((token) => (
                <TabsTrigger
                  key={token.id}
                  value={token.id}
                  onClick={() => setActiveTokenId(token.id)}
                  disabled={token.revoked}
                >
                  {token.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {tokens.map((token) => (
              <TabsContent key={token.id} value={token.id}>
                {token.id === activeTokenId && (
                  <div className="space-y-4">
                    <UsageChart
                      dailyMetrics={usageMetrics.dailyMetrics}
                      endpointMetrics={usageMetrics.endpointMetrics}
                      statusMetrics={usageMetrics.statusMetrics}
                    />

                    <UsageTable usage={usage} />
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}
