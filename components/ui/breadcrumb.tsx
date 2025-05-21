import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  homeHref?: string
  showHomeIcon?: boolean
  className?: string
}

export function Breadcrumb({ items, homeHref = "/", showHomeIcon = true, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2 text-sm">
        {showHomeIcon && (
          <li>
            <Link
              href={homeHref}
              className="flex items-center text-muted-foreground hover:text-foreground"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
        )}

        {showHomeIcon && items.length > 0 && (
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </li>
        )}

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />}

            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="flex items-center text-muted-foreground hover:text-foreground">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span
                className="flex items-center font-medium text-foreground"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
