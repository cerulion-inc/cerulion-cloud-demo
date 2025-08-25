import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/simulator/chat"
import DashboardHeader from "@/components/dashboard/header"

export default function SimulatorPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Simulation Environment</CardTitle>
                  <CardDescription>Interactive cloud infrastructure simulation</CardDescription>
                </CardHeader>
                {/* TODO: Make the height of the iframe dynamic */}
                <CardContent>
                  <iframe 
                    src="https://fr.wikipedia.org/wiki/Main_Page" 
                    className="w-full h-[70vh]"
                    title="Simulation Environment"
                  />
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
          <SidebarRight />
        </SidebarProvider>
      </div>
    </div>
  )
}
