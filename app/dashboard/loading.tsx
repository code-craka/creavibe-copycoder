import { Container } from "@/components/ui/container"
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <Container className="py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg border">
              <SkeletonCard className="h-[220px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer -translate-x-full" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
