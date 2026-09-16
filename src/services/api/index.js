import axios from 'axios'
import router from '@/router'

import { useCP } from '../../composables/useCP.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 10000,
})

const { get, remove } = useCP()

let isRedirecting = false

const redirectToLogin = async () => {
    if (isRedirecting) return
    isRedirecting = true

    try {
        await remove('auth_token')
        await remove('user')
    } catch (e) {
        console.error('Error clearing auth credentials:', e)
    }

    const currentPath = window.location.pathname
    if (!currentPath.startsWith('/auth')) {
        if (router && router.currentRoute?.value?.path !== '/auth/login') {
            router.replace('/auth/login')
        } else {
            window.location.href = '/auth/login'
        }
    }

    setTimeout(() => {
        isRedirecting = false
    }, 1500)
}

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
    async (response) => {
        const msg = response?.data?.message
        const status = parseInt(response?.data?.status)
        if (
            msg === 'Unauthenticated.' ||
            msg === 'Unauthenticated' ||
            status === 4001 ||
            status === 401
        ) {
            await redirectToLogin()
        }
        return response
    },
    async (error) => {
        const msg = error.response?.data?.message
        const status = error.response?.status
        const dataStatus = parseInt(error.response?.data?.status)

        if (
            status === 401 ||
            msg === 'Unauthenticated.' ||
            msg === 'Unauthenticated' ||
            dataStatus === 4001 ||
            dataStatus === 401
        ) {
            await redirectToLogin()
        }

        return Promise.reject(error)
    }
)

export default api
