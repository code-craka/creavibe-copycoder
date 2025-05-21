"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiToken } from "@/types/api-tokens"

interface CreateTokenProps {
  onCreateToken: (name: string) => Promise<ApiToken | undefined>
}

export function CreateToken({ onCreateToken }: CreateTokenProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [tokenName, setTokenName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tokenName.trim()) {
      setError("Token name is required")
      return
    }

    setError(null)
    setIsCreating(true)

    try {
      await onCreateToken(tokenName)
      setTokenName("")
      setShowForm(false)
    } catch (error) {
      setError("Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create New API Token
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Token</CardTitle>
            <CardDescription>
              Create a new API token to access the CreaVibe API. Keep your tokens secure!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Token Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setTokenName("")
                  setError(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Token"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </motion.div>
  )
}
