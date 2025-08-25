import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Simulator</CardTitle>
              <CardDescription>Welcome to your Simulator</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Dashboard content will go here */}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
