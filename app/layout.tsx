import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics/analytics"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { AnalyticsContextProvider } from "@/components/providers/analytics-provider"
import { Suspense } from "react"

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
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnalyticsProvider>
            <AnalyticsContextProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <Suspense fallback={null}>
                  <main className="flex-1">{children}</main>
                </Suspense>
                <Footer />
              </div>
              <Analytics />
              <Toaster />
            </AnalyticsContextProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
