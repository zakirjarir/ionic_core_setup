import axios from 'axios'
import router from '@/router'

import { useCP } from '../../composables/useCP.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

const { get, remove } = useCP()

// Request Interceptor
api.interceptors.request.use(async (config) => {
    const token = await get('auth_token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {

            await remove('auth_token')

            // Login Page Redirect
            router.replace('/auth/login')
        }

        return Promise.reject(error)
    }
)

export default api