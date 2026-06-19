import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCartStore } from '../stores/cart-store'
import { useAuthStore } from '../stores/auth-store'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Cart, CartItem } from '../types'

export function useCart() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setItems = useCartStore((s) => s.setItems)

  const query = useQuery<Cart>({
    queryKey: QUERY_KEYS.cart.detail(),
    queryFn: async () => {
      const { data } = await api.get('/cart')
      setItems(data.items ?? [])
      return data
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  })

  const refetchCart = () => {
    if (isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.detail() })
    }
  }

  const addItem = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const { data } = await api.post('/cart', { product_id: productId, quantity })
      return data
    },
    onSuccess: (data) => {
      setItems(data.items ?? [])
      refetchCart()
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error('Please log in to add items to your cart')
      } else if (error?.response?.status === 409) {
        toast.error(error?.response?.data?.message ?? 'Not enough stock')
      } else {
        toast.error('Failed to add item to cart')
      }
    },
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const { data } = await api.patch(`/cart/${id}`, { quantity })
      return data
    },
    onSuccess: (data) => {
      setItems(data.items ?? [])
      refetchCart()
    },
  })

  const removeItem = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cart/${id}`)
    },
    onSuccess: (_data, variables) => {
      const currentItems = useCartStore.getState().items
      const updated = currentItems.filter((i) => i.id !== variables)
      useCartStore.getState().setItems(updated)
      refetchCart()
    },
  })

  const clearCart = useMutation({
    mutationFn: async () => {
      await api.delete('/cart')
    },
    onSuccess: () => {
      useCartStore.getState().setItems([])
      refetchCart()
    },
  })

  return { ...query, addItem, updateItem, removeItem, clearCart }
}
