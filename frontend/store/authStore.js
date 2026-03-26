import { create } from 'zustand'
import api from '@/services/api'

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // Регистрация
  register: async (email, username, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/register/', { email, username, password })
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      set({ user: res.data.user, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data || 'Ошибка регистрации', isLoading: false })
      return false
    }
  },

  // Вход
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login/', { email, password })
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      set({ user: res.data.user, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.error || 'Ошибка входа', isLoading: false })
      return false
    }
  },

  // Выход
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null })
  },

  // Получить текущего пользователя
  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me/')
      set({ user: res.data })
    } catch {
      set({ user: null })
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore