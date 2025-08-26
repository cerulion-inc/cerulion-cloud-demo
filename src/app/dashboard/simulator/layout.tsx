export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden [--header-height:3.5rem]">
      {children}
    </div>
  )
}
