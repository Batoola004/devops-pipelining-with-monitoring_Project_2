import { create } from 'zustand'
import api, { setAuthToken } from '../lib/axios'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuthToken(data.token)
      set({ user: data.user, token: data.token, isAuthenticated: true })
    } catch (err: any) {
      const errors = err?.response?.data?.errors ?? {}
      throw errors
    }
  },

  register: async (registerData) => {
    try {
      const { data } = await api.post('/auth/register', registerData)
      setAuthToken(data.token)
      set({ user: data.user, token: data.token, isAuthenticated: true })
    } catch (err: any) {
      const errors = err?.response?.data?.errors ?? {}
      throw errors
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {
    }
    setAuthToken(null)
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const storedToken = localStorage.getItem('auth_token')
    if (!storedToken) {
      try {
        const { data } = await api.get('/auth/me')
        if (data.user) {
          if (data.token) setAuthToken(data.token)
          set({ user: data.user, token: data.token ?? null, isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      } catch {
        set({ isLoading: false })
      }
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      if (data.user) {
        set({ user: data.user, token: storedToken, isAuthenticated: true, isLoading: false })
      } else {
        setAuthToken(null)
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      setAuthToken(null)
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
