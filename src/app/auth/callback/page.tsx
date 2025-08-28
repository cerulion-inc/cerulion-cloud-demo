'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Spinner } from "@/components/ui/spinner"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the error and access_token from URL parameters
        const error = searchParams.get('error')
        const access_token = searchParams.get('access_token')
        const refresh_token = searchParams.get('refresh_token')

        if (error) {
          setStatus('error')
          setMessage(`Authentication failed: ${error}`)
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        }

        if (access_token && refresh_token) {
          // Set the session manually
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (sessionError) {
            setStatus('error')
            setMessage(`Session error: ${sessionError.message}`)
            setTimeout(() => {
              router.push('/auth/login')
            }, 3000)
            return
          }

          setStatus('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1500)
        } else {
          // Handle OAuth callback without explicit tokens
          const { data, error: callbackError } = await supabase.auth.getSession()
          
          if (callbackError || !data.session) {
            setStatus('error')
            setMessage('Failed to complete authentication. Please try again.')
            setTimeout(() => {
              router.push('/auth/login')
            }, 3000)
            return
          }

          setStatus('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1500)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase])

  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg">
      <Card className="w-full relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
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
            {status === 'error' && (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <p className="text-muted-foreground">{message}</p>
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
