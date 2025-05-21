import type { ReactNode } from "react"
import Image from "next/image"

interface HeroProps {
  title: string
  description?: string
  children?: ReactNode
  image?: {
    src: string
    alt: string
  }
  className?: string
  imagePosition?: "right" | "left"
  fullHeight?: boolean
  overlay?: boolean
  overlayOpacity?: number
  centered?: boolean
}

export function Hero({
  title,
  description,
  children,
  image,
  className = "",
  imagePosition = "right",
  fullHeight = false,
  overlay = false,
  overlayOpacity = 0.5,
  centered = false,
}: HeroProps) {
  return (
    <section className={`w-full ${fullHeight ? "min-h-screen" : "py-12 md:py-24 lg:py-32"} relative ${className}`}>
      {image && overlay && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          aria-hidden="true"
        />
      )}

      {image && (
        <div className="absolute inset-0 z-0">
          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" priority />
        </div>
      )}

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        <div
          className={`grid gap-6 ${
            image && !overlay
              ? imagePosition === "right"
                ? "lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]"
                : "lg:grid-cols-[400px_1fr] xl:grid-cols-[600px_1fr]"
              : ""
          }`}
        >
          <div
            className={`flex flex-col justify-center space-y-4 ${
              centered || (image && overlay) ? "items-center text-center" : ""
            } ${image && overlay ? "mx-auto max-w-3xl" : ""}`}
          >
            <div className="space-y-2">
              <h1
                className={`text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none ${
                  image && overlay ? "text-white" : ""
                }`}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={`max-w-[600px] ${
                    image && overlay ? "text-white/90" : "text-muted-foreground"
                  } md:text-xl ${centered ? "mx-auto" : ""}`}
                >
                  {description}
                </p>
              )}
            </div>
            {children && <div className="flex flex-wrap gap-4">{children}</div>}
          </div>

          {image && !overlay && imagePosition === "right" && (
            <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
