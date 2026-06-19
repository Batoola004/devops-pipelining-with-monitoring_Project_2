import { useState } from 'react'
import { Link, router, Head } from '@inertiajs/react'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/auth-store'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ROUTES } from '../lib/constants'

interface FieldErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  password_confirmation?: string[]
}

export default function Register() {
  const register = useAuthStore((s) => s.register)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (form.password !== form.password_confirmation) {
      setErrors({ password: ['Passwords do not match'], password_confirmation: ['Passwords do not match'] })
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created!')
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

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Head title="Create Account — FiberRoad" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start shopping at FiberRoad</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
            <Input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); clearError('name') }}
              required placeholder="John Doe"
              className={errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            />
            {errors.name?.map((msg, i) => (
              <p key={i} className="mt-1 text-xs text-destructive">{msg}</p>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError('email') }}
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
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError('password') }}
              required placeholder="••••••••"
              className={errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            />
            {errors.password?.map((msg, i) => (
              <p key={i} className="mt-1 text-xs text-destructive">{msg}</p>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Confirm Password</label>
            <Input
              type="password"
              value={form.password_confirmation}
              onChange={(e) => { setForm({ ...form, password_confirmation: e.target.value }); clearError('password_confirmation') }}
              required placeholder="••••••••"
              className={errors.password_confirmation ? 'border-destructive focus:border-destructive focus:ring-destructive/50' : ''}
            />
            {errors.password_confirmation?.map((msg, i) => (
              <p key={i} className="mt-1 text-xs text-destructive">{msg}</p>
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary/80">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
