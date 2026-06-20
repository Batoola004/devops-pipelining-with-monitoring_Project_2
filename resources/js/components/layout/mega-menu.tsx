import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { ROUTES } from '../../lib/constants'

interface Category {
  id: number
  name: string
  slug: string
}

interface MegaMenuProps {
  categories: Category[]
  onClose: () => void
}

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  'laptops-computers': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Razer', 'MSI'],
  'smartphones-tablets': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola'],
  'headphones-audio': ['Sony', 'Bose', 'Sennheiser', 'Apple', 'Anker', 'JBL', 'Audio-Technica'],
  'cables-adapters': ['Anker', 'Belkin', 'UGREEN', 'Cable Matters', 'Amazon Basics'],
  'chargers-power': ['Anker', 'Belkin', 'UGREEN', 'Samsung', 'Apple'],
  'keyboards-mice': ['Logitech', 'Razer', 'Corsair', 'Keychron', 'SteelSeries', 'Ducky'],
  'monitors-displays': ['Dell', 'LG', 'Samsung', 'ASUS', 'BenQ', 'Acer', 'Gigabyte'],
  'storage-drives': ['Samsung', 'Western Digital', 'Seagate', 'Crucial', 'SanDisk', 'Kingston'],
  'smart-home': ['Nest', 'Ring', 'Philips Hue', 'Amazon', 'Ecobee', 'August'],
  'wearables': ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Whoop', 'Oura'],
  'gaming': ['Razer', 'Corsair', 'SteelSeries', 'Logitech', 'NVIDIA', 'AMD'],
  'networking': ['TP-Link', 'Netgear', 'ASUS', 'Ubiquiti', 'Eero', 'Linksys'],
}

const ALL_BRANDS = Array.from(new Set(Object.values(BRANDS_BY_CATEGORY).flat()))

const SUBCATEGORIES: Record<string, string[]> = {
  'laptops-computers': ['Ultrabooks', 'Gaming Laptops', 'Business Laptops', 'Desktops', 'All-in-Ones', 'Chromebooks'],
  'smartphones-tablets': ['Flagship Phones', 'Mid-Range', 'iPhones', 'Android', 'iPads', 'Android Tablets'],
  'headphones-audio': ['Over-Ear', 'In-Ear', 'True Wireless', 'Speakers', 'Soundbars', 'Microphones'],
  'cables-adapters': ['USB-C Cables', 'HDMI', 'Thunderbolt', 'Hubs', 'Adapters', 'Ethernet'],
  'chargers-power': ['Wall Chargers', 'Power Banks', 'Wireless Chargers', 'Car Chargers', 'Cables'],
  'keyboards-mice': ['Mechanical Keyboards', 'Mice', 'Combos', 'Wrist Rests', 'Mouse Pads'],
  'monitors-displays': ['4K Monitors', 'UltraWide', 'Gaming Monitors', 'Portable', 'Mounts'],
  'storage-drives': ['SSDs', 'External Drives', 'HDDs', 'Flash Drives', 'NAS', 'Memory Cards'],
  'smart-home': ['Thermostats', 'Lighting', 'Plugs', 'Cameras', 'Locks', 'Doorbells'],
  'wearables': ['Smart Watches', 'Fitness Trackers', 'Smart Rings', 'GPS Watches'],
  'gaming': ['Controllers', 'Headsets', 'Mice', 'Chairs', 'VR', 'Capture Cards'],
  'networking': ['Routers', 'Mesh Systems', 'Switches', 'Access Points', 'Adapters', 'Powerline'],
}

export default function MegaMenu({ categories, onClose }: MegaMenuProps) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? '')

  const brands = BRANDS_BY_CATEGORY[activeSlug] ?? ALL_BRANDS

  return (
    <div
      className="absolute left-0 right-0 top-full border-t border-border bg-background shadow-2xl"
      onMouseLeave={onClose}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-8 py-10">
        
        <div>
          <h4 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </h4>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  onClick={() => { onClose(); router.visit(`${ROUTES.SHOP}?category=${cat.slug}`) }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    activeSlug === cat.slug
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h4 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Subcategories
          </h4>
          <ul className="space-y-1">
            {(SUBCATEGORIES[activeSlug] ?? []).map((sub) => (
              <li key={sub}>
                <Link
                  href={`${ROUTES.SHOP}?category=${activeSlug}`}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={onClose}
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h4 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Brands
          </h4>
          <div className="mb-6 flex flex-wrap gap-2">
            {brands.length > 0 ? brands.map((b) => (
              <Link
                key={b}
                href={`${ROUTES.SHOP}?search=${encodeURIComponent(b)}`}
                onClick={onClose}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {b}
              </Link>
            )) : (
              <p className="text-xs text-muted-foreground">No brands listed</p>
            )}
          </div>
          <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Links
          </h4>
          <div className="space-y-2">
            <Link
              href={`${ROUTES.SHOP}?featured=1`}
              className="block text-sm text-muted-foreground transition-colors hover:text-primary"
              onClick={onClose}
            >
              Best Sellers
            </Link>
            <Link
              href={ROUTES.SHOP}
              className="block text-sm text-muted-foreground transition-colors hover:text-primary"
              onClick={onClose}
            >
              New Arrivals
            </Link>
            <Link
              href={`${ROUTES.SHOP}?sort=price_asc`}
              className="block text-sm text-muted-foreground transition-colors hover:text-primary"
              onClick={onClose}
            >
              Clearance
            </Link>
          </div>
        </div>

        
        <div className="flex flex-col justify-end rounded-lg bg-surface p-6 text-white">
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-primary">Limited Offer</p>
          <h3 className="mb-2 text-2xl font-semibold">Summer Sale</h3>
          <p className="mb-4 text-sm text-muted-foreground">Up to 40% off on select electronics</p>
          <Link href={ROUTES.SHOP} onClick={onClose}>
            <Button className="self-start bg-primary text-white hover:bg-primary/90">
              Shop Deal <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
