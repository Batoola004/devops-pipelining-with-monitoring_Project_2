import { Link } from '@inertiajs/react'
import { X } from 'lucide-react'
import { useUIStore } from '../../stores/ui-store'
import { ROUTES } from '../../lib/constants'

export default function MobileNav() {
  const { isMobileNavOpen, toggleMobileNav } = useUIStore()

  if (!isMobileNavOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={toggleMobileNav} />
      <div className="fixed inset-y-0 left-0 w-72 bg-card p-6 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Menu</span>
          <button onClick={toggleMobileNav}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-4">
          <Link href="/" onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">Home</Link>
          <Link href={ROUTES.SHOP} onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">Shop</Link>
          <Link href={ROUTES.ABOUT} onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">About</Link>
          <Link href={ROUTES.CONTACT} onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">Contact</Link>
          <hr className="my-4 border-border" />
          <Link href={ROUTES.LOGIN} onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">Login</Link>
          <Link href={ROUTES.REGISTER} onClick={toggleMobileNav} className="block text-sm font-medium text-muted-foreground hover:text-primary">Register</Link>
        </nav>
      </div>
    </div>
  )
}
