"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  LineChart,
  Activity,
  Users,
  MousePointer,
  SplitSquareVertical,
  Settings,
  BarChart2,
  PieChart,
} from "lucide-react"

const items = [
  {
    title: "Overview",
    href: "/analytics",
    icon: <Activity className="mr-2 h-4 w-4" />,
  },
  {
    title: "Funnels",
    href: "/analytics?tab=funnels",
    icon: <BarChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Cohort Analysis",
    href: "/analytics/cohorts",
    icon: <BarChart2 className="mr-2 h-4 w-4" />,
  },
  {
    title: "User Lifecycle",
    href: "/analytics/lifecycle",
    icon: <PieChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "User Paths",
    href: "/analytics/paths",
    icon: <LineChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Heatmaps",
    href: "/analytics?tab=heatmaps",
    icon: <MousePointer className="mr-2 h-4 w-4" />,
  },
  {
    title: "A/B Tests",
    href: "/analytics?tab=abtests",
    icon: <SplitSquareVertical className="mr-2 h-4 w-4" />,
  },
  {
    title: "User Segments",
    href: "/analytics/segments",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/analytics/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {items.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (pathname === "/analytics" && item.href.includes("?tab=") && pathname + window.location.search === item.href)

        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
