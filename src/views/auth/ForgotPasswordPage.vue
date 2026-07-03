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
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ $t('auth.forgot_password') }}</h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('auth.forgot_subtitle') }}</p>
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

          <!-- Send Button -->
          <ion-button
            @click="handleSubmit"
            :disabled="loading || sent"
            class="h-14 font-semibold text-base mt-2 shadow-md shadow-indigo-500/10"
            color="primary"
          >
            <ion-spinner v-if="loading" name="crescent" class="mr-2" />
            {{ loading ? $t('auth.sending') : $t('auth.send_reset_link') }}
          </ion-button>

          <!-- Success State -->
          <div v-if="sent" class="flex flex-col items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-500/30 rounded-xl p-4 text-center mt-2">
            <ion-icon :icon="checkmarkCircleOutline" class="text-3xl text-green-500" />
            <p class="text-sm text-green-700 dark:text-green-400 font-semibold">{{ $t('auth.reset_link_sent') }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-center items-center gap-1.5 pt-6 pb-2">
          <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ $t('auth.have_account') }}</span>
          <router-link to="/auth/login" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">{{ $t('auth.login') }}</router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonContent, IonInput, IonButton, IonIcon, IonSpinner, toastController,
} from '@ionic/vue'
import { heartOutline, checkmarkCircleOutline } from 'ionicons/icons'

const { t } = useI18n()
const loading = ref(false)
const sent = ref(false)
const form = reactive({ email: '' })
const errors = reactive({ email: '' })

function validate() {
  errors.email = ''
  if (!form.email) { errors.email = t('validation.email_required'); return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('validation.email_invalid'); return false }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 1200))
    sent.value = true
  } catch {
    const toast = await toastController.create({
      message: t('auth.reset_failed'),
      duration: 3000, position: 'bottom', color: 'danger',
    })
    await toast.present()
  } finally {
    loading.value = false
  }
}
</script>
