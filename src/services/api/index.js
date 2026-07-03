import axios from 'axios'

import {useCP} from "../../composables/useCP.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

const {get} = useCP()
api.interceptors.request.use(async (config) => {
    const result = await get('auth_token')

    const token = result?.value

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api