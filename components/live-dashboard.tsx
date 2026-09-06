"use client"

import {
  ArrowUpRight,
  BriefcaseBusiness,
  DollarSign,
  Plus,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getClients, getInvoices, type Client, type Invoice } from "@/lib/api"
import { useAuthUser } from "./auth-user-context"
import { useCurrency } from "./currency-context"
import { PageLink, SectionHeader } from "./dashboard-shell"

function DataMessage({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-sm text-[#777b8f]">{children}</p>
}

export function LiveDashboard() {
  const user = useAuthUser()
  const { formatCurrency } = useCurrency()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getInvoices(), getClients()])
      .then(([invoiceData, clientData]) => {
        setInvoices(invoiceData)
        setClients(clientData)
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load dashboard data."
        )
      )
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + (Number(invoice.total) || 0),
    0
  )
  const paidInvoices = invoices.filter((invoice) => invoice.status === "PAID")
  const paidRevenue = paidInvoices.reduce(
    (sum, invoice) => sum + (Number(invoice.total) || 0),
    0
  )
  const outstandingRevenue = invoices
    .filter((invoice) => !["PAID", "CANCELLED"].includes(invoice.status))
    .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0)
  const averageInvoice = invoices.length ? totalRevenue / invoices.length : 0
  const displayName = user?.name?.trim() || "Freelancer"
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - (5 - index))
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      total: 0,
    }
  })

  invoices.forEach((invoice) => {
    const date = new Date(invoice.issueDate)
    const month = months.find(
      (item) => item.key === `${date.getFullYear()}-${date.getMonth()}`
    )
    if (month) month.total += Number(invoice.total) || 0
  })

  const maximumRevenue = Math.max(...months.map((month) => month.total), 1)

  return (
    <>
      <SectionHeader
        eyebrow="Overview"
        title={`Welcome back, ${displayName}`}
        description="Here is the current state of your invoices and clients."
        action={
          <Link
            href="/deals"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7469ed] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7469ed]/20 transition hover:bg-[#6257d6]"
          >
            <Plus size={17} /> New invoice
          </Link>
        }
      />
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
          <DataMessage>Loading your dashboard...</DataMessage>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total invoiced",
                value: formatCurrency(totalRevenue),
                icon: DollarSign,
                color: "bg-[#e8f7ef] text-[#26965c]",
              },
              {
                label: "Paid invoices",
                value: paidInvoices.length.toLocaleString(),
                icon: BriefcaseBusiness,
                color: "bg-[#eeeaff] text-[#7166e7]",
              },
              {
                label: "Clients",
                value: clients.length.toLocaleString(),
                icon: Users,
                color: "bg-[#fff1e7] text-[#dd8956]",
              },
              {
                label: "Outstanding",
                value: formatCurrency(outstandingRevenue),
                icon: ArrowUpRight,
                color: "bg-[#e8f3fb] text-[#478cc0]",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e9eaf1] bg-white p-5"
              >
                <div
                  className={`grid size-10 place-items-center rounded-xl ${color}`}
                >
                  <Icon size={18} />
                </div>
                <p className="mt-6 text-sm text-[#818496]">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Revenue overview</h2>
                  <p className="mt-1 text-xs text-[#8a8d9e]">Last six months</p>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              {invoices.length === 0 ? (
                <DataMessage>No invoice revenue to display yet.</DataMessage>
              ) : (
                <div className="mt-8 flex h-48 items-end gap-3 sm:gap-5">
                  {months.map((month) => (
                    <div
                      key={month.key}
                      className="flex h-full flex-1 flex-col justify-end gap-2"
                    >
                      <div
                        className="w-full rounded-t-md bg-[#8277f2]"
                        style={{
                          height: `${Math.max((month.total / maximumRevenue) * 100, 3)}%`,
                        }}
                        title={formatCurrency(month.total)}
                      />
                      <span className="text-center text-[10px] text-[#a2a4b0]">
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-[#e9eaf1] bg-white p-6">
              <h2 className="font-semibold">Invoice summary</h2>
              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#777b8f]">Paid revenue</span>
                  <span className="font-semibold">
                    {formatCurrency(paidRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#777b8f]">Average invoice</span>
                  <span className="font-semibold">
                    {formatCurrency(averageInvoice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#777b8f]">Total invoices</span>
                  <span className="font-semibold">{invoices.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[#e9eaf1] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">Recent invoices</h2>
              <PageLink href="/deals">View all</PageLink>
            </div>
            {invoices.length === 0 ? (
              <DataMessage>No invoices found yet.</DataMessage>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-145 text-left text-sm">
                  <thead className="border-b border-[#f0f0f4] text-[11px] tracking-[0.12em] text-[#a0a3b1] uppercase">
                    <tr>
                      <th className="pb-3 font-semibold">Invoice</th>
                      <th className="pb-3 font-semibold">Due date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 5).map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-[#f4f4f7] last:border-0"
                      >
                        <td className="py-4 font-medium">
                          <Link
                            href={`/deals/${invoice.id}`}
                            className="text-[#7065e8] hover:text-[#5148c8]"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-4 text-[#777b8f]">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-[#eeeaff] px-2.5 py-1 text-[11px] font-semibold text-[#7065e8]">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-semibold">
                          {formatCurrency(invoice.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
