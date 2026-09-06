"use client"

import { useState } from "react"
import {
  updateClient,
  updateInvoice,
  type Client,
  type InvoiceDetails,
  type InvoiceStatus,
} from "@/lib/api"

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-[#e0e1e9] px-3 text-sm outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"

export function EditClientForm({
  client,
  onSaved,
  onCancel,
}: {
  client: Client
  onSaved: (client: Client) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone ?? "",
    companyName: client.companyName ?? "",
    address: client.address ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const updated = await updateClient(client.id, {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        companyName: form.companyName || null,
        address: form.address || null,
      })
      onSaved(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update client.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[#e9eaf1] bg-white p-6"
    >
      <h2 className="text-lg font-semibold">Edit client</h2>
      {(["name", "email", "phone", "companyName", "address"] as const).map(
        (field) => (
          <label key={field} className="block text-sm font-medium">
            {field === "companyName"
              ? "Company name"
              : field[0].toUpperCase() + field.slice(1)}
            <input
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              value={form[field]}
              onChange={(event) =>
                setForm({ ...form, [field]: event.target.value })
              }
              className={inputClassName}
              required={field === "name" || field === "email"}
            />
          </label>
        )
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl border border-[#e0e1e9] text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          disabled={saving}
          className="h-11 flex-1 rounded-xl bg-[#7469ed] text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  )
}

export function EditInvoiceForm({
  invoice,
  onSaved,
  onCancel,
}: {
  invoice: InvoiceDetails
  onSaved: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    issueDate: invoice.issueDate.slice(0, 10),
    dueDate: invoice.dueDate.slice(0, 10),
    subtotal: String(invoice.subtotal),
    tax: String(invoice.tax),
    status: invoice.status,
    notes: invoice.notes ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      await updateInvoice(invoice.id, {
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        subtotal: Number(form.subtotal),
        tax: Number(form.tax),
        status: form.status,
        notes: form.notes || null,
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update invoice.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e9eaf1] bg-white p-6"
    >
      <h2 className="mb-5 text-lg font-semibold">Edit invoice</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Issue date
          <input
            type="date"
            value={form.issueDate}
            onChange={(event) =>
              setForm({ ...form, issueDate: event.target.value })
            }
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm({ ...form, dueDate: event.target.value })
            }
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Subtotal
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.subtotal}
            onChange={(event) =>
              setForm({ ...form, subtotal: event.target.value })
            }
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Tax
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.tax}
            onChange={(event) => setForm({ ...form, tax: event.target.value })}
            className={inputClassName}
            required
          />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium">
        Status
        <select
          value={form.status}
          onChange={(event) =>
            setForm({ ...form, status: event.target.value as InvoiceStatus })
          }
          className={inputClassName}
        >
          {["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm font-medium">
        Notes
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          className="mt-2 min-h-20 w-full rounded-xl border border-[#e0e1e9] p-3 text-sm outline-none focus:border-[#8277f2]"
        />
      </label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl border border-[#e0e1e9] text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          disabled={saving}
          className="h-11 flex-1 rounded-xl bg-[#7469ed] text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  )
}
