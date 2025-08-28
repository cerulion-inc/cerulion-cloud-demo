import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-lg">
      <Card className="w-full relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authentication</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose an option to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full h-20 text-lg">
                Sign In
              </Button>
            </Link>
            
            <Link href="/auth/sign-up">
              <Button variant="outline" className="w-full h-20 text-lg">
                Create Account
              </Button>
            </Link>
            
            <Link href="/auth/forgot-password">
              <Button variant="outline" className="w-full h-20 text-lg">
                Reset Password
              </Button>
            </Link>
            
            <Link href="/auth/verify-email">
              <Button variant="outline" className="w-full h-20 text-lg">
                Verify Email
              </Button>
            </Link>
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
