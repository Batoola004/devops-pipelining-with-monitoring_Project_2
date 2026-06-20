import { useState } from 'react'
import { Link, router, Head } from '@inertiajs/react'
import { ArrowLeft, CreditCard, Truck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useCart } from '../hooks/use-cart'
import { useCheckout } from '../hooks/use-orders'
import { ROUTES } from '../lib/constants'

export default function Checkout() {
  const { data: cart, isLoading } = useCart()
  const checkout = useCheckout()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-6 w-48 rounded bg-muted" />
          <div className="mx-auto h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!cart?.items.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <Head title="Checkout — FiberRoad" />
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <Link href={ROUTES.SHOP}><Button className="mt-4">Shop Now</Button></Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    checkout.mutate(
      { shipping_address: address, payment_method: paymentMethod },
      {
        onSuccess: (data: any) => {
          toast.success('Order placed!')
          router.visit(`/orders/${data.order.id}/confirmation`)
        },
        onError: () => toast.error('Checkout failed. Please try again.'),
      },
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title="Checkout — FiberRoad" />
      <Link href={ROUTES.CART} className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Cart
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">Full Name</label>
                    <Input value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">Phone</label>
                    <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">Address Line 1</label>
                  <Input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">Address Line 2 (Optional)</label>
                  <Input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">City</label>
                    <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">State</label>
                    <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">ZIP Code</label>
                    <Input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">Payment Method</h2>
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="h-4 w-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">Credit Card (Stripe)</p>
                    <p className="text-sm text-muted-foreground">Secure payment — coming soon</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Order Summary</h2>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[180px]">{item.product.name} × {item.quantity}</span>
                    <span className="font-mono font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-border" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500' : 'text-foreground'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
              </div>
              <hr className="my-4 border-border" />
              <div className="mb-6 flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button type="submit" className="w-full py-3 text-base" disabled={checkout.isPending}>
                {checkout.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </span>
                ) : `Place Order — $${total.toFixed(2)}`}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Secure checkout. Your info is safe.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
