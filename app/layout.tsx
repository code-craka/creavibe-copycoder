import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "sonner"
import { Analytics } from "@/components/analytics/analytics"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { AnalyticsContextProvider } from "@/components/providers/analytics-provider"
import { AvatarBucketInitializer } from "@/components/providers/avatar-bucket-initializer"
import { MigrationsInitializer } from "@/components/providers/migrations-initializer"
import { SessionProvider } from "@/components/providers/session-provider"
import { Suspense } from "react"
import { OrganizationLD, WebsiteLD } from "@/components/seo/json-ld"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "CreaVibe - AI-Powered Content Creation Platform",
    template: "%s | CreaVibe",
  },
  description: "Create AI-powered content with WebBooks and project management capabilities",
  generator: "Next.js",
  applicationName: "CreaVibe",
  referrer: "origin-when-cross-origin",
  keywords: ["AI", "content creation", "webbooks", "project management", "artificial intelligence"],
  authors: [{ name: "CreaVibe Team" }],
  creator: "CreaVibe",
  publisher: "CreaVibe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://creavibe.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "CreaVibe - AI-Powered Content Creation Platform",
    description: "Create AI-powered content with WebBooks and project management capabilities",
    url: "https://creavibe.com",
    siteName: "CreaVibe",
    images: [
      {
        url: "https://creavibe.com/api/og",
        width: 1200,
        height: 630,
        alt: "CreaVibe - AI-Powered Content Creation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreaVibe - AI-Powered Content Creation Platform",
    description: "Create AI-powered content with WebBooks and project management capabilities",
    creator: "@creavibe",
    images: ["https://creavibe.com/api/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
              <Analytics />
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
