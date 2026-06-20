import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Heart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useWishlistStore } from '../../stores/wishlist-store'
import { useCart } from '../../hooks/use-cart'
import { useAuthStore } from '../../stores/auth-store'
import { Button } from '../ui/button'
import { ROUTES } from '../../lib/constants'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  isNew?: boolean
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {half && <Star key="half" size={size} className="fill-yellow-400 text-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={size} className="text-muted-foreground" />
      ))}
    </span>
  )
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const [imgErr, setImgErr] = useState(false)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const { addItem } = useCart()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem.mutate(
      { productId: product.id },
      { onSuccess: () => toast.success('Added to cart') },
    )
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const defaultImg = product.images_urls?.[0] ?? product.image_url
  const hoverImg = product.images_urls?.[1] ?? product.images_urls?.[0] ?? product.image_url
  const showHover = hoverImg && hoverImg !== defaultImg
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
    >
      
      <div className="relative aspect-square overflow-hidden bg-muted">
        {defaultImg && !imgErr ? (
          <>
            <img
              src={defaultImg}
              alt={product.name}
              onError={() => setImgErr(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                showHover ? 'group-hover:opacity-0' : ''
              }`}
              loading="lazy"
            />
            {showHover && (
              <img
                src={hoverImg}
                alt=""
                onError={() => {}}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-[11px] font-bold text-primary-foreground shadow-sm">
              -{discount}%
            </span>
          )}
          {isNew && !discount && (
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-accent-foreground shadow-sm">
              NEW
            </span>
          )}
        </div>

        {!product.has_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="rounded-full bg-background px-4 py-1.5 font-mono text-xs font-semibold text-foreground shadow-sm ring-1 ring-border">
              Out of Stock
            </span>
          </div>
        )}

        
        <button
          onClick={handleToggleWishlist}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        
        {product.has_stock && isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <Button onClick={handleAddToCart} className="w-full text-xs shadow-lg" size="sm">
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      
      <div className="p-4">
        {product.category && (
          <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="font-medium leading-snug text-card-foreground line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {product.name}
        </h3>

        
        {product.reviews_avg_rating != null && product.reviews_avg_rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.reviews_avg_rating} />
            <span className="font-mono text-[11px] text-muted-foreground">
              {product.reviews_avg_rating.toFixed(1)} ({product.reviews_count})
            </span>
          </div>
        )}

        
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.original_price && (
            <span className="font-mono text-sm text-muted-foreground line-through">
              ${Number(product.original_price).toFixed(2)}
            </span>
          )}
        </div>

        
        {product.has_stock && !isAuthenticated && (
          <Link
            href={ROUTES.LOGIN}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Login to Purchase
          </Link>
        )}
      </div>
    </Link>
  )
}
