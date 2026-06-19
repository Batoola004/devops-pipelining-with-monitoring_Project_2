import { useState, useEffect, useCallback } from 'react'
import { Link, Head, router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import {
  SlidersHorizontal, X, ChevronDown, ArrowUpDown,
  Star, Search, Package,
} from 'lucide-react'
import ProductCard from '../components/product/product-card'
import { Button } from '../components/ui/button'
import { ROUTES } from '../lib/constants'
import type { Product, Category } from '../types'

interface ShopProps {
  initialProducts: {
    data: Product[]
    meta: { current_page: number; last_page: number; total: number }
  }
  categories: Category[]
  category?: Category
  minPrice?: number
  maxPrice?: number
  initialSort?: string
  initialFeatured?: string
  initialSearch?: string
}

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  'laptops-computers': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Razer', 'MSI'],
  'smartphones-tablets': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola'],
  'headphones-audio': ['Sony', 'Bose', 'Sennheiser', 'Apple', 'Anker', 'JBL', 'Audio-Technica'],
  'cables-adapters': ['Anker', 'Belkin', 'UGREEN', 'Cable Matters', 'Amazon Basics'],
  'chargers-power': ['Anker', 'Belkin', 'UGREEN', 'Samsung', 'Apple'],
  'keyboards-mice': ['Logitech', 'Razer', 'Corsair', 'Keychron', 'SteelSeries', 'Ducky'],
  'monitors-displays': ['Dell', 'LG', 'Samsung', 'ASUS', 'BenQ', 'Acer', 'Gigabyte'],
  'storage-drives': ['Samsung', 'Western Digital', 'Seagate', 'Crucial', 'SanDisk', 'Kingston'],
  'smart-home': ['Nest', 'Ring', 'Philips Hue', 'Amazon', 'Ecobee', 'August'],
  'wearables': ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Whoop', 'Oura'],
  'gaming': ['Razer', 'Corsair', 'SteelSeries', 'Logitech', 'NVIDIA', 'AMD'],
  'networking': ['TP-Link', 'Netgear', 'ASUS', 'Ubiquiti', 'Eero', 'Linksys'],
}

const ALL_BRANDS = [
  'Apple','Samsung','Sony','Bose','Dell','HP','Lenovo','ASUS','Microsoft',
  'Razer','MSI','Google','OnePlus','Xiaomi','Motorola','Sennheiser','Anker',
  'JBL','Audio-Technica','Belkin','UGREEN','Logitech','Corsair','Keychron',
  'SteelSeries','Ducky','LG','BenQ','Acer','Gigabyte','Western Digital',
  'Seagate','Crucial','SanDisk','Kingston','Nest','Ring','Philips Hue',
  'Amazon','Ecobee','August','Garmin','Fitbit','Whoop','Oura','NVIDIA',
  'AMD','TP-Link','Netgear','Ubiquiti','Eero','Linksys',
]

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
  { label: 'Best Selling', value: 'best_selling' },
]

