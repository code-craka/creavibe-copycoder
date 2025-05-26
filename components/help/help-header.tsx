import { Button } from "@/components/ui/button"
import { Search, BookOpen, LifeBuoy } from "lucide-react"
import Link from "next/link"

export function HelpHeader() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Help Center</h1>
      <p className="text-muted-foreground text-lg max-w-2xl">
        Find answers to common questions, browse our documentation, or contact our support team for assistance.
      </p>

      <div className="relative max-w-xl mt-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm border rounded-lg bg-background border-input focus:ring-primary focus:border-primary"
          placeholder="Search for help articles, topics, or questions..."
          required
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/docs">
            <BookOpen className="h-4 w-4" />
            <span>Documentation</span>
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/help/tickets">
            <LifeBuoy className="h-4 w-4" />
            <span>My Support Tickets</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
