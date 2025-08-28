'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Spinner } from "@/components/ui/spinner"

export default function LogoutPage() {
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('Logout error:', error)
        }

        setStatus('success')
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 1500)
      } catch (err) {
        console.error('Logout error:', err)
        // Still redirect even if there's an error
        setTimeout(() => {
          router.push('/auth/login')
        }, 1500)
      }
    }

    handleLogout()
  }, [router, supabase])

  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg">
      <Card className="w-full relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' ? 'Signing Out...' : 'Signed Out'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <Spinner className="w-8 h-8" />
            )}
            {status === 'success' && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <p className="text-muted-foreground">
              {status === 'loading' 
                ? 'Please wait while we sign you out...' 
                : 'You have been successfully signed out. Redirecting to login...'
              }
            </p>
          </div>
        </CardContent>
      </Card>
      <ShineBorder
        className="absolute inset-0 pointer-events-none"
        shineColor={["#5ac8fa", "#007bff", "#5ac8fa"]}
      />
    </div>
  )
}
