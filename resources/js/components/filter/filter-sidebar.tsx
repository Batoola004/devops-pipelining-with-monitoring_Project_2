import { Link } from '@inertiajs/react'
import { ROUTES } from '../../lib/constants'
import type { Category, ProductFilters } from '../../types'

interface FilterSidebarProps {
  categories: Category[]
  activeCategory?: string
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
}

export function FilterSidebar({ categories, activeCategory, filters, onFilterChange }: FilterSidebarProps) {
  return (
    <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">Categories</h3>
      <ul className="space-y-2">
        <li>
          <Link
            href={ROUTES.SHOP}
            className={`flex items-center justify-between py-1.5 text-sm transition ${
              !activeCategory ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>All Products</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`${ROUTES.SHOP}?category=${cat.slug}`}
              className={`flex items-center justify-between py-1.5 text-sm transition ${
                activeCategory === cat.slug ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
