import { Link, Head } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { ROUTES } from '../lib/constants'
import { formatPrice, formatDate } from '../lib/format'
import type { Order } from '../types'

interface OrderDetailProps {
  order: Order
}

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning', confirmed: 'default', processing: 'default',
  shipped: 'default', delivered: 'success', cancelled: 'danger',
}

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetail({ order }: OrderDetailProps) {
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title={`Order #${order.order_number} — FiberRoad`} />
      <Link href={ROUTES.ORDERS} className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Order #{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
        </div>
        <Badge variant={STATUS_COLORS[order.status] || 'default'} className="text-sm capitalize px-4 py-1">
          {order.status}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <p className={`mt-1 text-xs capitalize ${i <= currentStep ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-card-foreground">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-card-foreground">Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">{formatPrice(order.tax)}</span></div>
        </div>
        <hr className="my-4 border-border" />
        <div className="flex justify-between text-lg font-bold text-foreground">
          <span>Total</span><span>{formatPrice(order.total)}</span>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="capitalize text-foreground">{order.payment_method} — <span className={order.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}>{order.payment_status}</span></span>
        </div>
      </div>
    </div>
  )
}
