import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileSettings } from "@/components/profile-settings"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <ProfileSettings />
    </DashboardShell>
  )
}
