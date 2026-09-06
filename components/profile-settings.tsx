"use client"

import { useEffect, useState } from "react"
import { getProfile, getStoredAuth, updateProfile, type User } from "@/lib/api"
import { useCurrency } from "./currency-context"
import { SectionHeader } from "./dashboard-shell"

export function ProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { currency, setCurrency } = useCurrency()

  useEffect(() => {
    const auth = getStoredAuth()
    if (!auth) {
      setError("Sign in to manage your profile.")
      setLoading(false)
      return
    }
    getProfile(auth.id)
      .then((user) =>
        setProfile({
          name: user.name ?? "",
          email: user.email,
          phone: user.phone,
        })
      )
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load your profile."
        )
      )
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const auth = getStoredAuth()
    if (!auth) {
      setError("Sign in to manage your profile.")
      return
    }
    setSaving(true)
    setMessage("")
    setError("")
    try {
      const updated = await updateProfile(auth.id, profile)
      setProfile({
        name: updated.name ?? "",
        email: updated.email,
        phone: updated.phone,
      })
      setMessage("Profile saved.")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your profile."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SectionHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your freelancer profile and contact details."
      />
      <div className="max-w-2xl rounded-2xl border border-[#e9eaf1] bg-white p-6">
        <div className="mb-6">
          <h2 className="font-semibold">Profile details</h2>
          <p className="mt-1 text-sm text-[#777b8f]">
            These details appear on your Invoicr account.
          </p>
        </div>
        {loading ? (
          <p className="text-sm text-[#777b8f]">Loading profile...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium">
              Full name
              <input
                value={profile.name}
                onChange={(event) =>
                  setProfile({ ...profile, name: event.target.value })
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#e4e5ec] px-3 text-sm outline-none focus:border-[#8277f2]"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Email address
              <input
                value={profile.email}
                onChange={(event) =>
                  setProfile({ ...profile, email: event.target.value })
                }
                type="email"
                className="mt-2 h-11 w-full rounded-xl border border-[#e4e5ec] px-3 text-sm outline-none focus:border-[#8277f2]"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Phone number
              <input
                value={profile.phone}
                onChange={(event) =>
                  setProfile({ ...profile, phone: event.target.value })
                }
                type="tel"
                className="mt-2 h-11 w-full rounded-xl border border-[#e4e5ec] px-3 text-sm outline-none focus:border-[#8277f2]"
                required
              />
            </label>
            {message && <p className="text-sm text-[#29935d]">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              disabled={saving}
              className="rounded-xl bg-[#7469ed] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6257d6] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
        <div className="mt-8 border-t border-[#f0f0f4] pt-6">
          <h2 className="font-semibold">Currency</h2>
          <p className="mt-1 text-sm text-[#777b8f]">
            Choose how invoice amounts are displayed across the app.
          </p>
          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as typeof currency)
            }
            className="mt-4 h-11 w-full rounded-xl border border-[#e4e5ec] px-3 text-sm outline-none focus:border-[#8277f2] sm:max-w-xs"
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="NGN">Nigerian Naira (NGN)</option>
          </select>
        </div>
      </div>
    </>
  )
}
