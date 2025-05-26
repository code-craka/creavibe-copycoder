"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance"

interface Service {
  name: string
  status: ServiceStatus
  lastUpdated: string
}

interface Incident {
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  date: string
  updates: {
    timestamp: string
    message: string
  }[]
}

// Mock data - in a real app, this would come from an API
const initialServices: Service[] = [
  {
    name: "API",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Web Application",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Authentication",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Database",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Content Generation",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
]

const initialIncidents: Incident[] = []

export function StatusWidget() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to get status badge color
  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "outage":
        return "bg-red-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to get status text
  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "Operational"
      case "degraded":
        return "Degraded Performance"
      case "outage":
        return "Service Outage"
      case "maintenance":
        return "Maintenance"
      default:
        return "Unknown"
    }
  }

  // Function to get incident status badge
  const getIncidentBadge = (status: Incident["status"]) => {
    switch (status) {
      case "investigating":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Investigating
          </Badge>
        )
      case "identified":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Identified
          </Badge>
        )
      case "monitoring":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Monitoring
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Function to refresh status data
  const refreshStatus = async () => {
    setIsRefreshing(true)

    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a delay and update the timestamp
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshStatus()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
            <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={isRefreshing} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{service.name}</span>
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(service.status)} mr-2`}></span>
                <span className="text-xs">{getStatusText(service.status)}</span>
              </div>
            </div>
          ))}
        </div>

        {incidents.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Recent Incidents</h3>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium">{incident.title}</h4>
                    {getIncidentBadge(incident.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{new Date(incident.date).toLocaleString()}</p>
                  <div className="space-y-2">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="text-xs">
                        <span className="text-muted-foreground">
                          {new Date(update.timestamp).toLocaleTimeString()}:
                        </span>{" "}
                        {update.message}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <a
            href="https://status.creavibe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View detailed status page
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
