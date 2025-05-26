import type { Metadata } from "next"
import { PricingTable } from "@/components/pricing/pricing-table"

export const metadata: Metadata = {
  title: "Pricing | Creavibe",
  description: "Choose the perfect plan for your needs",
}

// These would typically come from your CMS or API
const pricingPlans = [
  {
    name: "Free",
    description: "Basic features for personal use",
    price: "$0",
    priceId: "price_free", // This would be a real Stripe price ID in production
    features: ["5 projects", "Basic analytics", "24-hour support response time", "Community access"],
  },
  {
    name: "Pro",
    description: "Everything you need for professional use",
    price: "$19",
    priceId: "price_1OXYZXYourStripeKeyHere", // Replace with your actual Stripe price ID
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "4-hour support response time",
      "API access",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Advanced features for teams and businesses",
    price: "$49",
    priceId: "price_1OXYZYYourStripeKeyHere", // Replace with your actual Stripe price ID
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SSO authentication",
      "Advanced security features",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="mt-12">
        <PricingTable plans={pricingPlans} />
      </div>

      <div className="mt-12 text-center text-muted-foreground">
        <p>
          Need a custom plan?{" "}
          <a href="/contact" className="underline text-primary">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}
