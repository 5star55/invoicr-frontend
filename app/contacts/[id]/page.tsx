"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getClient, getClients, type Client } from "@/lib/api"
import { DashboardShell, SectionHeader } from "@/components/dashboard-shell"
import { EditClientForm } from "@/components/edit-forms"

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [displayClientId, setDisplayClientId] = useState("")
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const clientId = Number(params.id)

    if (!Number.isInteger(clientId)) {
      setError("This client could not be found.")
      setLoading(false)
      return
    }

    getClient(clientId)
      .then(setClient)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load client.")
      )
      .finally(() => setLoading(false))
  }, [params.id])

  useEffect(() => {
    if (!client) return

    getClients().then((clients) => {
      const orderedClients = [...clients].sort(
        (first, second) =>
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime()
      )
      const index = orderedClients.findIndex((item) => item.id === client.id)

      if (index >= 0) {
        setDisplayClientId(`CLI-${String(index + 1).padStart(3, "0")}`)
      }
    })
  }, [client])

  return (
    <DashboardShell>
      <Link
        href="/contacts"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7065e8] hover:text-[#5148c8]"
      >
        <ArrowLeft size={16} /> Back to contacts
      </Link>
      {loading ? (
        <p className="text-sm text-[#777b8f]">Loading client...</p>
      ) : error || !client ? (
        <p className="text-sm text-red-600">{error || "Client not found."}</p>
      ) : editing ? (
        <EditClientForm
          client={client}
          onSaved={(updated) => {
            setClient(updated)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <SectionHeader
            eyebrow={displayClientId || "Client details"}
            title={client.name}
            description={client.companyName || client.email}
            action={
              <button
                onClick={() => setEditing(true)}
                className="h-11 rounded-xl bg-[#7469ed] px-5 text-sm font-semibold text-white hover:bg-[#6257d6]"
              >
                Edit client
              </button>
            }
          />
          <div className="max-w-2xl rounded-2xl border border-[#e9eaf1] bg-white p-6">
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs tracking-[0.12em] text-[#a0a3b1] uppercase">
                  Email
                </dt>
                <dd className="mt-1 text-sm font-medium">{client.email}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.12em] text-[#a0a3b1] uppercase">
                  Phone
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {client.phone || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.12em] text-[#a0a3b1] uppercase">
                  Company
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {client.companyName || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.12em] text-[#a0a3b1] uppercase">
                  Address
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {client.address || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </DashboardShell>
  )
}
