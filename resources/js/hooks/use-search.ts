import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Product, PaginatedResponse } from '../types'

export function useSearch(query: string) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: QUERY_KEYS.search.results(query),
    queryFn: async () => {
      const { data } = await api.get('/search', { params: { q: query } })
      return data
    },
    enabled: query.length >= 2,
  })
}
