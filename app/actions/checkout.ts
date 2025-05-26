"use server"

import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type PriceData = {
  id: string
  name: string
  description?: string
  amount: number
  currency: string
  interval?: "month" | "year" | "one-time"
}

/**
 * Creates a Stripe checkout session for the specified price
 */
export async function createCheckoutSession(priceId: string) {
  try {
    // Get the current user
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

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
      mode: "subscription",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      allow_promotion_codes: true,
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

/**
 * Retrieves a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer", "line_items"],
    })
    return session
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    throw new Error("Failed to retrieve checkout session")
  }
}

/**
 * Updates the user's subscription information in the database
 */
export async function updateUserSubscription(sessionId: string) {
  try {
    const session = await getCheckoutSession(sessionId)

    if (!session || !session.customer || !session.subscription) {
      throw new Error("Invalid checkout session")
    }

    const supabase = getSupabaseServerClient()
    const userId = session.client_reference_id

    if (!userId) {
      throw new Error("No user ID found in session")
    }

    // Update the user's subscription information
    const { error } = await supabase
      .from("profiles")
      .update({
        stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer.id,
        stripe_subscription_id:
          typeof session.subscription === "string" ? session.subscription : session.subscription.id,
        plan: session.metadata?.plan || "pro", // Default to "pro" if not specified
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw error
    }

    // Revalidate relevant paths
    revalidatePath("/billing")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating user subscription:", error)
    throw new Error("Failed to update user subscription")
  }
}
