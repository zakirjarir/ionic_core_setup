<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-zinc-50 dark:bg-zinc-950">
      <div class="min-h-full flex flex-col justify-between px-6 py-10 bg-zinc-50 dark:bg-zinc-950">
        <!-- Logo -->
        <div class="flex flex-col items-center pt-8 pb-6">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
            <ion-icon :icon="heartOutline" class="text-4xl text-white" />
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{{ $t('common.app_name') }}</h1>
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">{{ $t('common.app_tagline') }}</p>
        </div>

        <!-- Form -->
        <div class="flex-1 flex flex-col justify-center gap-5 max-w-md w-full mx-auto">
          <div class="mb-2">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ $t('auth.welcome_back') }}</h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('auth.sign_in_subtitle') }}</p>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{{ $t('auth.email_label') }}</span>
            <ion-input
              v-model="form.email"
              type="email"
              :placeholder="$t('auth.email_placeholder')"
              class="w-full h-14 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-sm font-medium"
              autocomplete="email"
            />
            <span v-if="errors.email" class="text-xs font-medium text-red-500">{{ errors.email }}</span>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{{ $t('auth.password_label') }}</span>
            <div class="relative flex items-center w-full">
              <ion-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('auth.password_placeholder')"
                class="w-full h-14 pl-4 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-sm font-medium"
                autocomplete="current-password"
              />
              <button class="absolute right-3.5 bg-transparent border-none cursor-pointer text-zinc-400 dark:text-zinc-500 flex items-center text-xl p-2 z-10" @click="showPassword = !showPassword" type="button">
                <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
              </button>
            </div>
            <span v-if="errors.password" class="text-xs font-medium text-red-500">{{ errors.password }}</span>
          </div>

          <!-- Forgot Password -->
          <router-link to="/forgot-password" class="self-end text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            {{ $t('auth.forgot_password') }}
          </router-link>

          <!-- Login Button -->
          <ion-button
            @click="handleLogin"
            :disabled="loading"
            class="h-14 font-semibold text-base mt-2 shadow-md shadow-indigo-500/10"
            color="primary"
          >
            <ion-spinner v-if="loading" name="crescent" class="mr-2" />
            {{ loading ? $t('auth.signing_in') : $t('auth.sign_in') }}
          </ion-button>

          <!-- Divider -->
          <div class="flex items-center gap-3 py-2">
            <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span class="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">{{ $t('common.or') }}</span>
            <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <!-- Google Button -->
          <ion-button
            class="h-14 font-semibold text-sm border-none shadow-sm"
            color="light"
            @click="handleGoogle"
          >
            <img class="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            {{ $t('auth.continue_with_google') }}
          </ion-button>
        </div>

        <!-- Footer -->
        <div class="flex justify-center items-center gap-1.5 pt-6 pb-2">
          <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ $t('auth.no_account') }}</span>
          <router-link to="/register" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">{{ $t('auth.register') }}</router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  toastController,
} from '@ionic/vue'
import { heartOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = t('validation.email_required')
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('validation.email_invalid')
    valid = false
  }

  if (!form.password) {
    errors.password = t('validation.password_required')
    valid = false
  } else if (form.password.length < 6) {
    errors.password = t('validation.password_min', { n: 6 })
    valid = false
  }

  return valid
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.login({ email: form.email, password: form.password })
    router.replace('/tabs/dashboard')
  } catch (error) {
    const toast = await toastController.create({
      message: error?.message || t('auth.login_failed'),
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    })
    await toast.present()
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  const toast = await toastController.create({
    message: t('auth.google_coming_soon'),
    duration: 2000,
    position: 'bottom',
  })
  await toast.present()
}
</script>
