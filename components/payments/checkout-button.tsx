"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Loader2 } from "lucide-react"

interface CheckoutButtonProps {
  priceId: string
  userId: string
  buttonText?: string
  className?: string
}

export function CheckoutButton({ priceId, userId, buttonText = "Checkout", className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      await createCheckoutSession(priceId, userId)
    } catch (error) {
      console.error("Checkout error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}
