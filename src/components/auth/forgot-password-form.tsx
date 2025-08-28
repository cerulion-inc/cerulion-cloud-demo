'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { toast } from "sonner"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.NODE_ENV === 'production' 
          ? 'https://app.cerulion.com/auth/reset-password'
          : `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setEmailSent(true)
      toast.success('Password reset email sent! Please check your inbox.')
    } catch (err) {
      console.error('Password reset error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="relative w-full max-w-md mx-auto rounded-lg">
        <Card className="w-full relative overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to reset your password. The link will expire in 1 hour.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p>
              Didn't receive the email?{' '}
              <button 
                onClick={() => setEmailSent(false)}
                className="underline cursor-pointer"
              >
                Try again
              </button>
            </p>
          </CardFooter>
        </Card>
        <ShineBorder
          className="absolute inset-0 pointer-events-none"
          shineColor={["#5ac8fa", "#007bff", "#5ac8fa"]}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg">
      <Card className="w-full relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Remember your password?{' '}
            <Link href="/auth/login" className="underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
      <ShineBorder
        className="absolute inset-0 pointer-events-none"
        shineColor={["#5ac8fa", "#007bff", "#5ac8fa"]}
      />
    </div>
  )
}
