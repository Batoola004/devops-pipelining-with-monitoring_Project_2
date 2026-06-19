import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWishlistStore } from '../stores/wishlist-store'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Product } from '../types'

export function useWishlist() {
  const queryClient = useQueryClient()
  const setIds = useWishlistStore((s) => s.setIds)

  const query = useQuery<{ items: { id: number; product: Product }[] }>({
    queryKey: QUERY_KEYS.wishlist.detail(),
    queryFn: async () => {
      const { data } = await api.get('/wishlist')
      setIds(data.items.map((i: { product: Product }) => i.product.id))
      return data
    },
  })

  const addItem = useMutation({
    mutationFn: async (productId: number) => {
      await api.post('/wishlist', { product_id: productId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.detail() })
    },
  })

  const removeItem = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/wishlist/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.detail() })
    },
  })

  return { ...query, addItem, removeItem }
}
