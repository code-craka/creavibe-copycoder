import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CardGridProps {
  children: ReactNode
  className?: string
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    "2xl"?: number
  }
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
}

export function CardGrid({
  children,
  className,
  columns = { default: 1, md: 2, lg: 3 },
  gap = "md",
}: CardGridProps): JSX.Element {
  // Convert columns to grid-template-columns classes
  const getColumnsClass = () => {
    const classes = [`grid-cols-${columns.default}`]

    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`)
    if (columns["2xl"]) classes.push(`2xl:grid-cols-${columns["2xl"]}`)

    return classes.join(" ")
  }

  // Convert gap to gap classes
  const getGapClass = () => {
    switch (gap) {
      case "none":
        return "gap-0"
      case "xs":
        return "gap-2"
      case "sm":
        return "gap-4"
      case "md":
        return "gap-6"
      case "lg":
        return "gap-8"
      case "xl":
        return "gap-10"
      default:
        return "gap-6"
    }
  }

  return <div className={cn("grid", getColumnsClass(), getGapClass(), className)}>{children}</div>
}
