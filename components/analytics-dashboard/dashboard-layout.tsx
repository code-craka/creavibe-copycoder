import type { ReactNode } from "react"
import { DateRangePicker } from "@/components/analytics-dashboard/date-range-picker"
import { SegmentFilter } from "@/components/analytics-dashboard/segment-filter"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <DateRangePicker />
          <SegmentFilter />
        </div>
      </div>
      {children}
    </div>
  )
}