export default function Shop({ initialProducts, categories, category, minPrice, maxPrice, initialSort, initialFeatured, initialSearch }: ShopProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts?.data ?? [])
  const [meta, setMeta] = useState(initialProducts?.meta ?? { current_page: 1, last_page: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(category?.slug ?? '')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState(initialSort || 'newest')
  const initialBrand = initialSearch && ALL_BRANDS.some((b) => b.toLowerCase() === initialSearch.toLowerCase())
    ? ALL_BRANDS.find((b) => b.toLowerCase() === initialSearch.toLowerCase())!
    : ''
  const [featured, setFeatured] = useState(initialFeatured === '1')
  const [searchQuery, setSearchQuery] = useState(initialBrand ? '' : (initialSearch || ''))
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)

  // API base URL
  const apiBase = '/api/products'

  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (priceMin) params.set('min_price', priceMin)
    if (priceMax) params.set('max_price', priceMax)
    if (inStockOnly) params.set('in_stock', '1')
    if (featured) params.set('featured', '1')
    if (sort && sort !== 'newest') params.set('sort', sort)
    const searchTerms = [searchQuery, selectedBrand].filter(Boolean).join(' ')
    if (searchTerms) params.set('search', searchTerms)
    params.set('per_page', '12')
    return params
  }, [selectedCategory, priceMin, priceMax, inStockOnly, featured, sort, searchQuery, selectedBrand])

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true)
    const params = buildParams()
    if (page > 1) params.set('page', String(page))
    try {
      const res = await fetch(`${apiBase}?${params}`)
      const data = await res.json()
      setProducts(data.data ?? [])
      setMeta(data.meta ?? { current_page: 1, last_page: 1, total: 0 })
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => {
    fetchProducts(1)
  }, [fetchProducts])

  const activeFilters = [
    ...(selectedCategory ? [{ label: `Category: ${categories.find(c => c.slug === selectedCategory)?.name ?? selectedCategory}`, onRemove: () => setSelectedCategory('') }] : []),
    ...(priceMin ? [{ label: `Min: $${priceMin}`, onRemove: () => setPriceMin('') }] : []),
    ...(priceMax ? [{ label: `Max: $${priceMax}`, onRemove: () => setPriceMax('') }] : []),
    ...(inStockOnly ? [{ label: 'In Stock Only', onRemove: () => setInStockOnly(false) }] : []),
    ...(searchQuery ? [{ label: `Search: "${searchQuery}"`, onRemove: () => setSearchQuery('') }] : []),
    ...(featured ? [{ label: 'Best Sellers', onRemove: () => setFeatured(false) }] : []),
    ...(selectedBrand ? [{ label: `Brand: ${selectedBrand}`, onRemove: () => setSelectedBrand('') }] : []),
  ]

  const clearAll = () => {
    setSelectedCategory('')
    setPriceMin('')
    setPriceMax('')
    setInStockOnly(false)
    setFeatured(false)
    setSelectedBrand('')
    setSearchQuery('')
    setSort('newest')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title={category ? `${category.name} — FiberRoad` : 'Shop Electronics — FiberRoad'} />

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {category ? category.name : 'All Electronics'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-56 rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {/* Mobile filter toggle */}
          <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilterOpen(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeFilters.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground">
              {f.label}
              <button onClick={f.onRemove} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs text-primary hover:text-primary/80">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-6">
            {/* Categories */}
            <div>
              <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {cat.name}
                        {'products_count' in cat && (
                          <span className="font-mono text-xs text-muted-foreground">{(cat as any).products_count}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-border" />

            {/* Price Range */}
            <div>
              <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  min={0}
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  min={0}
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* Availability */}
            <div>
              <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Availability</h4>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                />
                In Stock Only
              </label>
            </div>

            <hr className="border-border" />

            {/* Brands — only show when a category is selected */}
            {selectedCategory && (
              <>
                <hr className="border-border" />
                <div>
                  <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brands</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(BRANDS_BY_CATEGORY[selectedCategory] ?? []).map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          selectedBrand === b
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Mobile search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              {/* Categories */}
              <div className="mb-4">
                <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setSelectedCategory(''); setMobileFilterOpen(false) }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-card text-card-foreground hover:bg-muted'
                    }`}
                  >All</button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setMobileFilterOpen(false) }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-card text-card-foreground hover:bg-muted'
                      }`}
                    >{cat.name}</button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div className="mb-4">
                <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary" min={0} />
                  <span className="text-muted-foreground">—</span>
                  <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary" min={0} />
                </div>
              </div>
              {/* Availability */}
              <div className="mb-4">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  In Stock Only
                </label>
              </div>
              {/* Brands — only show when a category is selected */}
              {selectedCategory && (
                <div className="mb-6">
                  <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brands</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(BRANDS_BY_CATEGORY[selectedCategory] ?? []).map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          selectedBrand === b
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-card-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={() => setMobileFilterOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        )}

        {/* Results area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                  <div className="aspect-square bg-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-1/3 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-5 w-1/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              <Button variant="outline" className="mt-4" onClick={clearAll}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {meta.last_page > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => fetchProducts(meta.current_page - 1)}
                    disabled={meta.current_page <= 1}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(meta.last_page, 5) }).map((_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => fetchProducts(page)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          page === meta.current_page
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => fetchProducts(meta.current_page + 1)}
                    disabled={meta.current_page >= meta.last_page}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
