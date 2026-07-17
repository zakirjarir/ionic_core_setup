<template>
  <ion-page>

    <z-header :title="$t('language.title')"/>


    <ion-content>
      <div class="p-4 flex flex-col gap-4">
        <p class="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{{ $t('language.select_language') }}</p>

        <div class="flex flex-col gap-3">
          <button
            v-for="lang in supportedLocales"
            :key="lang.code"
            class="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer transition-all active:scale-[0.98] text-left"
            :class="{ 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md shadow-indigo-500/5': currentLocale === lang.code }"
            @click="selectLanguage(lang.code)"
          >
            <div class="text-3xl flex-shrink-0 leading-none">{{ flagMap[lang.code] }}</div>
            <div class="flex-1 flex flex-col gap-0.5">
              <span class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ lang.nativeName }}</span>
              <span class="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">{{ lang.name }}</span>
            </div>
            <div class="text-xl text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-1" v-if="currentLocale === lang.code">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <div
              class="text-[9px] font-extrabold uppercase px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 tracking-wider"
              :class="{ 'bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400': currentLocale === lang.code }"
            >
              {{ lang.dir }}
            </div>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonIcon, toastController,
} from '@ionic/vue'
import { checkmarkCircleOutline } from 'ionicons/icons'
import { useLanguage } from '@/composables/useLanguage'
import ZHeader from "@/components/ZHeader.vue";

const { t } = useI18n()
const { currentLocale, supportedLocales, setLanguage } = useLanguage()

const flagMap = { en: '🇬🇧', bn: '🇧🇩', ar: '🇸🇦' }

async function selectLanguage(code) {
  setLanguage(code)
  const toast = await toastController.create({
    message: t('language.changed'),
    duration: 1800,
    position: 'bottom',
    color: 'success',
  })
  await toast.present()
}
</script>
