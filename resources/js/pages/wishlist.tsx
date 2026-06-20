import { Link, Head } from '@inertiajs/react'
import { Heart, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { useWishlist } from '../hooks/use-wishlist'
import { useCart } from '../hooks/use-cart'
import { ROUTES } from '../lib/constants'

export default function Wishlist() {
  const { data, isLoading } = useWishlist()
  const { addItem } = useCart()
  const removeItem = useWishlist().removeItem

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading wishlist...</div>

  const items = data?.items || []

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <Head title="My Wishlist — FiberRoad" />
        <div className="flex flex-col items-center justify-center text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your wishlist is empty</h2>
          <p className="mb-8 text-muted-foreground">Save items you love to your wishlist.</p>
          <Link href={ROUTES.SHOP}><Button>Browse Products</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title="My Wishlist — FiberRoad" />
      <h1 className="mb-8 text-2xl font-semibold text-foreground">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ product }) => (
          <div key={product.id} className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <Link href={`/products/${product.slug}`}>
              <div className="relative flex aspect-square items-center justify-center bg-muted">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
              </div>
            </Link>
            <div className="p-4">
              {product.category && (
                <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {product.category.name}
                </p>
              )}
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-medium text-card-foreground line-clamp-1 transition-colors hover:text-primary">{product.name}</h3>
              </Link>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => addItem.mutate({ productId: product.id }, { onSuccess: () => toast.success('Added to cart') })}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm" onClick={() => { removeItem.mutate(product.id); toast('Removed from wishlist') }}>
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
