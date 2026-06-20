import { Link, Head } from '@inertiajs/react'
import { CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ROUTES } from '../lib/constants'
import { formatPrice } from '../lib/format'
import type { Order } from '../types'

interface OrderConfirmationProps {
  order: Order
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <Head title="Order Confirmed — FiberRoad" />
      <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Order Placed!</h1>
      <p className="mb-2 text-lg text-muted-foreground">Thank you for your purchase.</p>
      <p className="mb-8 text-sm text-muted-foreground">Order #{order.order_number}</p>

      <div className="mb-8 rounded-xl border border-border bg-card p-6 text-left">
        <h2 className="mb-4 font-semibold text-card-foreground">Order Details</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.product_name} × {item.quantity}</span>
              <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-border" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">{formatPrice(order.tax)}</span></div>
        </div>
        <hr className="my-4 border-border" />
        <div className="flex justify-between text-lg font-bold text-foreground">
          <span>Total</span><span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link href={ROUTES.ORDERS}><Button variant="outline">View My Orders</Button></Link>
        <Link href={ROUTES.SHOP}><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  )
}
