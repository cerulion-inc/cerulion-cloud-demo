'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { toast } from "sonner"

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check if user has a valid session (from reset link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // No valid session, redirect to login
        toast.error('Invalid or expired reset link. Please try again.')
        router.push('/auth/login')
      }
    }
    
    checkSession()
  }, [router, supabase])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSuccess(true)
      toast.success('Password updated successfully!')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      console.error('Password update error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative w-full max-w-md mx-auto rounded-lg">
        <Card className="w-full relative overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Password Updated!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Your password has been successfully updated.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the login page...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <Link href="/auth/login" className="underline">
              Go to Login
            </Link>
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
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password"
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating Password...' : 'Update Password'}
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
