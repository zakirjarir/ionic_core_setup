<template>
  <ion-page>
    <ion-content class="ion-padding-horizontal [--background:#ffffff]">

      <!-- Background Shapes -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-tr-full -z-10 opacity-60"></div>

      <div class="flex flex-col justify-between min-h-full py-8 px-4">

        <!-- Logo -->
        <div class="flex flex-col items-center mt-8">
          <div class="w-40 h-40 flex items-center justify-center">
            <img
                src="/images/login-image.png"
                alt="অ্যাপ লোগো"
                class="object-contain w-full h-full"
            />
          </div>
        </div>

        <!-- Form -->
        <div class="flex-1 flex flex-col justify-center my-6 max-w-md w-full mx-auto">
          <form @submit.prevent="handleRegister" class="space-y-4">

            <!-- পূর্ণ নাম -->
            <ion-item
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="personOutline"
                  class="text-blue-600 text-xl mr-3"
              />

              <ion-input
                  v-model="store.formData.name"
                  placeholder="পূর্ণ নাম"
                  class="custom-input"
              />
            </ion-item>

            <!-- মোবাইল নম্বর -->
            <ion-item
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="callOutline"
                  class="text-blue-600 text-xl mr-3"
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
                  class="custom-input"
              />
            </ion-item>


            <ion-item
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="lockClosedOutline"
                  class="text-blue-600 text-xl mr-3"
              />

              <ion-input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="store.formData.password"
                  placeholder="পাসওয়ার্ড"
                  class="custom-input"
              />

              <ion-button
                  slot="end"
                  fill="clear"
                  @click="showPassword = !showPassword"
                  class="[--padding-start:0] [--padding-end:0]"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="showPassword ? eyeOffOutline : eyeOutline"
                />
              </ion-button>
            </ion-item>

            <ion-item
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="shieldCheckmarkOutline"
                  class="text-blue-600 text-xl mr-3"
              />

              <ion-input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="store.formData.password_confirmation"
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  class="custom-input"
              />

              <ion-button
                  slot="end"
                  fill="clear"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="[--padding-start:0] [--padding-end:0]"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
                />
              </ion-button>
            </ion-item>


            <ion-button
                type="submit"
                expand="block"
                class="w-full text-base font-semibold mt-2 h-[54px] [--background:#2563eb] [--background-hover:#1d4ed8] [--background-activated:#1e40af] [--border-radius:12px] [--box-shadow:none]"
            >
              অ্যাকাউন্ট তৈরি করুন
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
<!--              @click="handleGoogleRegister"-->
<!--              class="w-full text-base font-semibold h-[50px] [&#45;&#45;border-color:#e5e7eb] [&#45;&#45;border-width:1px] [&#45;&#45;border-radius:12px] [&#45;&#45;color:#374151] [&#45;&#45;box-shadow:none]"-->
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

        <!-- লগইন লিংক -->
        <div class="text-center pb-4">
          <p class="text-sm text-gray-500 font-medium">
            ইতিমধ্যে একটি অ্যাকাউন্ট আছে?
            <router-link
                to="/auth/login"
                class="text-blue-600 font-bold ml-1"
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
  IonItem,
  IonInput,
  IonIcon,
  IonButton
} from '@ionic/vue'

import {
  personOutline,
  callOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons'
import {useFunction, useStore} from "@/composables/index.js";
import router from "@/router/index.js";


const showPassword = ref(false)
const showConfirmPassword = ref(false)

const store = useStore();
const {submitData} = useFunction()
const handleRegister = async () => {
  const resp = await submitData({
    url:'register'
  })
  if (resp){
    router.replace('/')
  }
}

const handleGoogleRegister = () => {
  console.log('গুগল নিবন্ধন ক্লিক করা হয়েছে')
}
</script>

<style scoped>
.custom-input {
  --color: #000000;
  --placeholder-color: #6b7280;
  --placeholder-opacity: 1;
}

</style>