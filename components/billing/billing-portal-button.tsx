"use client"

import { Button } from "@/components/ui/button"
import { createCustomerPortalSession } from "@/app/actions/billing-portal"
import { useState } from "react"
import Link from "next/link"

interface BillingPortalButtonProps {
  isSubscribed: boolean
  hasCustomerId: boolean
}

export function BillingPortalButton({ isSubscribed, hasCustomerId }: BillingPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      await createCustomerPortalSession()
    } catch (error) {
      console.error("Error opening billing portal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasCustomerId) {
    return (
      <Button asChild>
        <Link href="/pricing">Choose a Plan</Link>
      </Button>
    )
  }

  return (
    <Button onClick={handleManageSubscription} disabled={isLoading}>
      {isLoading ? "Loading..." : isSubscribed ? "Manage Subscription" : "Reactivate Subscription"}
    </Button>
  )
}
