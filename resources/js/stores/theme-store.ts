import { create } from 'zustand'

interface ThemeState {
  dark: boolean
  toggle: () => void
  init: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: false,

  toggle: () => {
    const next = !get().dark
    set({ dark: next })
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  },

  init: () => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored ? stored === 'dark' : prefersDark
    set({ dark })
    document.documentElement.classList.toggle('dark', dark)
  },
}))
