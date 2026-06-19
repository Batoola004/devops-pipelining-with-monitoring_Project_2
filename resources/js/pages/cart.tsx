import { Link, Head } from '@inertiajs/react'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { useCart } from '../hooks/use-cart'
import { ROUTES } from '../lib/constants'
import type { Cart as CartType } from '../types'

interface CartPageProps {
  cart?: CartType
}

export default function Cart({ cart }: CartPageProps) {
  const { data, isLoading, updateItem, removeItem, clearCart } = useCart()
  const items = data?.items || cart?.items || []
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-6 w-48 rounded bg-muted" />
          <div className="mx-auto h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Head title="Shopping Cart — FiberRoad" />
        <div className="flex flex-col items-center justify-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="mb-8 text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link href={ROUTES.SHOP}>
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title="Shopping Cart — FiberRoad" />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href={ROUTES.SHOP} className="mb-2 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Continue Shopping
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Shopping Cart ({items.length})</h1>
        </div>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={() => { clearCart.mutate(); toast('Cart cleared') }}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.image_url && (
                <img src={item.product.image_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-medium text-card-foreground transition-colors hover:text-primary line-clamp-1"
              >
                {item.product.name}
              </Link>
              <p className="mt-1 font-mono font-semibold text-foreground">
                ${Number(item.product.price).toFixed(2)}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center text-sm font-medium text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => { removeItem.mutate(item.id); toast('Removed from cart') }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="font-mono font-semibold text-foreground">
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex justify-between text-lg font-semibold text-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Shipping & taxes calculated at checkout</p>
        <Link href={ROUTES.CHECKOUT}>
          <Button className="mt-4 w-full py-3 text-base">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  )
}
