import { useState, useEffect } from 'react'
import { Link, Head } from '@inertiajs/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ROUTES } from '../lib/constants'
import type { Product, Category } from '../types'

const slides = [
  {
    title: 'Next-Gen Performance',
    subtitle: 'Laptops & Computers',
    desc: 'Powerful machines for work, play, and everything in between.',
    cta: 'Shop Laptops',
    link: `${ROUTES.SHOP}?category=laptops-computers`,
  },
  {
    title: 'Hear Every Detail',
    subtitle: 'Premium Audio',
    desc: 'Noise-canceling headphones and high-fidelity speakers.',
    cta: 'Shop Audio',
    link: `${ROUTES.SHOP}?category=headphones-audio`,
  },
  {
    title: 'Stay Connected',
    subtitle: 'Smartphones & Wearables',
    desc: 'Latest phones, watches, and trackers to keep you in the loop.',
    cta: 'Shop Devices',
    link: `${ROUTES.SHOP}?category=smartphones-tablets`,
  },
]

interface HomeProps {
  featuredProducts: Product[]
  categories: Category[]
  newProducts: Product[]
}

export default function Home({ featuredProducts, categories, newProducts }: HomeProps) {
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => setSlideIdx((i) => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlideIdx((i) => (i + 1) % slides.length)

  return (
    <>
      <Head title="FiberRoad — Your Electronics Destination" />

      
      <section className="relative overflow-hidden bg-surface">
        <div className="relative mx-auto max-w-7xl">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-in-out ${
                i === slideIdx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0'
              }`}
            >
              {i === slideIdx && (
                <div className="px-4 py-20 sm:px-6 lg:py-32">
                  <div className="max-w-2xl">
                    <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                      {slide.subtitle}
                    </p>
                    <h1 className="mb-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl" style={{ lineHeight: '1.04' }}>
                      {slide.title}
                    </h1>
                    <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                      {slide.desc}
                    </p>
                    <Link href={slide.link}>
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}

          
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slideIdx ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        
        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6 lg:left-10">
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6 lg:right-10">
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </section>

      
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-foreground">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`${ROUTES.SHOP}?category=${cat.slug}`}
                className="group rounded-lg border border-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-medium text-card-foreground">{cat.name}</h3>
                {'products_count' in cat && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{(cat as any).products_count} items</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      {featuredProducts?.length > 0 && (
        <section className="bg-muted/50 py-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-foreground">Trending Now</h2>
                <p className="mt-1 text-muted-foreground">Most popular products this week</p>
              </div>
              <Link href={ROUTES.SHOP} className="hidden items-center text-sm font-medium text-primary hover:text-primary/80 sm:flex">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
              {featuredProducts.map((product) => (
                <div key={product.id} className="min-w-[260px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
      {newProducts?.length > 0 && (
        <section className="py-section px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-foreground">Recommended for You</h2>
              <p className="mt-1 text-muted-foreground">Fresh picks just for you</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} isNew />
              ))}
            </div>
          </div>
        </section>
      )}

      
      <section className="border-t border-border bg-card py-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Free Shipping', desc: 'On orders over $50', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
              { title: 'Secure Checkout', desc: '100% secure payments', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Easy Returns', desc: '30-day return policy', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
              { title: '24/7 Support', desc: 'Dedicated support team', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="mb-1 font-medium text-card-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProductCard({ product, isNew }: { product: Product; isNew?: boolean }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.original_price && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 font-mono text-[11px] font-bold text-primary-foreground">
            SALE
          </span>
        )}
        {isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-accent-foreground">
            NEW
          </span>
        )}
        {!product.has_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
            <span className="rounded-full bg-background px-4 py-1.5 font-mono text-xs font-semibold text-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="font-medium text-card-foreground line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-lg font-semibold text-foreground">${Number(product.price).toFixed(2)}</span>
          {product.original_price && (
            <span className="font-mono text-sm text-muted-foreground line-through">${Number(product.original_price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
