import { Link, Head } from '@inertiajs/react'
import { Package, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useOrders } from '../hooks/use-orders'
import { ROUTES } from '../lib/constants'
import { formatPrice, formatDateShort } from '../lib/format'
import { Badge } from '../components/ui/badge'

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
}

export default function Orders() {
  const { data, isLoading } = useOrders()

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading orders...</div>

  if (!data?.data.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Head title="My Orders — FiberRoad" />
        <div className="flex flex-col items-center justify-center text-center">
          <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">No orders yet</h2>
          <p className="mb-8 text-muted-foreground">Start shopping to see your orders here.</p>
          <Link href={ROUTES.SHOP}><Button>Start Shopping</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Head title="My Orders — FiberRoad" />
      <h1 className="mb-8 text-2xl font-semibold text-foreground">My Orders</h1>
      <div className="space-y-4">
        {data.data.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-card-foreground">#{order.order_number}</p>
                <Badge variant={STATUS_COLORS[order.status] || 'default'}>{order.status}</Badge>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatDateShort(order.created_at)}</span>
                <span>{order.items_count} items</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-foreground">{formatPrice(order.total)}</span>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
