import { Head } from '@inertiajs/react'
import { Truck, Package, Clock, Globe } from 'lucide-react'

const SHIPPING_METHODS = [
  { icon: Truck, name: 'Standard Shipping', cost: '$5.99', time: '3–7 business days', free: 'Orders over $50' },
  { icon: Clock, name: 'Express Shipping', cost: '$14.99', time: '1–2 business days', free: null },
  { icon: Globe, name: 'International', cost: 'Varies by region', time: '7–14 business days', free: null },
]

export default function Shipping() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Head title="Shipping Info — FiberRoad" />
      <h1 className="mb-2 text-center text-4xl font-semibold text-foreground">Shipping Information</h1>
      <p className="mb-12 text-center text-muted-foreground">Fast, reliable delivery options for every order.</p>

      <div className="mb-12 grid gap-6 sm:grid-cols-3">
        {SHIPPING_METHODS.map((method) => (
          <div key={method.name} className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <method.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold text-foreground">{method.name}</h3>
            <p className="mb-1 text-sm text-muted-foreground">{method.time}</p>
            <p className="font-mono text-lg font-semibold text-primary">{method.cost}</p>
            {method.free && (
              <p className="mt-2 text-xs text-muted-foreground">Free on {method.free}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Shipping Policy</h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Processing Time:</strong> Orders are processed within 1–2 business
            days. During peak seasons, processing may take up to 3 business days.
          </p>
          <p>
            <strong className="text-foreground">Tracking:</strong> A tracking number will be emailed to you once
            your order ships. You can also view tracking from your Orders page.
          </p>
          <p>
            <strong className="text-foreground">Shipping Address:</strong> Please ensure your shipping address is
            correct. FiberRoad is not responsible for packages delivered to incorrect addresses provided at checkout.
          </p>
          <p>
            <strong className="text-foreground">Delivery Issues:</strong> If your package arrives damaged or is
            lost in transit, contact our support team within 48 hours of the expected delivery date.
          </p>
          <p>
            <strong className="text-foreground">International Orders:</strong> Customs duties and taxes are the
            responsibility of the buyer. Delivery times to international destinations are estimates and not guaranteed.
          </p>
        </div>
      </div>
    </div>
  )
}
