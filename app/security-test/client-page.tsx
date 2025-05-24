"use client"

import { Suspense } from "react"
import { EnvironmentValidator } from "@/components/security/environment-validator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Client component wrapper for the security test page content
export function SecurityTestClientPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Security Testing Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Validate environment variable security and overall application security posture.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variable Security</CardTitle>
          <CardDescription>
            Automated checks to ensure sensitive environment variables are properly protected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading security checks...</div>}>
            <EnvironmentValidator />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
          <CardDescription>Guidelines for maintaining security in your Vercel deployment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">✅ Implemented Security Measures</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Server-side only access to sensitive environment variables</li>
              <li>Client-side environment variable validation</li>
              <li>Secure API routes with authentication and authorization</li>
              <li>Rate limiting on sensitive endpoints</li>
              <li>CSRF protection for state-changing operations</li>
              <li>Webhook signature validation</li>
              <li>Comprehensive security headers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">🔒 Protected Variables</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>
                <code>VERCEL_AUTOMATION_BYPASS_SECRET</code> - Vercel API access
              </li>
              <li>
                <code>SUPABASE_SERVICE_ROLE_KEY</code> - Database admin access
              </li>
              <li>
                <code>STRIPE_SECRET_KEY</code> - Payment processing
              </li>
              <li>
                <code>RESEND_API_KEY</code> - Email service access
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">🌐 Client-Safe Variables</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>
                <code>NEXT_PUBLIC_SUPABASE_URL</code> - Public database URL
              </li>
              <li>
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Public database key
              </li>
              <li>
                <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> - Public payment key
              </li>
              <li>
                <code>NEXT_PUBLIC_POSTHOG_KEY</code> - Analytics key
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
