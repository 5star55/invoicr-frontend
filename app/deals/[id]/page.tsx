"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getInvoice, getInvoices, type InvoiceDetails } from "@/lib/api"
import { useCurrency } from "@/components/currency-context"
import { DashboardShell, SectionHeader } from "@/components/dashboard-shell"
import { EditInvoiceForm } from "@/components/edit-forms"

export default function InvoiceDetailsPage() {
  const params = useParams<{ id: string }>()
  const { formatCurrency } = useCurrency()
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null)
  const [displayInvoiceId, setDisplayInvoiceId] = useState("")
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const invoiceId = Number(params.id)

    if (!Number.isInteger(invoiceId)) {
      setError("This invoice could not be found.")
      setLoading(false)
      return
    }

    getInvoice(invoiceId)
      .then(setInvoice)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load invoice.")
      )
      .finally(() => setLoading(false))
  }, [params.id])

  useEffect(() => {
    if (!invoice) return

    getInvoices().then((invoices) => {
      const orderedInvoices = [...invoices].sort(
        (first, second) =>
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime()
      )
      const index = orderedInvoices.findIndex((item) => item.id === invoice.id)

      if (index >= 0) {
        setDisplayInvoiceId(`INV-${String(index + 1).padStart(3, "0")}`)
      }
    })
  }, [invoice])

  return (
    <DashboardShell>
      <Link
        href="/deals"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7065e8] hover:text-[#5148c8]"
      >
        <ArrowLeft size={16} /> Back to invoices
      </Link>
      {loading ? (
        <p className="text-sm text-[#777b8f]">Loading invoice...</p>
      ) : error || !invoice ? (
        <p className="text-sm text-red-600">{error || "Invoice not found."}</p>
      ) : editing ? (
        <EditInvoiceForm
          invoice={invoice}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false)
            setLoading(true)
            getInvoice(invoice.id)
              .then(setInvoice)
              .catch((err) =>
                setError(
                  err instanceof Error
                    ? err.message
                    : "Unable to reload invoice."
                )
              )
              .finally(() => setLoading(false))
          }}
        />
      ) : (
        <>
          <SectionHeader
            eyebrow="Invoice details"
            title={displayInvoiceId || invoice.invoiceNumber}
            description={`Due ${new Date(invoice.dueDate).toLocaleDateString()}`}
            action={
              <button
                onClick={() => setEditing(true)}
                className="h-11 rounded-xl bg-[#7469ed] px-5 text-sm font-semibold text-white hover:bg-[#6257d6]"
              >
                Edit invoice
              </button>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
              <div className="flex items-start justify-between border-b border-[#f0f0f4] pb-5">
                <div>
                  <h2 className="font-semibold">{invoice.client.name}</h2>
                  <p className="mt-1 text-sm text-[#777b8f]">
                    {invoice.client.email}
                  </p>
                  {invoice.client.companyName && (
                    <p className="mt-1 text-sm text-[#777b8f]">
                      {invoice.client.companyName}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-[#eeeaff] px-2.5 py-1 text-[11px] font-semibold text-[#7065e8]">
                  {invoice.status}
                </span>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-120 text-left text-sm">
                  <thead className="border-b border-[#f0f0f4] text-[11px] tracking-[0.12em] text-[#a0a3b1] uppercase">
                    <tr>
                      <th className="pb-3 font-semibold">Description</th>
                      <th className="pb-3 font-semibold">Quantity</th>
                      <th className="pb-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-[#f4f4f7]">
                        <td className="py-4 font-medium">{item.description}</td>
                        <td className="py-4 text-[#777b8f]">{item.quantity}</td>
                        <td className="py-4 text-right font-semibold">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="h-fit rounded-2xl border border-[#e9eaf1] bg-white p-6">
              <h2 className="font-semibold">Summary</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between text-[#777b8f]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#777b8f]">
                  <span>Tax</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-[#f0f0f4] pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
              {invoice.notes && (
                <p className="mt-6 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#777b8f]">
                  {invoice.notes}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  )
}
