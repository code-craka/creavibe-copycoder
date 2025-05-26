import type { Metadata } from "next"
import { HelpHeader } from "@/components/help/help-header"
import { FaqAccordion } from "@/components/help/faq-accordion"
import { ContactForm } from "@/components/help/contact-form"
import { StatusWidget } from "@/components/help/status-widget"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Help Center | CreaVibe",
  description: "Get help with CreaVibe. Find answers to frequently asked questions and contact our support team.",
}

export default function HelpPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <HelpHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Suspense fallback={<div className="h-96 w-full bg-muted/30 animate-pulse rounded-lg"></div>}>
            <FaqAccordion />
          </Suspense>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">System Status</h2>
            <Suspense fallback={<div className="h-40 w-full bg-muted/30 animate-pulse rounded-lg"></div>}>
              <StatusWidget />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
