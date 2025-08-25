import DashboardHeader from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import ServerCard from "@/components/dashboard/server-card"

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 w-full">
            <ServerCard />
        </main>
      </div>
    </div>
  )
}
