"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ApiUsageMetrics, ApiEndpointMetrics, ApiStatusMetrics } from "@/types/api-tokens"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface UsageChartProps {
  dailyMetrics: ApiUsageMetrics[]
  endpointMetrics: ApiEndpointMetrics[]
  statusMetrics: ApiStatusMetrics[]
}

export function UsageChart({ dailyMetrics, endpointMetrics, statusMetrics }: UsageChartProps) {
  const [activeTab, setActiveTab] = useState("daily")

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Format status code for display
  const formatStatus = (status: number) => {
    if (status >= 200 && status < 300) return `${status} (Success)`
    if (status >= 400 && status < 500) return `${status} (Client Error)`
    if (status >= 500) return `${status} (Server Error)`
    return status.toString()
  }

  // Prepare data for charts
  const dailyData = dailyMetrics.map((metric) => ({
    ...metric,
    date: formatDate(metric.date),
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>View your API usage statistics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily Usage</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="status">Status Codes</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="Requests" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="endpoints">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={endpointMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="status">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" tickFormatter={formatStatus} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => formatStatus(Number(label))} />
                    <Bar dataKey="count" name="Requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
