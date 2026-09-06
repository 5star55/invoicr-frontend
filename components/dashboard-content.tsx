"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { getClients, getInvoices, type Client, type Invoice } from "@/lib/api"
import { useCurrency } from "./currency-context"
import { CreateClientForm, CreateInvoiceForm } from "./create-forms"
import { InvoiceStatusBadge } from "./invoice-status-badge"
import { SectionHeader } from "./dashboard-shell"

function DataMessage({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-sm text-[#777b8f]">{children}</p>
}

function ClientsList() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load clients.")
      )
      .finally(() => setLoading(false))
  }, [])

  const orderedClients = [...clients].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )

  return (
    <>
      <SectionHeader
        eyebrow="Relationships"
        title="Contacts"
        description="Clients connected to your Invoicr account."
        action={
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7469ed] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7469ed]/20 hover:bg-[#6257d6]"
          >
            <Plus size={17} /> Add contact
          </button>
        }
      />
      <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold">All contacts</h2>
          <span className="text-xs text-[#8a8d9e]">
            {loading ? "Loading..." : `${clients.length} records`}
          </span>
        </div>
        {error ? (
          <DataMessage>{error}</DataMessage>
        ) : loading ? (
          <DataMessage>Loading clients...</DataMessage>
        ) : orderedClients.length === 0 ? (
          <DataMessage>No clients found yet.</DataMessage>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-145 text-left text-sm">
              <thead className="border-b border-[#f0f0f4] text-[11px] tracking-[0.12em] text-[#a0a3b1] uppercase">
                <tr>
                  {["ID", "Name", "Email", "Company", "Phone"].map(
                    (heading) => (
                      <th key={heading} className="pb-3 font-semibold">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {orderedClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className="cursor-pointer border-b border-[#f4f4f7] last:border-0 hover:bg-[#fafaff]"
                    onClick={() => router.push(`/contacts/${client.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        router.push(`/contacts/${client.id}`)
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <td className="py-4 text-[#777b8f]">
                      {`CLI-${String(index + 1).padStart(3, "0")}`}
                    </td>
                    <td className="py-4 font-medium">
                      <Link
                        href={`/contacts/${client.id}`}
                        className="text-[#7065e8] hover:text-[#5148c8]"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="py-4 text-[#777b8f]">{client.email}</td>
                    <td className="py-4 text-[#777b8f]">
                      {client.companyName || "-"}
                    </td>
                    <td className="py-4 text-[#777b8f]">
                      {client.phone || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showForm && (
        <CreateClientForm
          onClose={() => setShowForm(false)}
          onCreated={(client) => setClients((current) => [client, ...current])}
        />
      )}
    </>
  )
}

function InvoicesList() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    Promise.all([getInvoices(), getClients()])
      .then(([invoiceData, clientData]) => {
        setInvoices(invoiceData)
        setClients(clientData)
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load invoices."
        )
      )
      .finally(() => setLoading(false))
  }, [])

  const orderedInvoices = [...invoices].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )
  const orderedClients = [...clients].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )

  return (
    <>
      <SectionHeader
        eyebrow="Invoices"
        title="Deals"
        description="Open an invoice to view its client, items, and totals."
        action={
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7469ed] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7469ed]/20 hover:bg-[#6257d6]"
          >
            <Plus size={17} /> New invoice
          </button>
        }
      />
      <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold">All invoices</h2>
          <span className="text-xs text-[#8a8d9e]">
            {loading ? "Loading..." : `${invoices.length} records`}
          </span>
        </div>
        {error ? (
          <DataMessage>{error}</DataMessage>
        ) : loading ? (
          <DataMessage>Loading invoices...</DataMessage>
        ) : orderedInvoices.length === 0 ? (
          <DataMessage>No invoices found yet.</DataMessage>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-145 text-left text-sm">
              <thead className="border-b border-[#f0f0f4] text-[11px] tracking-[0.12em] text-[#a0a3b1] uppercase">
                <tr>
                  {[
                    "Invoice ID",
                    "Client ID",
                    "Due date",
                    "Status",
                    "Total",
                  ].map((heading) => (
                    <th key={heading} className="pb-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderedInvoices.map((invoice, index) => {
                  const clientIndex = orderedClients.findIndex(
                    (client) => client.id === invoice.clientId
                  )

                  return (
                    <tr
                      key={invoice.id}
                      className="cursor-pointer border-b border-[#f4f4f7] last:border-0 hover:bg-[#fafaff]"
                      onClick={() => router.push(`/deals/${invoice.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          router.push(`/deals/${invoice.id}`)
                        }
                      }}
                      tabIndex={0}
                      role="link"
                    >
                      <td className="py-4 font-medium">
                        <Link
                          href={`/deals/${invoice.id}`}
                          className="text-[#7065e8] hover:text-[#5148c8]"
                        >
                          {`INV-${String(index + 1).padStart(3, "0")}`}
                        </Link>
                      </td>
                      <td className="py-4 text-[#777b8f]">
                        {clientIndex >= 0
                          ? `CLI-${String(clientIndex + 1).padStart(3, "0")}`
                          : "-"}
                      </td>
                      <td className="py-4 text-[#777b8f]">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <InvoiceStatusBadge invoice={invoice} />
                      </td>
                      <td className="py-4 font-semibold">
                        {formatCurrency(invoice.total)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showForm && (
        <CreateInvoiceForm
          onClose={() => setShowForm(false)}
          onCreated={(invoice) =>
            setInvoices((current) => [invoice, ...current])
          }
        />
      )}
    </>
  )
}

export function ListContent({ type }: { type: "contacts" | "deals" }) {
  return type === "contacts" ? <ClientsList /> : <InvoicesList />
}
