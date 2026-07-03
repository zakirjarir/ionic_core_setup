<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <!-- Sidebar Menu -->
      <ion-menu content-id="main-content" type="overlay">
        <ion-header class="ion-no-border">
          <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 pt-8 pb-6 text-white">
            <div class="flex flex-col items-center">
              <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border-2 border-white/30">
                <ion-icon :icon="personOutline" class="text-4xl text-white" />
              </div>
              <p class="text-xl font-bold tracking-wide">{{ authStore.user?.name || 'Guest' }}</p>
              <p class="text-sm text-white/80 mt-1">{{ authStore.user?.email || '' }}</p>
            </div>
          </div>
        </ion-header>

        <ion-content class="bg-zinc-50 dark:bg-zinc-950">
          <ion-list lines="none" class="bg-transparent py-4 px-2 flex flex-col gap-1">
            <ion-item
              button
              :detail="false"
              @click="navigate('/settings')"
              class="rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              style="--background: transparent; --background-hover: transparent; --ripple-color: transparent;"
            >
              <ion-icon slot="start" :icon="settingsOutline" class="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
              <ion-label class="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{{ $t('nav.settings') }}</ion-label>
            </ion-item>

            <ion-item
              button
              :detail="false"
              @click="navigate('/language')"
              class="rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              style="--background: transparent; --background-hover: transparent; --ripple-color: transparent;"
            >
              <ion-icon slot="start" :icon="languageOutline" class="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
              <ion-label class="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{{ $t('nav.language') }}</ion-label>
              <span slot="end" class="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-xl text-[10px] font-bold">{{ currentLocaleInfo.nativeName }}</span>
            </ion-item>

            <ion-item
              button
              :detail="false"
              @click="navigate('/support')"
              class="rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              style="--background: transparent; --background-hover: transparent; --ripple-color: transparent;"
            >
              <ion-icon slot="start" :icon="helpCircleOutline" class="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
              <ion-label class="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{{ $t('nav.support') }}</ion-label>
            </ion-item>

            <ion-item
              button
              :detail="false"
              @click="navigate('/about')"
              class="rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              style="--background: transparent; --background-hover: transparent; --ripple-color: transparent;"
            >
              <ion-icon slot="start" :icon="informationCircleOutline" class="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
              <ion-label class="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{{ $t('nav.about') }}</ion-label>
            </ion-item>

            <ion-item
              button
              :detail="false"
              @click="navigate('/privacy-policy')"
              class="rounded-2xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              style="--background: transparent; --background-hover: transparent; --ripple-color: transparent;"
            >
              <ion-icon slot="start" :icon="shieldCheckmarkOutline" class="text-indigo-600 dark:text-indigo-400 mr-2 text-xl" />
              <ion-label class="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{{ $t('nav.privacy_policy') }}</ion-label>
            </ion-item>
          </ion-list>

          <div class="px-4 mt-6">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30 font-bold text-sm cursor-pointer active:scale-[0.98] transition-transform"
            >
              <ion-icon :icon="logOutOutline" class="text-lg" />
              <span>{{ $t('nav.logout') }}</span>
            </button>
          </div>
        </ion-content>
      </ion-menu>

      <!-- Main Content with Tabs -->
      <ion-page id="main-content">
        <ion-tabs>
          <ion-router-outlet />

          <ion-tab-bar slot="bottom" class="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 shadow-md h-16">
            <ion-tab-button
              tab="dashboard"
              href="/tabs/dashboard"
              class="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              style="--color-selected: #4f46e5; --background: transparent;"
            >
              <ion-icon :icon="gridOutline" class="text-xl" />
              <ion-label class="text-[10px] mt-1 font-bold">{{ $t('nav.dashboard') }}</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="children"
              href="/tabs/children"
              class="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              style="--color-selected: #4f46e5; --background: transparent;"
            >
              <ion-icon :icon="peopleOutline" class="text-xl" />
              <ion-label class="text-[10px] mt-1 font-bold">{{ $t('nav.children') }}</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="vaccination"
              href="/tabs/vaccination"
              class="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              style="--color-selected: #4f46e5; --background: transparent;"
            >
              <ion-icon :icon="medkitOutline" class="text-xl" />
              <ion-label class="text-[10px] mt-1 font-bold">{{ $t('nav.vaccination') }}</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="notifications"
              href="/tabs/notifications"
              class="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              style="--color-selected: #4f46e5; --background: transparent;"
            >
              <ion-icon :icon="notificationsOutline" class="text-xl" />
              <ion-label class="text-[10px] mt-1 font-bold">{{ $t('nav.notifications') }}</ion-label>
            </ion-tab-button>

            <ion-tab-button class="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400" style="--color-selected: #4f46e5; --background: transparent;" @click="menuController.open()">
              <ion-icon :icon="menuOutline" class="text-xl" />
              <ion-label class="text-[10px] mt-1 font-bold">
                {{ $t('nav.menu') }}
              </ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-page>
    </ion-split-pane>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  menuController,
} from '@ionic/vue'

import {
  gridOutline,
  peopleOutline,
  medkitOutline,
  notificationsOutline,
  menuOutline,
  settingsOutline,
  languageOutline,
  helpCircleOutline,
  informationCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  personOutline,
} from 'ionicons/icons'

import { useAuthStore } from '@/stores/auth'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { currentLocaleInfo } = useLanguage()

async function navigate(path) {
  await menuController.close()
  router.push(path)
}

async function handleLogout() {
  await menuController.close()
  await authStore.logout()
  router.replace({ name: 'Login' })
}
</script>