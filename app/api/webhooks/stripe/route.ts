import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { sendEmail } from "@/lib/email"
import { SubscriptionCreatedEmail } from "@/components/emails/subscription-created"
import { SubscriptionUpdatedEmail } from "@/components/emails/subscription-updated"
import { SubscriptionCanceledEmail } from "@/components/emails/subscription-canceled"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Create a Supabase client
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  // Handle specific events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.client_reference_id
        const customerId = session.customer
        const subscriptionId = session.subscription

        if (userId && customerId && subscriptionId) {
          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
          const priceId = subscription.items.data[0].price.id

          // Determine the plan based on the price ID
          let plan = "free"
          if (priceId.includes("pro")) {
            plan = "pro"
          } else if (priceId.includes("enterprise")) {
            plan = "enterprise"
          }

          // Update the user's subscription information
          const { error } = await supabase
            .from("profiles")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          if (error) {
            console.error("Error updating user subscription:", error)
          }

          // Get user details for email
          const { data: user } = await supabase.from("profiles").select("email, full_name").eq("id", userId).single()

          if (user && user.email) {
            // Get price details
            const price = subscription.items.data[0].price
            const product = await stripe.products.retrieve(price.product as string)

            // Format amount
            const amount = (price.unit_amount! / 100).toFixed(2)
            const currency = price.currency.toUpperCase()
            const interval = price.recurring?.interval || "month"

            // Send subscription confirmation email
            await sendEmail({
              to: user.email,
              subject: `Welcome to ${product.name}!`,
              react: (
                <SubscriptionCreatedEmail
                  customerName={user.full_name || "there"}
                  planName={product.name}
                  amount={amount}
                  currency={currency}
                  interval={interval}
                  startDate={new Date(subscription.current_period_start * 1000).toLocaleDateString()}
                />
              ),
            })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId
        const oldPlanId = event.data.previous_attributes?.items?.data?.[0]?.price?.id

        if (userId) {
          const priceId = subscription.items.data[0].price.id

          // Determine the plan based on the price ID
          let plan = "free"
          if (priceId.includes("pro")) {
            plan = "pro"
          } else if (priceId.includes("enterprise")) {
            plan = "enterprise"
          }

          // Update the user's subscription information
          const { error } = await supabase
            .from("profiles")
            .update({
              plan,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          if (error) {
            console.error("Error updating user subscription:", error)
          }

          // If the plan changed, send an email
          if (oldPlanId) {
            // Get user details for email
            const { data: user } = await supabase.from("profiles").select("email, full_name").eq("id", userId).single()

            if (user && user.email) {
              // Get price details
              const price = subscription.items.data[0].price
              const newProduct = await stripe.products.retrieve(price.product as string)

              // Get old product details
              const oldPrice = await stripe.prices.retrieve(oldPlanId)
              const oldProduct = await stripe.products.retrieve(oldPrice.product as string)

              // Format amount
              const amount = (price.unit_amount! / 100).toFixed(2)
              const currency = price.currency.toUpperCase()
              const interval = price.recurring?.interval || "month"

              // Determine if this is an upgrade
              const isUpgrade = price.unit_amount! > oldPrice.unit_amount!

              // Send subscription updated email
              await sendEmail({
                to: user.email,
                subject: isUpgrade ? `Thank You for Upgrading to ${newProduct.name}!` : `Your Subscription Has Changed`,
                react: (
                  <SubscriptionUpdatedEmail
                    customerName={user.full_name || "there"}
                    oldPlanName={oldProduct.name}
                    newPlanName={newProduct.name}
                    amount={amount}
                    currency={currency}
                    interval={interval}
                    effectiveDate={new Date(subscription.current_period_start * 1000).toLocaleDateString()}
                    isUpgrade={isUpgrade}
                  />
                ),
              })
            }
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (userId) {
          // Reset the user to the free plan
          const { error } = await supabase
            .from("profiles")
            .update({
              plan: "free",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)

          if (error) {
            console.error("Error updating user subscription:", error)
          }

          // Get user details for email
          const { data: user } = await supabase.from("profiles").select("email, full_name").eq("id", userId).single()

          if (user && user.email) {
            // Get product details
            const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string)

            // Send subscription canceled email
            await sendEmail({
              to: user.email,
              subject: "Your Subscription Has Been Canceled",
              react: (
                <SubscriptionCanceledEmail
                  customerName={user.full_name || "there"}
                  planName={product.name}
                  endDate={new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                />
              ),
            })
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Webhook processing failed", { status: 500 })
  }

  return new NextResponse(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

// Disable body parsing, we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}
