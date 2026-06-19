import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Category } from '../types'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: QUERY_KEYS.categories.list(),
    queryFn: async () => {
      const { data } = await api.get('/categories', { params: { with_products_count: 1 } })
      return data.categories
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useCategory(slug: string) {
  return useQuery<{ category: Category }>({
    queryKey: QUERY_KEYS.categories.detail(slug),
    queryFn: async () => {
      const { data } = await api.get(`/categories/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
