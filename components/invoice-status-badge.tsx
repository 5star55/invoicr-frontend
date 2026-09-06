import {
  getInvoiceDisplayStatus,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/api"

const statusStyles: Record<InvoiceStatus, string> = {
  DRAFT: "bg-[#f1f2f6] text-[#75798b]",
  SENT: "bg-[#e8f3fb] text-[#3679aa]",
  PAID: "bg-[#e7f7ef] text-[#268956]",
  OVERDUE: "bg-[#fdebea] text-[#c2413b]",
  CANCELLED: "bg-[#eceef2] text-[#555b6f]",
}

export function InvoiceStatusBadge({
  invoice,
  status,
}: {
  invoice?: Pick<Invoice, "status" | "dueDate">
  status?: InvoiceStatus
}) {
  const displayStatus =
    status ?? (invoice ? getInvoiceDisplayStatus(invoice) : "DRAFT")

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[displayStatus]}`}
    >
      {displayStatus}
    </span>
  )
}
