import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ServerCard from "@/components/dashboard/server-card"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Cerulion Cloud dashboard. Monitor your infrastructure and manage your resources.
          </p>
        </div>
        <ServerCard />
      </div>
    </DashboardLayout>
  )
}
