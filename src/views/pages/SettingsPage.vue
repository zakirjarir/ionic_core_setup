<template>
  <ion-page>
    <z-header :title="$t('settings.title')"/>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
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

            <!-- Toggles -->
            <div class="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center gap-3">
                <ion-icon :icon="notificationsOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.push_notifications') }}</span>
              </div>
              <ion-toggle v-model="pushEnabled" color="primary" />
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center gap-3">
                <ion-icon :icon="mailOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.email_notifications') }}</span>
              </div>
              <ion-toggle v-model="emailEnabled" color="primary" />
            </div>
          </div>
        </div>

        <!-- ── LANGUAGE ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.language_section') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div @click="$router.push('/language')" class="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="languageOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.language') }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{{ currentLocaleInfo.nativeName }}</span>
                <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- ── ACCOUNT ── -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('settings.account') }}</p>
          <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3.5">
            <div @click="$router.push('/tabs/profile')" class="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="personOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.edit_profile') }}</span>
              </div>
              <ion-icon :icon="chevronForwardOutline" class="text-base text-zinc-400 dark:text-zinc-500" />
            </div>

            <div class="flex items-center justify-between pt-3.5 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer active:opacity-70 transition-opacity">
              <div class="flex items-center gap-3">
                <ion-icon :icon="lockClosedOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ $t('settings.change_password') }}</span>
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
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30 font-bold text-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <ion-icon :icon="logOutOutline" class="text-lg" />
          <span>{{ $t('settings.logout') }}</span>
        </button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
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
import { useAuthStore } from '@/stores/auth'
import ZHeader from "@/components/ZHeader.vue";

const { t } = useI18n()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const router = useRouter()
const { currentLocaleInfo } = useLanguage()

const pushEnabled = ref(true)
const emailEnabled = ref(false)

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
          await authStore.logout()
          router.replace({ name: 'Login' })
        },
      },
    ],
  })
  await alert.present()
}
</script>
