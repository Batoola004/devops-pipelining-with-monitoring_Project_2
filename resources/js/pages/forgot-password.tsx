import { useState } from 'react'
import { Link, Head } from '@inertiajs/react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ROUTES } from '../lib/constants'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Reset link sent! Check your email.')
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="mb-4 text-2xl font-semibold text-foreground">Check your email</h1>
          <p className="mb-6 text-muted-foreground">We've sent a password reset link to {email}</p>
          <Link href={ROUTES.LOGIN}><Button variant="outline">Back to Login</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Head title="Forgot Password — FiberRoad" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary/80">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
