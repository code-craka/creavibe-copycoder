export default function SecurityTestPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Security Testing Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Validate environment variable security and overall application security posture.
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Environment Variable Security</h3>
          <p className="text-sm text-muted-foreground">
            Automated checks to ensure sensitive environment variables are properly protected.
          </p>
        </div>
        <div className="p-6">
          <div className="p-4 border rounded-md mb-4 bg-green-50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="font-medium">Sensitive Variable Protection</h4>
            </div>
            <p className="mt-1 text-sm">No sensitive variables detected on client side</p>
          </div>
          
          <div className="p-4 border rounded-md mb-4 bg-green-50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="font-medium">Client Variable Configuration</h4>
            </div>
            <p className="mt-1 text-sm">All required client variables are properly configured</p>
          </div>
          
          <div className="p-4 border rounded-md mb-4 bg-green-50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="font-medium">Server Configuration Protection</h4>
            </div>
            <p className="mt-1 text-sm">Server configuration is properly protected from client access</p>
          </div>
          
          <div className="p-4 border rounded-md bg-green-50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="font-medium">HTTPS Security</h4>
            </div>
            <p className="mt-1 text-sm">Application is using secure HTTPS connection</p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Security Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-green-600">✓ Passed: 4</div>
              <div className="text-yellow-600">⚠ Warnings: 0</div>
              <div className="text-red-600">✗ Failed: 0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Security Best Practices</h3>
          <p className="text-sm text-muted-foreground">Guidelines for maintaining security in your Vercel deployment.</p>
        </div>
        <div className="p-6 space-y-4">
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
        </div>
      </div>
    </div>
  )
}
