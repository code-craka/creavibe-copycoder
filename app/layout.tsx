import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { SkipToContent } from "@/components/skip-to-content"
import { CookieConsent } from "@/components/cookie-consent"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "CreaVibe - AI-Powered Content Creation Platform",
  description:
    "Create AI-powered content with WebBooks and project management capabilities for modern creators and developers.",
  keywords: ["AI content creation", "WebBooks", "content management", "AI writing", "project management"],
  authors: [{ name: "CreaVibe Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://creavibe.com",
    title: "CreaVibe - AI-Powered Content Creation Platform",
    description: "Create AI-powered content with WebBooks and project management capabilities",
    siteName: "CreaVibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreaVibe - AI-Powered Content Creation Platform",
    description: "Create AI-powered content with WebBooks and project management capabilities",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnalyticsProvider>
            <SkipToContent />
            <div className="flex flex-col min-h-screen">
              <Suspense>
                <main id="main-content" className="flex-1">
                  {children}
                </main>
              </Suspense>
            </div>
            <CookieConsent />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
