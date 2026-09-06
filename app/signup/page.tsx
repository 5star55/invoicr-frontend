"use client"

import { AuthShell } from "@/components/auth-shell"
import { register, storeAuth } from "@/lib/api"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: event.target.value })
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const auth = await register(form)
      storeAuth(auth)
      router.push("/")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account."
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <AuthShell mode="signup">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Full name
          <input
            value={form.name}
            onChange={update("name")}
            type="text"
            placeholder="Jordan Park"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Email
          <input
            value={form.email}
            onChange={update("email")}
            type="email"
            placeholder="you@company.com"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Phone number
          <input
            value={form.phone}
            onChange={update("phone")}
            type="tel"
            placeholder="08012345678"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        <label className="block text-sm font-medium text-[#3c3f4d]">
          Password
          <input
            value={form.password}
            onChange={update("password")}
            type="password"
            placeholder="At least 8 characters"
            className="mt-2 h-12 w-full rounded-xl border border-[#e0e1e9] bg-white px-4 text-sm transition outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-[#7469ed] text-sm font-semibold text-white shadow-lg shadow-[#7469ed]/20 transition hover:bg-[#6257d6] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="pt-1 text-center text-xs leading-5 text-[#9295a4]">
          Your account is for your freelance business.
        </p>
      </form>
    </AuthShell>
  )
}
