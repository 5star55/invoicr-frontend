import { DashboardShell } from "@/components/dashboard-shell"
import { ListContent } from "@/components/dashboard-content"

export default function DealsPage() {
  return (
    <DashboardShell>
      <ListContent type="deals" />
    </DashboardShell>
  )
}
