import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Product, PaginatedResponse } from '../types'

export function useProducts(filters: Record<string, unknown> = {}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/products', { params: filters })
      return data
    },
  })
}

export function useProduct(slug: string) {
  return useQuery<{ product: Product }>({
    queryKey: QUERY_KEYS.products.detail(slug),
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.products.featured(),
    queryFn: async () => {
      const { data } = await api.get('/products/featured')
      return data.data
    },
  })
}
