import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
        <DashboardHeader />
        <Card className="mt-5">
            <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Welcome to your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
            {/* Dashboard content will go here */}
            </CardContent>
        </Card>
    </div>
  )
}
