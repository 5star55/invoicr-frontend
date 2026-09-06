"use client"

import { AuthShell } from "@/components/auth-shell"
import { login, storeAuth } from "@/lib/api"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const auth = await login(email, password)
      storeAuth(auth)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="login">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Email address
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@company.com"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          type="submit"
          className="h-12 w-full rounded-xl bg-[#7469ed] text-sm font-semibold text-white shadow-lg shadow-[#7469ed]/20 transition hover:bg-[#6257d6] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  )
}
