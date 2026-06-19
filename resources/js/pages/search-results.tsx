import { useState, useEffect } from 'react'
import { router, Head } from '@inertiajs/react'
import { Search, X } from 'lucide-react'
import { Input } from '../components/ui/input'
import ProductCard from '../components/product/product-card'
import { useDebounce } from '../hooks/use-debounce'
import { useSearch } from '../hooks/use-search'
import type { Product } from '../types'

interface SearchResultsProps {
  query?: string
  results?: { data: Product[] }
}

export default function SearchResults({ query = '', results }: SearchResultsProps) {
  const [search, setSearch] = useState(query)
  const debounced = useDebounce(search, 300)
  const { data, isFetching } = useSearch(debounced)
  const products = data?.data || results?.data || []

  useEffect(() => {
    if (debounced && debounced !== query) {
      router.replace({ url: `/search?q=${encodeURIComponent(debounced)}`, preserveState: true })
    }
  }, [debounced])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title={search ? `Search: ${search} — FiberRoad` : 'Search — FiberRoad'} />
      <div className="mx-auto mb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-10 pr-10 bg-card border-border"
            autoFocus
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {debounced && (
        <p className="mb-6 text-sm text-muted-foreground">
          {isFetching ? 'Searching...' : `${data?.meta?.total || 0} results for "${debounced}"`}
        </p>
      )}

      {!debounced ? (
        <div className="py-20 text-center text-muted-foreground">Start typing to search products</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
