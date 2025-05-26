"use server"

import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/canceled`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    })

    // Redirect to the checkout URL if it exists
    if (session.url) {
      redirect(session.url)
    }

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}
