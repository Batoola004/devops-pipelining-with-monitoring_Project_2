import { useState } from 'react'
import { Link, Head } from '@inertiajs/react'
import { Minus, Plus, ShoppingCart, Heart, Star, Check, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { useCart } from '../hooks/use-cart'
import { useAuthStore } from '../stores/auth-store'
import { useWishlistStore } from '../stores/wishlist-store'
import ProductCard from '../components/product/product-card'
import { ROUTES } from '../lib/constants'
import type { Product } from '../types'

interface ProductDetailProps {
  product: Product & { related_products?: Product[] }
}

const TABS = ['Description', 'Features', 'Reviews'] as const
type Tab = (typeof TABS)[number]

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
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

export default function ProductDetail({ product }: ProductDetailProps) {
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>('Description')
  const [selectedImg, setSelectedImg] = useState(0)
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({})
  const { addItem } = useCart()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const relatedProducts = product.related_products ?? []

  const rawImages = Array.isArray(product.images_urls) ? product.images_urls : []
  const images = rawImages.length
    ? rawImages
    : product.image_url
      ? [product.image_url]
      : []

  const handleAddToCart = () => {
    addItem.mutate(
      { productId: product.id, quantity: qty },
      { onSuccess: () => toast.success('Added to cart') },
    )
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title={`${product.name} — FiberRoad`} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="transition-colors hover:text-foreground">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-foreground truncate max-w-[300px]">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-muted">
            {images[selectedImg] && !imgErr[selectedImg] ? (
              <img
                src={images[selectedImg]}
                alt={product.name}
                onError={() => setImgErr((p) => ({ ...p, [selectedImg]: true }))}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg className="h-24 w-24 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-mono text-sm font-bold text-primary-foreground shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === selectedImg ? 'border-primary' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              {product.category.name}
            </p>
          )}
          <h1 className="mb-3 text-3xl font-semibold leading-tight text-foreground lg:text-4xl lg:leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews_avg_rating != null && product.reviews_avg_rating > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <Stars rating={product.reviews_avg_rating} />
              <span className="text-sm text-muted-foreground">
                {product.reviews_avg_rating.toFixed(1)} ({product.reviews_count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.original_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${Number(product.original_price).toFixed(2)}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary">
                  Save ${(Number(product.original_price) - Number(product.price)).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6 flex items-center gap-2">
            {product.has_stock ? (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-3 w-3 text-green-500" />
                </span>
                <span className="text-sm font-medium text-green-500">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-500">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mb-8 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {/* SKU */}
          {product.sku && (
            <p className="mb-6 font-mono text-xs text-muted-foreground">SKU: {product.sku}</p>
          )}

          {/* Add to Cart / Login Section */}
          <div className="mt-auto border-t border-border pt-6">
            {!isAuthenticated ? (
              <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
                <LogIn className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">Login to Purchase</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Sign in to your account to add items to your cart and checkout.
                </p>
                <Link href={ROUTES.LOGIN}>
                  <Button className="w-full py-3 text-base" size="lg">
                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                  </Button>
                </Link>
                <p className="mt-3 text-xs text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:text-primary/80">
                    Register
                  </Link>
                </p>
              </div>
            ) : product.has_stock ? (
              <>
                <div className="mb-4 flex items-center gap-4">
                  {/* Qty selector */}
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex h-11 w-14 items-center justify-center text-sm font-medium text-foreground">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => { toggleWishlist(product.id); toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full py-3 text-base"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </>
            ) : (
              <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
                <h3 className="mb-1 font-semibold text-foreground">Out of Stock</h3>
                <p className="text-sm text-muted-foreground">
                  This product is currently unavailable. Check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="mb-8 flex gap-6 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {tab === 'Reviews' && product.reviews_count > 0 && (
                <span className="ml-1.5 text-muted-foreground">({product.reviews_count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-w-3xl">
          {activeTab === 'Description' && (
            <div className="prose-custom leading-relaxed text-muted-foreground">
              <p>{product.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'Features' && (
            <div className="text-muted-foreground">
              <p className="mb-4">Product details and specifications coming soon.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Premium quality materials</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 1-year manufacturer warranty</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Free shipping on orders over $50</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 30-day money-back guarantee</li>
              </ul>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="text-muted-foreground">
              {product.reviews_count > 0 ? (
                <p>Reviews coming soon.</p>
              ) : (
                <div>
                  <p className="mb-4">No reviews yet. Be the first to review this product!</p>
                  <Button variant="outline">Write a Review</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
