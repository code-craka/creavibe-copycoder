import type { Metadata } from "next"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Checkout Cancelled | Creavibe",
  description: "Your checkout process was cancelled",
}

export default function CancelPage() {
  return (
    <div className="container max-w-lg py-12">
      <div className="bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Checkout Cancelled</h1>
          <p className="text-muted-foreground">Your checkout process was cancelled. No charges were made.</p>

          <div className="space-y-4 pt-4">
            <Button asChild>
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
            <div>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Need help? Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
