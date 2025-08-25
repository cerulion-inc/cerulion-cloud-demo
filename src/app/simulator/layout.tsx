import DashboardHeader from "@/components/dashboard/header"

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  )
}
