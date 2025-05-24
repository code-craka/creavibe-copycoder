import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { AnalyticsProvider } from "@/components/insights/analytics-provider"
import { AnalyticsContextProvider } from "@/components/insights/analytics-context-provider"
import { Analytics } from "@/components/insights/analytics"
import { Suspense } from "react"
import { AvatarBucketInitializer } from "@/components/insights/avatar-bucket-initializer"
import { MigrationsInitializer } from "@/components/insights/migrations-initializer"
import { OrganizationLD } from "@/components/insights/organization-ld"
import { WebsiteLD } from "@/components/insights/website-ld"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CreaVibe - AI-Powered Content Creation Platform",
  description: "Create AI-powered content with WebBooks and project management capabilities",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <AnalyticsProvider>
              <AnalyticsContextProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <Suspense fallback={null}>
                  <main className="flex-1">{children}</main>
                </Suspense>
                <Footer />
              </div>
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
              <Toaster position="top-right" expand={true} richColors closeButton />
              {/* Initialize avatar bucket */}
              <AvatarBucketInitializer />
              <MigrationsInitializer />
              {/* JSON-LD Structured Data */}
              <OrganizationLD />
              <WebsiteLD />
            </AnalyticsContextProvider>
          </AnalyticsProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
