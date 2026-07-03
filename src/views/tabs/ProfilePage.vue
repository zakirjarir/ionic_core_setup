<template>
  <ion-page>
    <z-header :title="$t('profile.title')">
      <template #end>
        <ion-button fill="clear" @click="editing = !editing" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="editing ? closeOutline : createOutline" />
        </ion-button>
      </template>
    </z-header>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <!-- Profile Header -->
      <div class="bg-gradient-to-tr from-indigo-600 to-cyan-500 py-10 px-6 flex flex-col items-center gap-3">
        <div class="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-4xl text-white">
          <ion-icon :icon="personOutline" />
        </div>
        <h2 class="text-xl font-extrabold text-white">{{ authStore.user?.name || 'User' }}</h2>
        <p class="text-xs text-white/80 font-medium">{{ authStore.user?.email || '' }}</p>
      </div>

      <!-- Info -->
      <div class="p-4">
        <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-3.5 pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <ion-icon :icon="personOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('profile.full_name') }}</p>
              <ion-input v-if="editing" v-model="form.name" class="w-full text-base font-semibold text-zinc-950 dark:text-zinc-50 border-none bg-transparent h-8 p-0" />
              <p v-else class="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{{ form.name }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3.5 pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <ion-icon :icon="mailOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('profile.email') }}</p>
              <ion-input v-if="editing" v-model="form.email" type="email" class="w-full text-base font-semibold text-zinc-950 dark:text-zinc-50 border-none bg-transparent h-8 p-0" />
              <p v-else class="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{{ form.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3.5 pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <ion-icon :icon="callOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('profile.phone') }}</p>
              <ion-input v-if="editing" v-model="form.phone" type="tel" class="w-full text-base font-semibold text-zinc-950 dark:text-zinc-50 border-none bg-transparent h-8 p-0" />
              <p v-else class="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{{ form.phone || '—' }}</p>
            </div>
          </div>

          <ion-button
            v-if="editing"
            class="h-12 font-semibold text-sm mt-3"
            style="--background: #4f46e5; --border-radius: 12px; --color: #fff;"
            expand="block"
            @click="saveProfile"
          >
            {{ $t('profile.update_profile') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonMenuButton, IonIcon, IonInput, toastController,
} from '@ionic/vue'
import { personOutline, mailOutline, callOutline, createOutline, closeOutline } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import ZHeader from "@/components/ZHeader.vue";

const { t } = useI18n()
const authStore = useAuthStore()
const editing = ref(false)

const form = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
})

async function saveProfile() {
  editing.value = false
  const toast = await toastController.create({
    message: t('profile.profile_updated'),
    duration: 2000,
    position: 'bottom',
    color: 'success',
  })
  await toast.present()
}
</script>
