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
          <form @submit.prevent="handleLogin" class="space-y-4">

            <ion-item
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
                  v-model="store.formData.phone"
                  type="tel"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="১XXXXXXXXX"
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
                  placeholder="পাসওয়ার্ড"
                  v-model="store.formData.password"
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

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <ion-checkbox
                    v-model="store.formData.remember_me"
                    id="rememberMe"
                    class="[--border-radius:4px] [--size:18px]"
                />
                <label
                    for="rememberMe"
                    class="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  আমাকে মনে রাখুন
                </label>
              </div>

              <router-link
                  to="/auth/forgot-password"
                  class="text-sm font-semibold text-blue-600 hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </router-link>
            </div>

            <ion-button
                type="submit"
                expand="block"
                class="w-full text-base font-semibold mt-2 h-[54px] [--background:#2563eb] [--background-hover:#1d4ed8] [--background-activated:#1e40af] [--border-radius:12px] [--box-shadow:none]"
            >
              লগইন
            </ion-button>

          </form>

<!--          <div class="flex items-center my-6">-->
<!--            <div class="flex-1 border-t border-gray-200"></div>-->
<!--            <span class="px-4 text-xs text-gray-400 font-bold tracking-wider">-->
<!--              অথবা-->
<!--            </span>-->
<!--            <div class="flex-1 border-t border-gray-200"></div>-->
<!--          </div>-->

<!--          <ion-button-->
<!--              expand="block"-->
<!--              fill="outline"-->
<!--              @click="handleGoogleLogin"-->
<!--              class="w-full text-base font-semibold h-[50px] [&#45;&#45;border-color:#e5e7eb] [&#45;&#45;border-width:1px] [&#45;&#45;border-radius:12px] [&#45;&#45;color:#374151] [&#45;&#45;background-hover:#f9fafb] [&#45;&#45;background-activated:#f3f4f6] [&#45;&#45;box-shadow:none]"-->
<!--          >-->
<!--            <svg-->
<!--                class="w-5 h-5 mr-3"-->
<!--                viewBox="0 0 24 24"-->
<!--                xmlns="http://www.w3.org/2000/svg"-->
<!--                slot="start"-->
<!--            >-->
<!--              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>-->
<!--              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>-->
<!--              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>-->
<!--              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>-->
<!--            </svg>-->

<!--            গুগল দিয়ে চালিয়ে যান-->
<!--          </ion-button>-->
        </div>

        <div class="text-center pb-4">
          <p class="text-sm text-gray-500 font-medium">
            কোনো অ্যাকাউন্ট নেই?
            <router-link
                to="/auth/register"
                class="text-blue-600 font-bold hover:underline ml-1"
            >
              নিবন্ধন করুন
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
  IonCheckbox
} from '@ionic/vue'

import {
  callOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons'
import {useAlert, useCP, useFunction, useStore} from "@/composables/index.js";
import router from "@/router/index.js";

const store = useStore()
const { submitData} = useFunction()
const CP = useCP()
const {toastAlert} =useAlert()
const showPassword = ref(false)


const handleLogin = async () => {
  const resp = await submitData({
    url: 'login',
    rtnFullResp:true
  });

  console.log(resp)
  if (parseInt(resp.status) === 2000){
   await CP.set('auth_token' ,resp?.result?.token)
   await CP.set('user' ,resp?.result?.user)

    store.authToken = resp?.result?.token

   const token = await CP.get('auth_token')
    console.log('token',token)
    return router.replace('/tabs/dashboard')
  }else {
    toastAlert(parseInt(resp.status), resp.message || 'Something went wrong')
  }
}

</script>

<style scoped>
.custom-input {
  --color: #000000;
  --placeholder-color: #6b7280;
  --placeholder-opacity: 1;
}

ion-checkbox {
  --checkmark-color: #ffffff;
  --background-checked: #2563eb;
  --border-color: #d1d5db;
  --border-color-checked: #2563eb;
}
</style>