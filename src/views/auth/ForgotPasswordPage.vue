<template>
  <ion-page>
    <ion-content class="ion-padding-horizontal [--background:#ffffff]">

      <!-- Background Shapes -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-tr-full -z-10 opacity-60"></div>

      <div class="flex flex-col justify-between min-h-full py-8 px-4">

        <!-- Top Section: Logo Image -->
        <div class="flex flex-col items-center mt-12">
          <div class="w-48 h-48 flex items-center justify-center mb-2">
            <img
                src="/images/login-image.png"
                alt="অ্যাপ লোগো"
                class="object-contain w-full h-full"
            />
          </div>
        </div>

        <!-- Middle Section -->
        <div class="flex-1 flex flex-col justify-center my-8 max-w-md w-full mx-auto">
          
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-800">পাসওয়ার্ড ভুলে গেছেন?</h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ step === 1 ? 'আপনার নিবন্ধিত মোবাইল নম্বরটি দিন এবং ওটিপি (OTP) কোড পাঠান।' : 'আপনার মোবাইলে পাঠানো ওটিপি (OTP) ও নতুন পাসওয়ার্ড দিন।' }}
            </p>
          </div>

          <form @submit.prevent="step === 1 ? handleSendOtp() : handleResetPassword()" class="space-y-4">

            <!-- Step 1: Phone input -->
            <ion-item
                v-if="step === 1"
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="callOutline"
                  class="text-blue-600 text-xl mr-3 m-0"
              />

              <div class="text-gray-700 font-medium mr-2">
                +880
              </div>

              <ion-input
                  v-model="formData.phone"
                  type="tel"
                  inputmode="numeric"
                  maxlength="11"
                  placeholder="১XXXXXXXXX"
                  required
                  class="custom-input"
              />
            </ion-item>

            <!-- Step 2: OTP & New Password input -->
            <div v-if="step === 2" class="space-y-4">
              <ion-item
                  lines="none"
                  class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
              >
                <ion-icon
                    slot="start"
                    :icon="keyOutline"
                    class="text-blue-600 text-xl mr-3 m-0"
                />

                <ion-input
                    v-model="formData.otp"
                    type="tel"
                    inputmode="numeric"
                    maxlength="6"
                    placeholder="৬ ডিজিটের ওটিপি (OTP)"
                    required
                    class="custom-input"
                />
              </ion-item>

              <ion-item
                  lines="none"
                  class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
              >
                <ion-icon
                    slot="start"
                    :icon="lockClosedOutline"
                    class="text-blue-600 text-xl mr-3 m-0"
                />

                <ion-input
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="নতুন পাসওয়ার্ড"
                    v-model="formData.password"
                    required
                    class="custom-input"
                />

                <ion-button
                    slot="end"
                    fill="clear"
                    @click="showPassword = !showPassword"
                    class="m-0 h-full text-gray-500 hover:text-gray-700 [--padding-start:0] [--padding-end:0]"
                >
                  <ion-icon
                      slot="icon-only"
                      :icon="showPassword ? eyeOffOutline : eyeOutline"
                      class="text-xl"
                  />
                </ion-button>
              </ion-item>

              <ion-item
                  lines="none"
                  class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
              >
                <ion-icon
                    slot="start"
                    :icon="shieldCheckmarkOutline"
                    class="text-blue-600 text-xl mr-3 m-0"
                />

                <ion-input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                    v-model="formData.password_confirmation"
                    required
                    class="custom-input"
                />

                <ion-button
                    slot="end"
                    fill="clear"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="m-0 h-full text-gray-500 hover:text-gray-700 [--padding-start:0] [--padding-end:0]"
                >
                  <ion-icon
                      slot="icon-only"
                      :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
                      class="text-xl"
                  />
                </ion-button>
              </ion-item>
            </div>

            <ion-button
                type="submit"
                expand="block"
                :disabled="submitting"
                class="w-full text-base font-semibold mt-4 h-[54px] [--background:#2563eb] [--background-hover:#1d4ed8] [--background-activated:#1e40af] [--border-radius:12px] [--box-shadow:none]"
            >
              <ion-spinner v-if="submitting" name="crescent" class="mr-2" />
              {{ step === 1 ? 'ওটিপি পাঠান' : 'পাসওয়ার্ড পরিবর্তন করুন' }}
            </ion-button>

          </form>
        </div>

        <div class="text-center pb-4">
          <p class="text-sm text-gray-500 font-medium">
            ইতিমধ্যে পাসওয়ার্ড মনে পড়েছে?
            <router-link
                to="/auth/login"
                class="text-blue-600 font-bold hover:underline ml-1"
            >
              লগইন করুন
            </router-link>
          </p>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage,
  IonContent,
  IonIcon,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  onIonViewWillEnter,
  onIonViewWillLeave
} from '@ionic/vue'

import {
  callOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  keyOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons'
import { useAlert, useFunction } from "@/composables/index.js"
import router from "@/router/index.js"
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

onIonViewWillEnter(async () => {
  document.documentElement.classList.remove('dark', 'ion-palette-dark')
  document.documentElement.setAttribute('data-theme', 'light')
  await themeStore.updateStatusBar()
})

onIonViewWillLeave(async () => {
  await themeStore.loadTheme()
})

const { submitData } = useFunction()
const { toastAlert } = useAlert()

const step = ref(1)
const submitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = ref({
  phone: '',
  otp: '',
  password: '',
  password_confirmation: ''
})

const handleSendOtp = async () => {
  if (!formData.value.phone) return

  submitting.value = true
  try {
    const resp = await submitData({
      url: 'forgot-password/send-otp',
      data: { phone: formData.value.phone },
      rtnFullResp: true
    })

    if (resp && parseInt(resp.status) === 2000) {
      toastAlert('success', resp.message || 'OTP Sent successfully')
      step.value = 2
    } else if (resp) {
      toastAlert('error', resp.message || 'Failed to send OTP')
    } else {
      toastAlert('error', 'Connection failed or server is unreachable.')
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', 'Error sending OTP')
  } finally {
    submitting.value = false
  }
}

const handleResetPassword = async () => {
  if (!formData.value.otp || !formData.value.password || !formData.value.password_confirmation) {
    toastAlert('error', 'সব তথ্য পূরণ করুন।')
    return
  }
  if (formData.value.password !== formData.value.password_confirmation) {
    toastAlert('error', 'পাসওয়ার্ড দুটি মিলছে না।')
    return
  }

  submitting.value = true
  try {
    const resp = await submitData({
      url: 'forgot-password/reset',
      data: {
        phone: formData.value.phone,
        otp: formData.value.otp,
        password: formData.value.password,
        password_confirmation: formData.value.password_confirmation
      },
      rtnFullResp: true
    })

    if (resp && parseInt(resp.status) === 2000) {
      toastAlert('success', resp.message || 'Password reset successfully')
      router.replace('/auth/login')
    } else if (resp) {
      toastAlert('error', resp.message || 'Failed to reset password')
    } else {
      toastAlert('error', 'Connection failed or server is unreachable.')
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', 'Error resetting password')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
ion-page, ion-content {
  --background: #ffffff !important;
  background-color: #ffffff !important;
  background: #ffffff !important;
}

.custom-input {
  --color: #000000;
  --placeholder-color: #6b7280;
  --placeholder-opacity: 1;
}
</style>
