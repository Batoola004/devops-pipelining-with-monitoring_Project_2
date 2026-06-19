import { create } from 'zustand'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isDrawerOpen: boolean
  setItems: (items: CartItem[]) => void
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isDrawerOpen: false,

  setItems: (items) =>
    set({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}))
