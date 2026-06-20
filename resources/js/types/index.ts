export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  products_count?: number
  sort_order: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  discount_percent: number | null
  image_url: string | null
  images_urls: string[]
  category: { id: number; name: string; slug: string } | null
  stock: number
  has_stock: boolean
  sku: string | null
  featured: boolean
  reviews_avg_rating: number | null
  reviews_count: number
  related_products?: Product[]
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'original_price' | 'image_url' | 'has_stock'>
}

export interface Cart {
  items: CartItem[]
  summary: {
    item_count: number
    subtotal: number
  }
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: OrderItem[]
  shipping_address: Address
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  items_count?: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_name: string
  product_image: string | null
  price: number
  quantity: number
}

export interface Address {
  id?: number
  label?: string
  full_name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  zip: string
  country: string
  is_default?: boolean
}

export interface Review {
  id: number
  rating: number
  title: string | null
  body: string | null
  user: { name: string }
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface ProductFilters {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  sort?: string
  featured?: boolean
  in_stock?: boolean
  per_page?: number
  page?: number
}
