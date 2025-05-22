"use client"

import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AccessibleImageProps extends Omit<NextImageProps, "alt" | "onError"> {
  alt: string
  fallback?: string
  className?: string
  containerClassName?: string
  showLoadingIndicator?: boolean
}

export function AccessibleImage({
  alt,
  src,
  fallback = "/images/image-placeholder.svg",
  className,
  containerClassName,
  showLoadingIndicator = false,
  ...props
}: AccessibleImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Ensure alt text is provided and not empty
  if (!alt || alt.trim() === "") {
    console.warn("AccessibleImage component used without meaningful alt text")
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div className={cn("relative", containerClassName)}>
      {isLoading && showLoadingIndicator && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      <NextImage
        src={error ? fallback : src}
        alt={alt}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* For screen readers, provide additional context if the image fails to load */}
      {error && <span className="sr-only">Image failed to load. {alt}</span>}
    </div>
  )
}
