"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  createClient,
  createInvoice,
  getClients,
  type Client,
  type Invoice,
} from "@/lib/api"

function FormFrame({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#14162b]/45 p-5">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#777b8f] hover:bg-[#f5f6fa]"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-[#e0e1e9] px-3 text-sm outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"

export function CreateClientForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (client: Client) => void
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const client = await createClient({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        companyName: form.companyName || undefined,
        address: form.address || undefined,
      })
      onCreated(client)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create client.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormFrame title="Add contact" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Full name
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Email address
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Phone number
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block text-sm font-medium">
          Company name
          <input
            value={form.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block text-sm font-medium">
          Address
          <input
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            className={inputClassName}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={saving}
          className="h-11 w-full rounded-xl bg-[#7469ed] text-sm font-semibold text-white hover:bg-[#6257d6] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save contact"}
        </button>
      </form>
    </FormFrame>
  )
}

export function CreateInvoiceForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (invoice: Invoice) => void
}) {
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState({
    clientId: "",
    dueDate: "",
    description: "",
    quantity: "1",
    unitPrice: "",
    tax: "0",
    notes: "",
  })
  const [loadingClients, setLoadingClients] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load clients.")
      )
      .finally(() => setLoadingClients(false))
  }, [])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const quantity = Number(form.quantity)
    const unitPrice = Number(form.unitPrice)
    const tax = Number(form.tax) || 0

    try {
      const invoice = await createInvoice({
        clientId: Number(form.clientId),
        dueDate: form.dueDate,
        subtotal: quantity * unitPrice,
        tax,
        notes: form.notes || undefined,
        items: [
          {
            description: form.description,
            quantity,
            unitPrice,
          },
        ],
      })
      onCreated(invoice)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create invoice.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormFrame title="New invoice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Client
          <select
            value={form.clientId}
            onChange={(event) => update("clientId", event.target.value)}
            className={inputClassName}
            required
            disabled={loadingClients}
          >
            <option value="">
              {loadingClients ? "Loading clients..." : "Select a client"}
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
            className={inputClassName}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Description
          <input
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className={inputClassName}
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Quantity
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => update("quantity", event.target.value)}
              className={inputClassName}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Unit price
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.unitPrice}
              onChange={(event) => update("unitPrice", event.target.value)}
              className={inputClassName}
              required
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Tax
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.tax}
            onChange={(event) => update("tax", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block text-sm font-medium">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
            className="mt-2 min-h-20 w-full rounded-xl border border-[#e0e1e9] p-3 text-sm outline-none focus:border-[#8277f2] focus:ring-4 focus:ring-[#8277f2]/10"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={saving || loadingClients}
          className="h-11 w-full rounded-xl bg-[#7469ed] text-sm font-semibold text-white hover:bg-[#6257d6] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Create invoice"}
        </button>
      </form>
    </FormFrame>
  )
}
