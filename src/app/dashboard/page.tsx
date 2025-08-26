import DashboardHeader from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import ServerCard from "@/components/dashboard/server-card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col p-4">
              <ServerCard />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
