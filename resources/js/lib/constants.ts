export const ROUTES = {
  HOME: '/',
  SHOP: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
} as const

export const QUERY_KEYS = {
  products: {
    all: ['products'],
    lists: () => ['products', 'list'],
    list: (filters: Record<string, unknown>) => ['products', 'list', filters],
    details: () => ['products', 'detail'],
    detail: (slug: string) => ['products', 'detail', slug],
    featured: () => ['products', 'featured'],
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
    detail: (slug: string) => ['categories', 'detail', slug],
  },
  cart: {
    all: ['cart'],
    detail: () => ['cart', 'detail'],
  },
  orders: {
    all: ['orders'],
    lists: () => ['orders', 'list'],
    list: (filters?: Record<string, unknown>) => ['orders', 'list', filters],
    detail: (id: number) => ['orders', 'detail', id],
  },
  wishlist: {
    all: ['wishlist'],
    detail: () => ['wishlist', 'detail'],
  },
  search: {
    all: ['search'],
    results: (query: string) => ['search', query],
  },
} as const

export const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
] as const
