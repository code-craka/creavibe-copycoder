"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbsProps {
  homeLabel?: string
  className?: string
  separator?: React.ReactNode
  containerClassName?: string
}

export function Breadcrumbs({
  homeLabel = "Home",
  className,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  containerClassName,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on homepage
  if (pathname === "/") return null

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper labels and URLs
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`
    // Convert slug to readable label (e.g., "my-page" to "My Page")
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return { label, url }
  })

  // Add home as the first item
  breadcrumbItems.unshift({ label: homeLabel, url: "/" })

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_APP_URL}${item.url}`,
    })),
  }

  return (
    <nav aria-label="Breadcrumbs" className={cn("py-2", containerClassName)}>
      <ol className={cn("flex items-center flex-wrap", className)}>
        {breadcrumbItems.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && <span className="mx-2">{separator}</span>}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-muted-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.url} className="text-primary hover:underline flex items-center">
                {index === 0 ? (
                  <>
                    <Home className="h-4 w-4 mr-1" />
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Add structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </nav>
  )
}
