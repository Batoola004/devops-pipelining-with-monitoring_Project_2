import { useEffect, useRef } from 'react'
import { usePage } from '@inertiajs/react'
import { useAuthStore } from '../../stores/auth-store'
import { useThemeStore } from '../../stores/theme-store'
import Header from './header'
import Footer from './footer'
import CartDrawer from './cart-drawer'
import MobileNav from './mobile-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const setUser = useAuthStore((s) => s.setUser)
  const initTheme = useThemeStore((s) => s.init)
  const { auth } = usePage().props as any
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      if (auth?.user) {
        setUser(auth.user)
      }
      checkAuth()
      initTheme()
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <MobileNav />
      <CartDrawer />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </div>
  )
}
