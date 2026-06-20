import { create } from 'zustand'

interface WishlistState {
  ids: Set<number>
  setIds: (ids: number[]) => void
  add: (productId: number) => void
  remove: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  toggle: (productId: number) => void
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set<number>(),

  setIds: (ids) => set({ ids: new Set(ids) }),

  add: (productId) =>
    set((state) => {
      const next = new Set(state.ids)
      next.add(productId)
      return { ids: next }
    }),

  remove: (productId) =>
    set((state) => {
      const next = new Set(state.ids)
      next.delete(productId)
      return { ids: next }
    }),

  isWishlisted: (productId) => get().ids.has(productId),
  toggle: (productId) => {
    const { ids } = get()
    if (ids.has(productId)) {
      set({ ids: new Set([...ids].filter((id) => id !== productId)) })
    } else {
      set({ ids: new Set([...ids, productId]) })
    }
  },
}))
