import { defineStore } from 'pinia'
import {reactive, ref} from 'vue'

export const useStore = defineStore('data', () => {
    // state
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const mainUrl = import.meta.env.VITE_API_MAIN_URL


    const formData = reactive({})
    const dataList = reactive({})
    const data = reactive({})
    const updateId = ref(0)
    const per_page = ref(10)
    const formFilter = ref({})
    const generalData = ref({})

    const errors = ref({})

    const loading = ref(false)
    const submitLoading = ref(false)
    const uploadLoading = ref(false)
    const configLoading = ref(false)
    const isOnline = ref(false)

    const networkConnectionType = ref('unknown')
    const userStatus = reactive({})
    const user = ref(null)
    const userId = ref(null)
    const authToken = ref(null)
    const currentLocale = ref(null)
    const unreadNotificationsCount = ref(0)





    const birthTypes = [
        { label: 'Normal Delivery', value: 'normal_delivery' },
        { label: 'Elective C-Section', value: 'elective_c_section' },
        { label: 'Emergency C-Section', value: 'emergency_c_section' },
        { label: 'Home Delivery', value: 'home_delivery' },
        { label: 'Hospital Delivery', value: 'hospital_delivery' },
        { label: 'Unknown', value: 'unknown' }
    ]

    const genders = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ]
    const bloodGroups = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
    ]


    const reset = () => {
        authToken.value = null
        currentLocale.value = null
        generalData.value = {}
        formData.value = {}
        user.value = null
    }

    return {
        baseUrl,
        mainUrl,
        updateId,

        userId,
        authToken,
        currentLocale,

        loading,
        uploadLoading,
        submitLoading,
        configLoading,
        errors,
        generalData,
        formData,
        isOnline,
        networkConnectionType,

        userStatus,
        user,

        per_page,
        formFilter,
        dataList,
        data,
        reset,
        genders,
        birthTypes,
        bloodGroups,
        unreadNotificationsCount
    }

})
