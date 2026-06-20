import { create } from 'zustand'

interface UIState {
  isMobileNavOpen: boolean
  isSearchOpen: boolean
  activeFilterCount: number
  toggleMobileNav: () => void
  toggleSearch: () => void
  setActiveFilterCount: (count: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  activeFilterCount: 0,

  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setActiveFilterCount: (count) => set({ activeFilterCount: count }),
}))
