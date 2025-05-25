"use client"

import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface OptimizedImageProps extends Omit<NextImageProps, "alt" | "onLoad" | "onError"> {
  alt: string
  className?: string
  fallbackSrc?: string
}

export function OptimizedImage({
  alt,
  className,
  fallbackSrc = "/abstract-colorful-swirls.png",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Ensure alt text is provided and not empty
  if (!alt || alt.trim() === "") {
    console.warn("OptimizedImage component used without meaningful alt text")
    alt = "Image" // Fallback alt text
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
          <span className="sr-only">Loading image...</span>
        </div>
      )}

      <NextImage
        alt={alt}
        {...props}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        src={error ? fallbackSrc : props.src}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", props.className)}
      />
    </div>
  )
}
