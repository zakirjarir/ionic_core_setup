<template>
  <ion-page>
    <ion-content class="ion-padding-horizontal [--background:#ffffff]">

      <!-- Background Shapes -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-tr-full -z-10 opacity-60"></div>

      <div class="flex flex-col justify-between min-h-full py-8 px-4">

        <!-- Top Section -->
        <div class="flex flex-col items-center mt-12">
          <div class="w-40 h-40 flex items-center justify-center">
            <img
                src="/images/login-image.png"
                alt="App Logo"
                class="object-contain w-full h-full"
            />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 mt-4">
            Forgot Password
          </h1>

          <p class="text-center text-gray-500 mt-2 max-w-xs">
            Enter your mobile number and we'll send you a verification code.
          </p>
        </div>

        <!-- Form -->
        <div class="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">

          <form @submit.prevent="handleContinue" class="space-y-5">

            <!-- Mobile Number Input -->
            <ion-item
                lines="none"
                class="w-full bg-white border border-gray-300 rounded-xl px-4 h-[56px] [--background:transparent] [--inner-padding-end:0] [--padding-start:0]"
            >
              <ion-icon
                  slot="start"
                  :icon="callOutline"
                  class="text-blue-600 text-xl mr-3"
              />

              <div class="font-medium text-gray-700 mr-2">
                +880
              </div>

              <ion-input
                  v-model="phone"
                  type="tel"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="1XXXXXXXXX"
                  class="custom-input"
              />
            </ion-item>

            <!-- Continue Button -->
            <ion-button
                type="submit"
                expand="block"
                class="w-full h-[54px] text-base font-semibold [--background:#2563eb] [--background-hover:#1d4ed8] [--background-activated:#1e40af] [--border-radius:12px] [--box-shadow:none]"
            >
              Continue
            </ion-button>

          </form>

        </div>

        <!-- Back To Login -->
        <div class="text-center pb-4">
          <a
              href="#"
              class="text-blue-600 font-semibold"
          >
            Back to Login
          </a>
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
  IonButton,
  IonIcon
} from '@ionic/vue'

import { callOutline } from 'ionicons/icons'

const phone = ref('')

const handleContinue = () => {
  const fullPhone = `+880${phone.value}`

  console.log('Phone Number:', fullPhone)

  // API Call Here
}
</script>

<style scoped>
.custom-input {
  --color: #000000;
  --placeholder-color: #6b7280;
  --placeholder-opacity: 1;
}
</style>