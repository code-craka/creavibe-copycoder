"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key } from "lucide-react"

interface EmptyStateProps {
  onCreateToken: () => void
}

export function EmptyState({ onCreateToken }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-center">No API Tokens</CardTitle>
          <CardDescription className="text-center">You haven't created any API tokens yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <div className="rounded-full bg-muted p-6">
            <Key className="h-12 w-12 text-muted-foreground" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onCreateToken}>Create Your First API Token</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
