import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
  background?: "default" | "muted" | "primary" | "accent"
  as?: "section" | "div" | "article"
  ariaLabelledby?: string
}

export function Section({
  id,
  className,
  children,
  background = "default",
  as: Component = "section",
  ariaLabelledby,
}: SectionProps): JSX.Element {
  const backgroundClasses = {
    default: "",
    muted: "bg-muted/50",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  }

  return (
    <Component
      id={id}
      className={cn("w-full py-12 md:py-24 lg:py-32", backgroundClasses[background], className)}
      aria-labelledby={ariaLabelledby}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">{children}</div>
    </Component>
  )
}
