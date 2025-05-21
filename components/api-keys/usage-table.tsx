"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ApiUsage } from "@/types/api-tokens"
import { formatDistanceToNow } from "date-fns"

interface UsageTableProps {
  usage: ApiUsage[]
}

export function UsageTable({ usage }: UsageTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.ceil(usage.length / pageSize)

  // Get current page data
  const currentData = usage.slice((page - 1) * pageSize, page * pageSize)

  // Get status color
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400"
    if (status >= 400 && status < 500) return "text-amber-600 dark:text-amber-400"
    if (status >= 500) return "text-red-600 dark:text-red-400"
    return ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
          <CardDescription>View your recent API requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {usage.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.endpoint}</TableCell>
                        <TableCell className={getStatusColor(item.status)}>{item.status}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-2 py-1 text-sm rounded-md bg-muted disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-2 py-1 text-sm rounded-md bg-muted disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No API requests recorded yet.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
