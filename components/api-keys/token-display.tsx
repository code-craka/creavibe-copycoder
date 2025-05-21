"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ApiToken } from "@/types/api-tokens"
import { formatDistanceToNow } from "date-fns"

interface TokenDisplayProps {
  token: ApiToken
  onRevoke: (tokenId: string) => Promise<void>
}

export function TokenDisplay({ token, onRevoke }: TokenDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)

  // Mask the token for display
  const maskedToken = showToken
    ? token.token
    : `${token.token.substring(0, 5)}...${token.token.substring(token.token.length - 5)}`

  // Copy token to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(token.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle token revocation
  const handleRevoke = async () => {
    if (confirm("Are you sure you want to revoke this API token? This action cannot be undone.")) {
      setIsRevoking(true)
      await onRevoke(token.id)
      setIsRevoking(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={token.revoked ? "border-red-300 bg-red-50 dark:bg-red-950/20" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{token.name}</span>
            {token.revoked && (
              <span className="text-xs font-normal text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                Revoked
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Created {formatDistanceToNow(new Date(token.created_at), { addSuffix: true })}
            {token.last_used_at && (
              <> · Last used {formatDistanceToNow(new Date(token.last_used_at), { addSuffix: true })}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded-md font-mono text-sm flex-1 overflow-x-auto">{maskedToken}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowToken(!showToken)}
                    disabled={token.revoked}
                  >
                    {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showToken ? "Hide token" : "Show token"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={token.revoked}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? "Copied!" : "Copy token"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        {!token.revoked && (
          <CardFooter>
            <Button variant="destructive" onClick={handleRevoke} disabled={isRevoking} className="ml-auto">
              {isRevoking ? "Revoking..." : "Revoke Token"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
