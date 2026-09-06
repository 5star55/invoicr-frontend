import { DashboardShell } from "@/components/dashboard-shell"
import { LiveDashboard } from "@/components/live-dashboard"

export default function Page() {
  return (
    <DashboardShell>
      <LiveDashboard />
    </DashboardShell>
  )
}
