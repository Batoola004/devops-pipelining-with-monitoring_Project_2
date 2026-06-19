import { useState } from 'react'
import { Link, router, Head } from '@inertiajs/react'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/auth-store'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ROUTES } from '../lib/constants'

interface FieldErrors {
  email?: string[]
  password?: string[]
}

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.visit(ROUTES.HOME)
    } catch (raw: any) {
      const normalized: FieldErrors = {}
      if (raw && typeof raw === 'object') {
        for (const [key, val] of Object.entries(raw)) {
          normalized[key as keyof FieldErrors] = Array.isArray(val) ? val : val ? [String(val)] : undefined
        }
      }
      setErrors(normalized)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Head title="Sign In — FiberRoad" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Sign in to your FiberRoad account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })) }}
              required placeholder="you@example.com"
              className={errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            />
            {errors.email?.map((msg, i) => (
              <p key={i} className="mt-1 text-xs text-destructive">{msg}</p>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })) }}
              required placeholder="••••••••"
              className={errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            />
            {errors.password?.map((msg, i) => (
              <p key={i} className="mt-1 text-xs text-destructive">{msg}</p>
            ))}
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:text-primary/80">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
