"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Invoice {
  id: string
  number: string
  status: string
  created: number
  amount_paid: number
  currency: string
  hosted_invoice_url: string
  invoice_pdf: string
}

interface InvoiceListProps {
  customerId: string | null
}

export function InvoiceList({ customerId }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvoices() {
      if (!customerId) {
        setInvoices([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/invoices?customerId=${customerId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch invoices")
        }

        const data = await response.json()
        setInvoices(data.invoices)
      } catch (err) {
        console.error("Error fetching invoices:", err)
        setError("Failed to load invoices. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [customerId])

  if (!customerId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No billing history available.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center justify-between py-4 border-b">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No invoices found.</p>
      </div>
    )
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Date</th>
              <th className="text-left py-2 font-medium">Invoice</th>
              <th className="text-left py-2 font-medium">Amount</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="py-4">{formatDate(new Date(invoice.created * 1000))}</td>
                <td className="py-4">{invoice.number}</td>
                <td className="py-4">{formatCurrency(invoice.amount_paid, invoice.currency)}</td>
                <td className="py-4 capitalize">{invoice.status}</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(invoice.invoice_pdf, "_blank")}>
                      <FileDown className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(invoice.hosted_invoice_url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
