import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} aria-hidden="true" />
}

interface SkeletonCardProps {
  className?: string
  imageHeight?: number
  hasImage?: boolean
  hasFooter?: boolean
}

export function SkeletonCard({ className, imageHeight = 200, hasImage = true, hasFooter = true }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm overflow-hidden", className)}>
      {hasImage && <Skeleton className="w-full h-[200px] rounded-none" />}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      {hasFooter && (
        <div className="border-t p-4 flex justify-between items-center">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}
    </div>
  )
}
