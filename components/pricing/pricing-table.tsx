"use client"

import { CheckIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutButton } from "@/components/checkout/checkout-button"

interface PricingPlan {
  name: string
  description: string
  price: string
  priceId: string
  features: string[]
  popular?: boolean
}

interface PricingTableProps {
  plans: PricingPlan[]
}

export function PricingTable({ plans }: PricingTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <CheckoutButton
              priceId={plan.priceId}
              buttonText={plan.popular ? "Get Started" : "Subscribe"}
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
