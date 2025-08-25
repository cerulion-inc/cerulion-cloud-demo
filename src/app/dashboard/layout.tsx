import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "@/components/dashboard/header"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full">
      <DashboardHeader />

      <SidebarProvider defaultOpen={true}>
        {children}
      </SidebarProvider>
    </main>
  )
}
