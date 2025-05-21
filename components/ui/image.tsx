import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageProps extends Omit<NextImageProps, "alt"> {
  alt: string
  className?: string
}

export function Image({ alt, className, ...props }: ImageProps) {
  // Ensure alt text is provided and not empty
  if (!alt || alt.trim() === "") {
    console.warn("Image component used without meaningful alt text")
    alt = "Image" // Fallback alt text
  }

  return <NextImage alt={alt} className={cn(className)} {...props} />
}
