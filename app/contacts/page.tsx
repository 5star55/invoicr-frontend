import { DashboardShell } from "@/components/dashboard-shell"
import { ListContent } from "@/components/dashboard-content"

export default function ContactsPage() {
  return (
    <DashboardShell>
      <ListContent type="contacts" />
    </DashboardShell>
  )
}
