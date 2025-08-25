import LoginForm from "@/components/auth/login-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute top-12 left-0 right-0 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cerulion
        </h1>
      </div>
      
      <div className="flex justify-center items-center min-h-[calc(100vh-73px)]">
        <LoginForm />
      </div>
    </main>
  )
}
