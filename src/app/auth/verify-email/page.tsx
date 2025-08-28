'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || type !== 'signup') {
          setStatus('error')
          setMessage('Invalid verification link. Please check your email for the correct link.')
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup'
        })

        if (error) {
          setStatus('error')
          setMessage(`Verification failed: ${error.message}`)
          return
        }

        setStatus('success')
        setMessage('Email verified successfully! You can now sign in to your account.')
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } catch (err) {
        console.error('Email verification error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred during verification.')
      }
    }

    handleEmailVerification()
  }, [router, searchParams, supabase])

  const handleResendEmail = async () => {
    try {
      const email = searchParams.get('email')
      if (!email) {
        toast.error('Email address not found. Please try signing up again.')
        return
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Verification email sent! Please check your inbox.')
    } catch (err) {
      console.error('Resend error:', err)
      toast.error('Failed to resend verification email.')
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg">
      <Card className="w-full relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
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
            
            {status === 'error' && (
              <div className="space-y-2">
                <Button onClick={handleResendEmail} variant="outline" size="sm">
                  Resend Verification Email
                </Button>
                <div className="text-xs text-muted-foreground">
                  Or <Link href="/auth/sign-up" className="underline">sign up again</Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardContent className="text-center pt-0">
          <Link href="/auth/login">
            <Button variant="outline">
              Go to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
      <ShineBorder
        className="absolute inset-0 pointer-events-none"
        shineColor={["#5ac8fa", "#007bff", "#5ac8fa"]}
      />
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="relative w-full max-w-md mx-auto rounded-lg">
        <Card className="w-full relative overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Spinner className="w-8 h-8" />
              <p className="text-muted-foreground">Initializing verification...</p>
            </div>
          </CardContent>
        </Card>
        <ShineBorder
          className="absolute inset-0 pointer-events-none"
          shineColor={["#5ac8fa", "#007bff", "#5ac8fa"]}
        />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
