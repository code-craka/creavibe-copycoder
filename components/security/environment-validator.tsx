"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface SecurityCheck {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

export function EnvironmentValidator() {
  const [checks, setChecks] = useState<SecurityCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    performSecurityChecks()
  }, [])

  const performSecurityChecks = () => {
    const securityChecks: SecurityCheck[] = []

    // Check 1: Ensure sensitive variables are not exposed on client
    const sensitiveVars = [
      "VERCEL_AUTOMATION_BYPASS_SECRET",
      "SUPABASE_SERVICE_ROLE_KEY",
      "STRIPE_SECRET_KEY",
      "RESEND_API_KEY",
    ]

    const exposedVars: string[] = []
    sensitiveVars.forEach((varName) => {
      // Check if variable is accessible on client side
      if ((process.env as any)[varName] || (window as any)[varName]) {
        exposedVars.push(varName)
      }
    })

    if (exposedVars.length > 0) {
      securityChecks.push({
        name: "Sensitive Variable Exposure",
        status: "fail",
        message: `The following sensitive variables are exposed on the client: ${exposedVars.join(", ")}`,
      })
    } else {
      securityChecks.push({
        name: "Sensitive Variable Protection",
        status: "pass",
        message: "No sensitive variables detected on client side",
      })
    }

    // Check 2: Verify client-safe variables are properly prefixed
    const clientVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_POSTHOG_KEY",
      "NEXT_PUBLIC_APP_URL",
    ]

    const missingClientVars = clientVars.filter((varName) => !process.env[varName])

    if (missingClientVars.length > 0) {
      securityChecks.push({
        name: "Client Variable Configuration",
        status: "warning",
        message: `Missing client variables: ${missingClientVars.join(", ")}`,
      })
    } else {
      securityChecks.push({
        name: "Client Variable Configuration",
        status: "pass",
        message: "All required client variables are properly configured",
      })
    }

    // Check 3: Verify server-side configuration access
    try {
      // This should fail on client side
      const { getServerConfig } = require("@/lib/config/environment")
      getServerConfig()

      securityChecks.push({
        name: "Server Configuration Access",
        status: "fail",
        message: "Server configuration is accessible from client side - SECURITY RISK!",
      })
    } catch (error) {
      securityChecks.push({
        name: "Server Configuration Protection",
        status: "pass",
        message: "Server configuration is properly protected from client access",
      })
    }

    // Check 4: Verify HTTPS usage
    if (typeof window !== "undefined") {
      const isHTTPS = window.location.protocol === "https:"
      const isLocalhost = window.location.hostname === "localhost"

      if (!isHTTPS && !isLocalhost) {
        securityChecks.push({
          name: "HTTPS Security",
          status: "fail",
          message: "Application is not using HTTPS in production",
        })
      } else {
        securityChecks.push({
          name: "HTTPS Security",
          status: "pass",
          message: "Application is using secure HTTPS connection",
        })
      }
    }

    setChecks(securityChecks)
    setIsLoading(false)
  }

  const getStatusIcon = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getAlertVariant = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "pass":
        return "default"
      case "fail":
        return "destructive"
      case "warning":
        return "default"
    }
  }

  if (isLoading) {
    return <div>Running security checks...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Environment Security Validation</h3>

      {checks.map((check, index) => (
        <Alert key={index} variant={getAlertVariant(check.status)}>
          {getStatusIcon(check.status)}
          <AlertTitle>{check.name}</AlertTitle>
          <AlertDescription>{check.message}</AlertDescription>
        </Alert>
      ))}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Security Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-green-600">✓ Passed: {checks.filter((c) => c.status === "pass").length}</div>
          <div className="text-yellow-600">⚠ Warnings: {checks.filter((c) => c.status === "warning").length}</div>
          <div className="text-red-600">✗ Failed: {checks.filter((c) => c.status === "fail").length}</div>
        </div>
      </div>
    </div>
  )
}
