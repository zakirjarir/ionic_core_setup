<template>
  <ion-page>
    <z-header :title="$t('settings.title')"/>

    <ion-content>
      <div class="p-4 flex flex-col gap-5">

        <!-- ── APPEARANCE ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.appearance') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
            <!-- Theme -->
            <div class="flex items-center gap-3">
              <ion-icon :icon="colorPaletteOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.theme') }}</span>
            </div>
            <!-- Theme toggle chips -->
            <div class="flex gap-2">
              <button
                v-for="t in themeOptions"
                :key="t.value"
                class="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-semibold text-[11px] transition-all cursor-pointer"
                :class="{ 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400': themeStore.currentTheme === t.value }"
                @click="themeStore.setTheme(t.value)"
              >
                <ion-icon :icon="t.icon" class="text-lg" />
                <span>{{ $t(t.label) }}</span>
              </button>
            </div>

          </div>
        </div>

        <!-- ── LANGUAGE ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.language_section') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
            <!-- Label -->
            <div class="flex items-center gap-3">
              <ion-icon :icon="languageOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.language') }}</span>
            </div>
            <!-- Language chips -->
            <div class="flex gap-2">
              <button
                v-for="lang in supportedLocales"
                :key="lang.code"
                class="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-semibold text-[11px] transition-all cursor-pointer"
                :class="{ 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400': currentLocale === lang.code }"
                @click="setLanguage(lang.code)"
              >
                <span class="text-base leading-none">{{ lang.code === 'en' ? '🇬🇧' : lang.code === 'bn' ? '🇧🇩' : '🇸🇦' }}</span>
                <span>{{ lang.nativeName }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── NOTIFICATIONS ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.notifications_section') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <ion-icon :icon="notificationsOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.push_notifications') }}</span>
              </div>
              <ion-toggle v-model="pushEnabled" @ionChange="handlePushToggle" color="primary"></ion-toggle>
            </div>
          </div>
        </div>

        <!-- ── ACCOUNT ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.account') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
            <div @click="$router.push('/profile')" class="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="personOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.edit_profile') }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
            </div>
          </div>
        </div>

        <!-- ── SUPPORT ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.support_section') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
            <div @click="$router.push('/support')" class="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="helpCircleOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.help_support') }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
            </div>

            <div @click="$router.push('/privacy-policy')" class="flex items-center justify-between pt-3.5 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="shieldCheckmarkOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.privacy_policy') }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
            </div>
          </div>
        </div>

        <!-- ── ABOUT ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.about_section') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
            <div @click="$router.push('/about')" class="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="informationCircleOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.about_app') }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
            </div>

            <div class="flex items-center justify-between pt-3.5 border-t border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center gap-3">
                <ion-icon :icon="codeSlashOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.version') }}</span>
              </div>
              <span class="text-xs font-semibold text-zinc-400 dark:text-zinc-500">1.0.0</span>
            </div>
          </div>
        </div>

        <!-- Logout -->
        <ion-button
          @click="handleLogout"
          fill="outline"
          color="danger"
        >
          <ion-icon :icon="logOutOutline" class="text-lg" />
          <span>{{ $t('settings.logout') }}</span>
        </ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IonPage,  IonContent, IonIcon,
  IonToggle, alertController,
} from '@ionic/vue'
import {
  colorPaletteOutline, languageOutline, personOutline, lockClosedOutline,
  helpCircleOutline, shieldCheckmarkOutline, informationCircleOutline,
  codeSlashOutline, logOutOutline, notificationsOutline, mailOutline,
  sunnyOutline, moonOutline, desktopOutline, chevronForwardOutline,
} from 'ionicons/icons'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguage } from '@/composables/useLanguage'
import { useStore } from '@/composables/useStore'
import { useFunction } from '@/composables/useFunction'
import ZHeader from "@/components/ZHeader.vue";

import { usePushNotifications } from '@/composables/usePushNotifications'
import { onMounted } from 'vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const store = useStore()
const { logout } = useFunction()
const router = useRouter()
const { currentLocale, currentLocaleInfo, setLanguage, supportedLocales } = useLanguage()
const { registerPush, unregisterPush } = usePushNotifications()

const pushEnabled = ref(true)
const emailEnabled = ref(false)

onMounted(() => {
  if (store.user) {
    pushEnabled.value = store.user.push_enabled ?? true
  }
})

const handlePushToggle = async () => {
  if (pushEnabled.value) {
    await registerPush()
  } else {
    await unregisterPush()
  }
}

const themeOptions = [
  { value: 'light', label: 'settings.theme_light', icon: sunnyOutline },
  { value: 'dark', label: 'settings.theme_dark', icon: moonOutline },
  { value: 'system', label: 'settings.theme_system', icon: desktopOutline },
]

async function handleLogout() {
  const alert = await alertController.create({
    header: t('settings.logout'),
    message: t('settings.logout_confirm'),
    buttons: [
      { text: t('common.cancel'), role: 'cancel' },
      {
        text: t('common.yes'),
        handler: async () => {
          await logout()
        },
      },
    ],
  })
  await alert.present()
}
</script>
