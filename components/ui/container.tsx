import { cn } from "@/lib/utils"
import type { ElementType, ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return <Component className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</Component>
}
