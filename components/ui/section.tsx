import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  background?: "default" | "muted" | "primary" | "accent"
  containerClassName?: string
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"
  paddingY?: "none" | "sm" | "md" | "lg" | "xl"
}

export function Section({
  children,
  className,
  id,
  background = "default",
  containerClassName,
  containerSize = "xl",
  paddingY = "lg",
}: SectionProps): JSX.Element {
  // Background classes
  const getBackgroundClass = () => {
    switch (background) {
      case "muted":
        return "bg-muted"
      case "primary":
        return "bg-primary text-primary-foreground"
      case "accent":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-background"
    }
  }

  // Container size classes
  const getContainerSizeClass = () => {
    switch (containerSize) {
      case "sm":
        return "max-w-3xl"
      case "md":
        return "max-w-5xl"
      case "lg":
        return "max-w-6xl"
      case "xl":
        return "max-w-7xl"
      case "full":
        return "max-w-full"
      default:
        return "max-w-7xl"
    }
  }

  // Padding Y classes
  const getPaddingYClass = () => {
    switch (paddingY) {
      case "none":
        return ""
      case "sm":
        return "py-6 md:py-8"
      case "md":
        return "py-8 md:py-12"
      case "lg":
        return "py-12 md:py-24"
      case "xl":
        return "py-16 md:py-32"
      default:
        return "py-12 md:py-24"
    }
  }

  return (
    <section id={id} className={cn(getBackgroundClass(), getPaddingYClass(), className)}>
      <div className={cn("container mx-auto px-4", getContainerSizeClass(), containerClassName)}>{children}</div>
    </section>
  )
}
