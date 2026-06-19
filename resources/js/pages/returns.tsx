import { Head } from '@inertiajs/react'
import { RotateCcw, Shield, CheckCircle, Package } from 'lucide-react'

const STEPS = [
  { icon: RotateCcw, title: 'Request a Return', desc: 'Log into your account and navigate to your orders. Select the item you want to return and submit a request.' },
  { icon: CheckCircle, title: 'Get Approved', desc: 'Most returns are approved within 24 hours. You will receive an email with a return authorization and shipping label.' },
  { icon: Package, title: 'Ship It Back', desc: 'Pack the item securely with all original accessories and the RMA number. Drop it off at any carrier location.' },
  { icon: Shield, title: 'Receive Refund', desc: 'Once we receive and inspect the item, your refund will be processed within 5–7 business days to your original payment method.' },
]

export default function Returns() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Head title="Returns & Exchanges — FiberRoad" />
      <h1 className="mb-2 text-center text-4xl font-semibold text-foreground">Returns & Exchanges</h1>
      <p className="mb-12 text-center text-muted-foreground">Hassle-free returns within 30 days of delivery.</p>

      <div className="mb-12 grid gap-6 sm:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">{step.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Return Policy</h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Eligibility:</strong> Items must be returned within 30 days of
            delivery in original condition with all accessories and packaging. Products must not show signs of
            wear or damage.
          </p>
          <p>
            <strong className="text-foreground">Non-Returnable Items:</strong> Downloadable software, gift cards,
            and opened personal care items cannot be returned. Final sale items are marked on the product page.
          </p>
          <p>
            <strong className="text-foreground">Refund Timeline:</strong> Refunds are processed within 5–7
            business days after we receive your return. The refund will be issued to the original payment method.
          </p>
          <p>
            <strong className="text-foreground">Exchanges:</strong> For a faster experience, we recommend
            returning the unwanted item and placing a new order for the desired product.
          </p>
          <p>
            <strong className="text-foreground">Defective Items:</strong> If you receive a defective or incorrect
            item, please contact support immediately. We will provide a prepaid return label and ship a replacement
            at no additional cost.
          </p>
        </div>
      </div>
    </div>
  )
}
