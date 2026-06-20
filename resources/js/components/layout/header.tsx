import { useState, useEffect, useRef } from 'react'
import { Link, router } from '@inertiajs/react'
import {
  ShoppingCart, Heart, User, Menu, Search, Package, LogOut,
  Sun, Moon, X,
} from 'lucide-react'
import { useAuthStore } from '../../stores/auth-store'
import { useCartStore } from '../../stores/cart-store'
import { useUIStore } from '../../stores/ui-store'
import { useThemeStore } from '../../stores/theme-store'
import { useCart } from '../../hooks/use-cart'
import { ROUTES } from '../../lib/constants'
import { formatPrice } from '../../lib/format'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import MegaMenu from './mega-menu'
import SearchDropdown from './search-dropdown'
import type { Category } from '../../types'

const DEMO_CATEGORIES: Category[] = [
  { id: 1, name: 'Laptops & Computers', slug: 'laptops-computers' },
  { id: 2, name: 'Smartphones & Tablets', slug: 'smartphones-tablets' },
  { id: 3, name: 'Headphones & Audio', slug: 'headphones-audio' },
  { id: 4, name: 'Cables & Adapters', slug: 'cables-adapters' },
  { id: 5, name: 'Chargers & Power', slug: 'chargers-power' },
  { id: 6, name: 'Keyboards & Mice', slug: 'keyboards-mice' },
  { id: 7, name: 'Monitors & Displays', slug: 'monitors-displays' },
  { id: 8, name: 'Storage & Drives', slug: 'storage-drives' },
  { id: 9, name: 'Smart Home', slug: 'smart-home' },
  { id: 10, name: 'Wearables', slug: 'wearables' },
  { id: 11, name: 'Gaming', slug: 'gaming' },
  { id: 12, name: 'Networking', slug: 'networking' },
] as Category[]

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount)
  const subtotal = useCartStore((s) => s.subtotal)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav)
  const { dark, toggle: toggleTheme } = useThemeStore()
  const { data: cart } = useCart()

  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const cartPreviewRef = useRef<HTMLDivElement>(null)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
      if (cartPreviewRef.current && !cartPreviewRef.current.contains(e.target as Node)) {
        setCartPreviewOpen(false)
      }
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.visit(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  const openMega = () => setMegaOpen(true)
  const closeMega = () => setMegaOpen(false)

  return (
    <header
      ref={megaRef}
      className={`sticky top-0 z-50 w-full border-b border-border bg-background transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 self-stretch">
          <button onClick={toggleMobileNav} className="lg:hidden">
            <Menu className="h-6 w-6 text-muted-foreground" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">FiberRoad</span>
          </Link>

          
          <nav className="ml-8 hidden h-full items-stretch gap-1 lg:flex">
            <Link
              href="/"
              className="flex items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Home
            </Link>
            <button
              onMouseEnter={openMega}
              className="flex items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Shop
            </button>
            <Link
              href={ROUTES.ABOUT}
              className="flex items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              About
            </Link>
          </nav>
        </div>

        
        <div className="flex items-center gap-2 sm:gap-3">
          
          <div ref={searchRef} className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search products..."
                  className="h-9 w-48 rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:w-64 focus:border-primary focus:ring-1 focus:ring-primary lg:w-56 lg:focus:w-72"
                />
              </div>
            </form>
            {searchOpen && <SearchDropdown />}
          </div>

          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          
          {isAuthenticated && (
            <Link href={ROUTES.WISHLIST} className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          
          <div
            ref={cartPreviewRef}
            className="relative"
            onMouseEnter={() => setCartPreviewOpen(true)}
            onMouseLeave={() => setCartPreviewOpen(false)}
          >
            <div onClick={openDrawer} className="relative cursor-pointer">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>

            {cartPreviewOpen && cart?.items?.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-background p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </p>
                <div className="mb-3 max-h-56 space-y-3 overflow-y-auto">
                  {cart.items.slice(0, 4).map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">{item.product?.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.product?.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 4 && (
                    <p className="text-xs text-muted-foreground">+{cart.items.length - 4} more items</p>
                  )}
                </div>
                <div className="mb-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-sm font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={openDrawer}>
                  View Cart
                </Button>
              </div>
            )}
          </div>

          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAuthenticated ? (
                <>
                  <div className="border-b border-border px-2 py-2">
                    <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.ORDERS} className="flex items-center gap-2">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.LOGIN} className="font-medium text-foreground">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.REGISTER} className="text-muted-foreground">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      
      <div
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          megaOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <MegaMenu categories={DEMO_CATEGORIES} onClose={closeMega} />
      </div>
    </header>
  )
}
