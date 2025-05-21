import type React from "react"
import { Fragment } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  homeHref?: string
  showHomeIcon?: boolean
}

export function Breadcrumb({ items, className, homeHref = "/", showHomeIcon = true }: BreadcrumbProps): JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center flex-wrap">
        {showHomeIcon && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="text-muted-foreground hover:text-foreground flex items-center"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            {items.length > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" aria-hidden="true" />}
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={item.label}>
              <li className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground flex items-center"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "flex items-center",
                      isLast ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" aria-hidden="true" />}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
