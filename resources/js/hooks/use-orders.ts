import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import { QUERY_KEYS } from '../lib/constants'
import type { Order, PaginatedResponse } from '../types'

export function useOrders(filters?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: QUERY_KEYS.orders.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/orders', { params: filters })
      return data
    },
  })
}

export function useOrder(id: number) {
  return useQuery<{ order: Order }>({
    queryKey: QUERY_KEYS.orders.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (checkoutData: {
      shipping_address_id?: number
      shipping_address?: Record<string, string>
      payment_method: string
      notes?: string
    }) => {
      const { data } = await api.post('/checkout', checkoutData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.detail() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.lists() })
    },
  })
}
