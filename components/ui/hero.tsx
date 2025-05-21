import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface HeroProps {
  className?: string
  children: ReactNode
  background?: "default" | "muted" | "primary" | "accent"
  size?: "sm" | "md" | "lg" | "xl"
}

export function Hero({ className, children, background = "default", size = "lg" }: HeroProps): JSX.Element {
  const backgroundClasses = {
    default: "",
    muted: "bg-muted/50",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  }

  const sizeClasses = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16 lg:py-20",
    lg: "py-12 md:py-24 lg:py-32",
    xl: "py-12 md:py-24 lg:py-32 xl:py-48",
  }

  return (
    <section className={cn("w-full", sizeClasses[size], backgroundClasses[background], className)}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

export function HeroTitle({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none", className)}>{children}</h1>
  )
}

export function HeroDescription({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return <p className={cn("max-w-[600px] text-muted-foreground md:text-xl", className)}>{children}</p>
}

export function HeroContent({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return <div className={cn("flex flex-col justify-center space-y-4", className)}>{children}</div>
}

export function HeroActions({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return <div className={cn("flex flex-col gap-2 min-[400px]:flex-row", className)}>{children}</div>
}

export function HeroImage({
  className,
  src,
  alt,
  priority = false,
}: {
  className?: string
  src: string
  alt: string
  priority?: boolean
}): JSX.Element {
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl lg:aspect-square", className)}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="object-cover w-full h-full"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}
