import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarRight } from "@/components/simulator/chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"

export default function SimulatorPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
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
              <div className="mb-4 p-4 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Login Credentials </span><br />
                  <span className="font-mono">Username:</span> <span className="font-mono bg-blue-100 px-1 rounded">ubuntu</span><br />
                  <span className="font-mono">Password:</span> <span className="font-mono bg-blue-100 px-1 rounded">cerulion</span>
                </p>
              </div>
              <iframe 
                src="https://3.237.252.14:8443" 
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
  )
}
