import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function persistAuth() {
    localStorage.setItem('auth_user', JSON.stringify(user.value))
    localStorage.setItem('auth_token', token.value || '')
  }

  function clearAuth() {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  async function login(credentials) {
    // const response = await api.post('/auth/login', credentials)
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: credentials.email,
      avatar: null,
    }
    const mockToken = 'mock-jwt-token-' + Date.now()

    user.value = mockUser
    token.value = mockToken
    persistAuth()
    return mockUser
  }

  async function register(data) {
    // TODO: replace with real API call
    const mockUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      avatar: null,
    }
    const mockToken = 'mock-jwt-token-' + Date.now()

    user.value = mockUser
    token.value = mockToken
    persistAuth()
    return mockUser
  }

  async function logout() {
    // TODO: call API logout endpoint if needed
    user.value = null
    token.value = null
    clearAuth()
  }

  async function fetchUser() {
    if (!token.value) return null
    // TODO: replace with real API call
    // const response = await api.get('/auth/me')
    // user.value = response.data
    return user.value
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  }
})
