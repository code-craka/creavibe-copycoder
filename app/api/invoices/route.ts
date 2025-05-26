import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    // Verify the user is authorized to access these invoices
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the customer ID belongs to this user
    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

    if (!profile || profile.stripe_customer_id !== customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
      status: "paid",
    })

    return NextResponse.json({
      invoices: invoices.data.map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        created: invoice.created,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        hosted_invoice_url: invoice.hosted_invoice_url,
        invoice_pdf: invoice.invoice_pdf,
      })),
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
