import type { Metadata } from "next"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCheckoutSession, updateUserSubscription } from "@/app/actions/checkout"

export const metadata: Metadata = {
  title: "Checkout Success | Creavibe",
  description: "Your subscription has been successfully processed",
}

interface SuccessPageProps {
  searchParams: {
    session_id?: string
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id

  let checkoutData = null
  let error = null

  if (sessionId) {
    try {
      // Get the checkout session details
      const session = await getCheckoutSession(sessionId)

      // Update the user's subscription in the database
      await updateUserSubscription(sessionId)

      checkoutData = {
        customerEmail: typeof session.customer === "string" ? "" : session.customer?.email,
        amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
        currency: session.currency?.toUpperCase() || "USD",
      }
    } catch (e) {
      error = "Failed to retrieve checkout information. Please contact support if you have any questions."
      console.error("Error retrieving checkout session:", e)
    }
  } else {
    error = "No checkout session ID provided."
  }

  return (
    <div className="container max-w-lg py-12">
      <div className="bg-card rounded-lg shadow-lg p-8 text-center">
        {error ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-500">Checkout Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild>
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your subscription. Your payment has been processed successfully.
            </p>

            {checkoutData && (
              <div className="bg-muted p-4 rounded-md text-left">
                <p>
                  <strong>Email:</strong> {checkoutData.customerEmail}
                </p>
                <p>
                  <strong>Amount:</strong> {checkoutData.currency} {checkoutData.amount}
                </p>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <div>
                <Link href="/billing" className="text-sm text-primary hover:underline">
                  View billing details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
