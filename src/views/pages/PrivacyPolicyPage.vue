<template>
  <ion-page>
    <z-header :title="$t('privacy.title')"/>


    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <div class="p-4 flex flex-col gap-5">
        <div class="flex flex-col items-center text-center py-4 gap-2">
          <ion-icon :icon="shieldCheckmarkOutline" class="text-5xl text-indigo-600 dark:text-indigo-400" />
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{{ $t('privacy.title') }}</h2>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">{{ $t('privacy.last_updated') }}: July 1, 2026</p>
        </div>

        <div v-for="section in sections" :key="section.key" class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">{{ section.title }}</h3>
          <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ section.body }}</p>
        </div>

        <p class="text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-4">{{ $t('privacy.contact') }}: privacy@biveec.app</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonIcon,
} from '@ionic/vue'
import { shieldCheckmarkOutline } from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";

const { t } = useI18n()

const sections = computed(() => [
  {
    key: 'intro',
    title: 'Introduction',
    body: t('privacy.intro'),
  },
  {
    key: 'collection',
    title: t('privacy.data_collection'),
    body: 'We collect information you provide directly to us, such as when you create an account, add children, or record vaccinations. This includes names, dates of birth, vaccination records, and contact information.',
  },
  {
    key: 'use',
    title: t('privacy.data_use'),
    body: 'We use the information collected to provide, maintain, and improve our services, send vaccination reminders, and provide customer support.',
  },
  {
    key: 'security',
    title: t('privacy.data_security'),
    body: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
  },
])
</script>
