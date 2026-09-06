"use client"

import { createContext, useContext } from "react"
import type { User } from "@/lib/api"

const AuthUserContext = createContext<User | null>(null)

export function AuthUserProvider({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) {
  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  )
}

export function useAuthUser() {
  return useContext(AuthUserContext)
}
