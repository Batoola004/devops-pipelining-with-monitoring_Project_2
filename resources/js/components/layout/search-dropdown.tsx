import { Search, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { ROUTES } from '../../lib/constants'

const TRENDING = ['Gaming Laptop', 'Wireless Earbuds', 'Smart Watch', 'USB-C Hub', 'Mechanical Keyboard']
const DEPARTMENTS = ['Laptops', 'Smartphones', 'Audio', 'Gaming', 'Wearables', 'Smart Home']

export default function SearchDropdown() {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border bg-background p-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
      <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="mr-1.5 inline h-3 w-3" />
        Recent Searches
      </h4>
      <div className="mb-4 space-y-2">
        {['UltraBook Pro', 'Noise-canceling headphones'].map((s) => (
          <Link
            key={s}
            href={`/search?q=${encodeURIComponent(s)}`}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="h-3 w-3" />
            {s}
          </Link>
        ))}
      </div>

      <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <TrendingUp className="mr-1.5 inline h-3 w-3" />
        Trending Searches
      </h4>
      <div className="mb-4 space-y-2">
        {TRENDING.map((s) => (
          <Link
            key={s}
            href={`/search?q=${encodeURIComponent(s)}`}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <TrendingUp className="h-3 w-3 text-primary" />
            {s}
          </Link>
        ))}
      </div>

      <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Departments</h4>
      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((d) => (
          <Link
            key={d}
            href={`${ROUTES.SHOP}?category=${d.toLowerCase()}`}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {d}
          </Link>
        ))}
      </div>

      <Link
        href={ROUTES.SHOP}
        className="mt-4 flex items-center justify-center gap-1 rounded-md bg-primary/10 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
      >
        Browse All Products <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
