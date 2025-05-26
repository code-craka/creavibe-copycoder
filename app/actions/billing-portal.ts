"use server"

import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Creates a Stripe Customer Portal session and redirects the user
 */
export async function createCustomerPortalSession() {
  try {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Get the user's Stripe customer ID
    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

    if (!profile?.stripe_customer_id) {
      throw new Error("No Stripe customer found for this user")
    }

    // Create a billing portal session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/billing`,
    })

    // Redirect to the portal
    if (session.url) {
      redirect(session.url)
    }

    return { url: session.url }
  } catch (error) {
    console.error("Error creating customer portal session:", error)
    throw new Error("Failed to create customer portal session")
  }
}
