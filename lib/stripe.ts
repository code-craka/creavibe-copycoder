import Stripe from "stripe"

// Initialize Stripe with the secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
  appInfo: {
    name: "Creavibe",
    version: "1.0.0",
  },
})

// Helper function to get the publishable key for client-side use
export function getPublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
}
