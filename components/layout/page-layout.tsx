import type React from "react"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"

interface PageLayoutProps {
  children: React.ReactNode
  showBreadcrumbs?: boolean
  className?: string
}

export function PageLayout({ children, showBreadcrumbs = true, className }: PageLayoutProps) {
  return (
    <div className={className}>
      {showBreadcrumbs && (
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs />
        </div>
      )}
      {children}
    </div>
  )
}
