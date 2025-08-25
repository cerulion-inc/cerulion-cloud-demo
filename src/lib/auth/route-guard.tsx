'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type RouteGuardProps = {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const verifyAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }
      
      setIsVerified(true)
    }
    
    verifyAuth()
  }, [router])
  
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-blue-400 h-12 w-12 mb-4"></div>
          <div className="text-gray-600">Verifying authentication...</div>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
} 