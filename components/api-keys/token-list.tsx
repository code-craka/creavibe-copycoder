"use client"

import { useSupabaseQuery, useSupabaseMutation } from "@/hooks/use-supabase"
import { useState } from "react"
import type { ApiToken } from "@/types/api-tokens"

export function TokenList() {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)

  // Use the enhanced query hook to fetch tokens
  const {
    data: tokens,
    loading,
    error,
    refetch,
  } = useSupabaseQuery(
    (supabase) => supabase.from("api_tokens").select("*").order("created_at", { ascending: false }),
    [],
  )

  // Use the mutation hook for revoking tokens
  const { mutate: revokeToken, loading: revoking } = useSupabaseMutation((supabase, tokenId: string) =>
    supabase.from("api_tokens").update({ revoked: true }).eq("id", tokenId),
  )

  const handleRevoke = async (tokenId: string) => {
    setSelectedTokenId(tokenId)
    const { error } = await revokeToken(tokenId)
    if (!error) {
      refetch()
    }
    setSelectedTokenId(null)
  }

  if (loading) return <div>Loading tokens...</div>
  if (error) return <div>Error loading tokens: {error.message}</div>
  if (!tokens || tokens.length === 0) return <div>No tokens found</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your API Tokens</h2>
      <ul className="space-y-2">
        {tokens.map((token: ApiToken) => (
          <li key={token.id} className="p-4 border rounded-md">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-gray-500">Created: {new Date(token.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                {token.revoked ? (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Revoked</span>
                ) : (
                  <button
                    onClick={() => handleRevoke(token.id)}
                    disabled={revoking && selectedTokenId === token.id}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {revoking && selectedTokenId === token.id ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
