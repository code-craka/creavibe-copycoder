import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface HeroProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  align?: "left" | "center" | "right"
  size?: "sm" | "md" | "lg" | "xl"
}

export function Hero({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
  align = "left",
  size = "lg",
}: HeroProps): JSX.Element {
  // Alignment classes
  const getAlignmentClasses = () => {
    switch (align) {
      case "center":
        return "text-center items-center"
      case "right":
        return "text-right items-end"
      default:
        return "text-left items-start"
    }
  }

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          title: "text-3xl md:text-4xl",
          description: "max-w-2xl text-base md:text-lg",
          spacing: "space-y-4",
        }
      case "md":
        return {
          title: "text-4xl md:text-5xl",
          description: "max-w-3xl text-lg md:text-xl",
          spacing: "space-y-6",
        }
      case "lg":
        return {
          title: "text-5xl md:text-6xl",
          description: "max-w-4xl text-xl md:text-2xl",
          spacing: "space-y-8",
        }
      case "xl":
        return {
          title: "text-6xl md:text-7xl",
          description: "max-w-5xl text-2xl md:text-3xl",
          spacing: "space-y-10",
        }
      default:
        return {
          title: "text-4xl md:text-5xl",
          description: "max-w-3xl text-lg md:text-xl",
          spacing: "space-y-6",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div className={cn("flex flex-col", getAlignmentClasses(), sizeClasses.spacing, className)}>
      <h1 className={cn("font-bold tracking-tight", sizeClasses.title, titleClassName)}>{title}</h1>
      {description && (
        <p className={cn("text-muted-foreground", sizeClasses.description, descriptionClassName)}>{description}</p>
      )}
      {children && <div className={cn("flex flex-wrap gap-4", contentClassName)}>{children}</div>}
    </div>
  )
}
