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
import { clearStoredAuth } from "@/lib/api"
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
  const user = useAuthUser()
  const displayName = user?.name?.trim() || "Freelancer"
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

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
              N
            </span>
            Nimbus
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
              className="h-10 w-full rounded-xl bg-[#f5f6fa] pr-4 pl-10 text-sm outline-none placeholder:text-[#a4a6b5] focus:ring-2 focus:ring-[#8a7dff]/25"
              placeholder="Search anything..."
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-xl text-[#73768a] hover:bg-[#f5f6fa]"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
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
