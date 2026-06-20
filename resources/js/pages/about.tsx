import { Head } from '@inertiajs/react'

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Head title="About — FiberRoad" />
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-semibold text-foreground">About FiberRoad</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          FiberRoad is your trusted destination for premium electronics. We curate the latest
          gadgets, laptops, headphones, and accessories — delivering quality products at
          competitive prices with exceptional customer service.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {[
          { number: '10K+', label: 'Happy Customers' },
          { number: '500+', label: 'Products' },
          { number: '50+', label: 'Brands' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-4xl font-bold text-primary">{stat.number}</p>
            <p className="mt-2 text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
