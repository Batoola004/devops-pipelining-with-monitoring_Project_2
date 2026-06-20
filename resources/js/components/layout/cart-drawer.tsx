import { Link } from '@inertiajs/react'
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '../../stores/cart-store'
import { useCart } from '../../hooks/use-cart'
import { ROUTES } from '../../lib/constants'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, itemCount, subtotal, items } = useCartStore()
  const { data: cart, isLoading, updateItem, removeItem } = useCart()

  if (!isDrawerOpen) return null

  const hasItems = (cart?.items ?? items).length > 0
  const cartItems = cart?.items ?? items

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={closeDrawer} />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl">
        
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            <span className="font-semibold text-foreground">Cart ({itemCount})</span>
          </div>
          <button onClick={closeDrawer} className="text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/4 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add some items to get started</p>
              <Button variant="outline" className="mt-4" onClick={closeDrawer}>
                <Link href={ROUTES.SHOP}>Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-3">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.product.image_url && (
                      <img src={item.product.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-medium text-card-foreground transition-colors hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center text-xs font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => { removeItem.mutate(item.id); toast('Removed from cart') }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        
        {hasItems && (
          <div className="border-t border-border px-6 py-4">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Shipping calculated at checkout</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={closeDrawer} asChild>
                <Link href={ROUTES.CART}>View Cart</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href={ROUTES.CHECKOUT} onClick={closeDrawer}>Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
