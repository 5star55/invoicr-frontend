"use client"

import { getProfile, getStoredAuth, type User } from "@/lib/api"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthUserProvider } from "./auth-user-context"

const publicRoutes = ["/login", "/signup"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (isPublicRoute) {
      setAuthChecked(true)
      return
    }

    const auth = getStoredAuth()

    if (!auth) {
      router.replace("/login")
      return
    }

    getProfile(auth.id)
      .then(setUser)
      .catch(() => router.replace("/login"))
      .finally(() => setAuthChecked(true))
  }, [isPublicRoute, router])

  if (!isPublicRoute && !authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f8fc] text-sm text-[#777b8f]">
        Checking your session...
      </div>
    )
  }

  return <AuthUserProvider user={user}>{children}</AuthUserProvider>
}
