import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps): JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" aria-hidden="true" />
          </li>
        )}

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.isCurrent ? (
              <span className="text-sm font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                )}
                {index < items.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" aria-hidden="true" />
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
