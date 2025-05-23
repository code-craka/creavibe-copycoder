"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { AuditLogEntry } from "@/utils/auth/audit-log"

interface SecurityLogsProps {
  user: User
  profile?: any
}

export function SecurityLogs({ user }: SecurityLogsProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/user/audit-logs?limit=10`)
        if (response.ok) {
          const data = await response.json()
          setLogs(data.logs)
        } else {
          console.error("Failed to fetch security logs")
        }
      } catch (error) {
        console.error("Error fetching security logs:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLogs()
  }, [user.id])
  
  // Function to get badge color based on action type
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "login":
      case "email_verification_complete":
      case "password_reset_complete":
        return "success"
      case "logout":
      case "password_change":
      case "email_change":
      case "profile_update":
      case "trusted_ip_add":
      case "trusted_ip_remove":
      case "mfa_enable":
      case "mfa_disable":
      case "api_key_create":
      case "api_key_delete":
      case "password_reset_request":
      case "email_verification_request":
        return "default"
      case "failed_login_attempt":
      case "account_delete":
        return "destructive"
      default:
        return "secondary"
    }
  }
  
  // Function to format action name for display
  const formatActionName = (action: string) => {
    return action
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Security Activity</CardTitle>
        <CardDescription>
          Review recent security-related activities on your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Skeleton loading state
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">
                    {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action) as any}>
                      {formatActionName(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{log.ip_address || "Unknown"}</TableCell>
                  <TableCell className="text-xs truncate max-w-[200px]">
                    {log.user_agent ? (
                      <span title={log.user_agent}>{log.user_agent}</span>
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No security activity found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
