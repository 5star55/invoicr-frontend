"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import { useEffect } from "react"
import {
  clearStoredAuth,
  getClients,
  getInvoiceDisplayStatus,
  getInvoices,
  type Client,
  type Invoice,
} from "@/lib/api"
import { useAuthUser } from "./auth-user-context"

type DashboardShellProps = {
  children: React.ReactNode
}

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/deals", label: "Deals", icon: BriefcaseBusiness },
]

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const user = useAuthUser()
  const displayName = user?.name?.trim() || "Freelancer"
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const orderedClients = [...clients].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )
  const orderedInvoices = [...invoices].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )

  useEffect(() => {
    Promise.all([getClients(), getInvoices()])
      .then(([clientData, invoiceData]) => {
        setClients(clientData)
        setInvoices(invoiceData)
      })
      .catch(() => {
        setClients([])
        setInvoices([])
      })
  }, [])

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const matchingClients = normalizedSearch
    ? orderedClients.filter((client, index) =>
        [
          `CLI-${String(index + 1).padStart(3, "0")}`,
          client.name,
          client.email,
          client.companyName,
          client.phone,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))
      )
    : []
  const matchingInvoices = normalizedSearch
    ? orderedInvoices.filter((invoice, index) =>
        [
          `INV-${String(index + 1).padStart(3, "0")}`,
          getInvoiceDisplayStatus(invoice),
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      )
    : []
  const hasSearchResults =
    matchingClients.length > 0 || matchingInvoices.length > 0
  const notifications = orderedInvoices
    .map((invoice) => ({
      invoice,
      status: getInvoiceDisplayStatus(invoice),
    }))
    .filter(({ invoice, status }) => {
      if (status === "OVERDUE") return true
      if (status === "PAID" || status === "CANCELLED") return false

      const dueDate = new Date(`${invoice.dueDate.slice(0, 10)}T00:00:00`)
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      return daysUntilDue >= 0 && daysUntilDue <= 7
    })

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#20212b]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#1f2340] px-5 py-6 text-white transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-[#8a7dff] text-sm text-white">
              I
            </span>
            Invoicr
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-12 flex-1">
          <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
            Account
          </p>
          <nav className="mt-3 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"}`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {label}
                </Link>
              )
            })}
          </nav>
          <p className="mt-10 px-3 text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
            Manage
          </p>
          <nav className="mt-3">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === "/settings" ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"}`}
            >
              <Settings size={17} strokeWidth={1.8} />
              Settings
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="mb-4 rounded-2xl bg-[#2c3152] p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold">Freelancer plan</p>
              <span className="rounded-full bg-[#8a7dff]/20 px-2 py-0.5 text-[9px] text-[#bcb6ff]">
                PRO
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Keep your clients and invoices organized in one place.
            </p>
            <button className="mt-3 text-xs font-semibold text-[#bcb6ff] hover:text-white">
              Upgrade plan <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="grid size-9 place-items-center rounded-full bg-[#f0a58e] text-xs font-bold text-[#562f35]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-white/40">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                clearStoredAuth()
                router.replace("/login")
              }}
              className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-[#14162b]/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <main className="lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-[#e9eaf1] bg-white/75 px-5 backdrop-blur md:px-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#73768a] hover:bg-[#f0f1f7] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="relative hidden w-full max-w-xs md:block">
            <Search
              size={17}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#a4a6b5]"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-xl bg-[#f5f6fa] pr-4 pl-10 text-sm outline-none placeholder:text-[#a4a6b5] focus:ring-2 focus:ring-[#8a7dff]/25"
              placeholder="Search anything..."
            />
            {normalizedSearch && (
              <div className="absolute top-12 right-0 left-0 z-50 overflow-hidden rounded-xl border border-[#e9eaf1] bg-white shadow-xl">
                {hasSearchResults ? (
                  <div className="max-h-80 overflow-y-auto py-2">
                    {matchingClients.map((client) => {
                      const clientIndex = orderedClients.findIndex(
                        (item) => item.id === client.id
                      )

                      return (
                        <Link
                          key={`client-${client.id}`}
                          href={`/contacts/${client.id}`}
                          onClick={() => setSearchQuery("")}
                          className="block px-4 py-3 hover:bg-[#f7f8fc]"
                        >
                          <p className="text-sm font-semibold">
                            CLI-{String(clientIndex + 1).padStart(3, "0")} ·{" "}
                            {client.name}
                          </p>
                          <p className="mt-1 text-xs text-[#8a8d9e]">
                            Client · {client.email}
                          </p>
                        </Link>
                      )
                    })}
                    {matchingInvoices.map((invoice) => {
                      const invoiceIndex = orderedInvoices.findIndex(
                        (item) => item.id === invoice.id
                      )

                      return (
                        <Link
                          key={`invoice-${invoice.id}`}
                          href={`/deals/${invoice.id}`}
                          onClick={() => setSearchQuery("")}
                          className="block px-4 py-3 hover:bg-[#f7f8fc]"
                        >
                          <p className="text-sm font-semibold">
                            INV-{String(invoiceIndex + 1).padStart(3, "0")}
                          </p>
                          <p className="mt-1 text-xs text-[#8a8d9e]">
                            Invoice · {getInvoiceDisplayStatus(invoice)}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="px-4 py-4 text-sm text-[#777b8f]">
                    No clients or invoices found.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setNotificationsOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-xl text-[#73768a] hover:bg-[#f5f6fa]"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute mt-[-22px] ml-5 grid size-4 place-items-center rounded-full bg-[#e87979] text-[9px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute top-16 right-20 z-50 w-80 overflow-hidden rounded-xl border border-[#e9eaf1] bg-white shadow-xl">
                <div className="border-b border-[#f0f0f4] px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-5 text-sm text-[#777b8f]">
                    You are all caught up.
                  </p>
                ) : (
                  notifications.map(({ invoice, status }) => (
                    <Link
                      key={invoice.id}
                      href={`/deals/${invoice.id}`}
                      onClick={() => setNotificationsOpen(false)}
                      className="block border-b border-[#f4f4f7] px-4 py-3 hover:bg-[#f7f8fc]"
                    >
                      <p className="text-sm font-semibold">
                        {status === "OVERDUE"
                          ? "Invoice overdue"
                          : "Invoice due soon"}
                      </p>
                      <p className="mt-1 text-xs text-[#777b8f]">
                        {invoice.invoiceNumber} · Due{" "}
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}
            <button
              className="grid size-10 place-items-center rounded-xl text-[#73768a] hover:bg-[#f5f6fa]"
              aria-label="Help"
            >
              <CircleHelp size={18} />
            </button>
            <div className="hidden h-7 w-px bg-[#e9eaf1] sm:block" />
            <span className="hidden text-sm font-semibold sm:block">
              {displayName}
            </span>
            <div className="grid size-9 place-items-center rounded-full bg-[#f0a58e] text-xs font-bold text-[#562f35]">
              {initials}
            </div>
          </div>
        </header>
        <div className="px-5 py-8 md:px-10">{children}</div>
      </main>
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-[#8a7dff] uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-[#20212b] md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-[#777b8f]">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function PageLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold text-[#7065e8] hover:text-[#5148c8]"
    >
      {children}
    </Link>
  )
}

export { FileText }
