"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Shield, ShieldCheck, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface TrustedIp {
  id: string
  user_id: string
  ip_address: string
  last_used: string
  created_at: string
}

interface TrustedIpsProps {
  user: User
  profile?: any
}

export function TrustedIps({ user }: TrustedIpsProps) {
  const [trustedIps, setTrustedIps] = useState<TrustedIp[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIp, setCurrentIp] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Fetch trusted IPs and current IP on component mount
  useEffect(() => {
    const fetchTrustedIps = async () => {
      try {
        const response = await fetch(`/api/user/trusted-ips`)
        if (response.ok) {
          const data = await response.json()
          setTrustedIps(data.trustedIps)
        } else {
          console.error("Failed to fetch trusted IPs")
        }
      } catch (error) {
        console.error("Error fetching trusted IPs:", error)
      } finally {
        setLoading(false)
      }
    }
    
    const fetchCurrentIp = async () => {
      try {
        const response = await fetch(`/api/user/current-ip`)
        if (response.ok) {
          const data = await response.json()
          setCurrentIp(data.ip)
        } else {
          console.error("Failed to fetch current IP")
        }
      } catch (error) {
        console.error("Error fetching current IP:", error)
      }
    }
    
    fetchTrustedIps()
    fetchCurrentIp()
  }, [user.id])
  
  // Add current IP to trusted IPs
  const addCurrentIp = async () => {
    if (!currentIp) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/user/trusted-ips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ip: currentIp })
      })
      
      if (response.ok) {
        const data = await response.json()
        setTrustedIps(prev => [...prev, data.trustedIp])
        toast({
          title: "IP Address Trusted",
          description: "This device's IP address has been added to your trusted IPs list.",
          variant: "default"
        })
      } else {
        toast({
          title: "Failed to Add IP",
          description: "There was an error adding this IP to your trusted list.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error adding trusted IP:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Remove IP from trusted IPs
  const removeIp = async (ipId: string, ipAddress: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/trusted-ips/${ipId}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        setTrustedIps(prev => prev.filter(ip => ip.id !== ipId))
        toast({
          title: "IP Address Removed",
          description: `${ipAddress} has been removed from your trusted IPs list.`,
          variant: "default"
        })
      } else {
        toast({
          title: "Failed to Remove IP",
          description: "There was an error removing this IP from your trusted list.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error removing trusted IP:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Check if current IP is already trusted
  const isCurrentIpTrusted = currentIp && trustedIps.some(ip => ip.ip_address === currentIp)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Trusted Devices
        </CardTitle>
        <CardDescription>
          Manage the IP addresses that can access sensitive account features without additional verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentIp && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Your current IP address</AlertTitle>
            <AlertDescription className="flex items-center gap-2">
              {currentIp}
              {isCurrentIpTrusted ? (
                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Trusted
                </Badge>
              ) : null}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          // Skeleton loading state
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        ) : trustedIps.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trustedIps.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono">
                    {ip.ip_address}
                    {ip.ip_address === currentIp && (
                      <Badge variant="outline" className="ml-2">Current</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {format(new Date(ip.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {format(new Date(ip.last_used), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIp(ip.id, ip.ip_address)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No trusted IP addresses found
          </div>
        )}
      </CardContent>
      <CardFooter>
        {currentIp && !isCurrentIpTrusted && (
          <Button onClick={addCurrentIp} disabled={loading || !currentIp}>
            Trust Current IP
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
