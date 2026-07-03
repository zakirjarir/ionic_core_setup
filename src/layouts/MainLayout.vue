<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <!-- Sidebar Menu - One UI Style -->
      <ion-menu content-id="main-content" type="overlay" class="oneui-menu">
        <ion-header class="ion-no-border">
          <div class="px-6 pt-10 pb-6 bg-white dark:bg-zinc-900">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span class="text-2xl font-bold text-white">{{ getUserInitials() }}</span>
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">{{ authStore.user?.name || 'Guest' }}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
              </div>
            </div>
          </div>
        </ion-header>

        <ion-content class="bg-zinc-50 dark:bg-zinc-950">
          <div class="p-4">
            <!-- Quick Actions -->
            <div class="grid grid-cols-4 gap-2 mb-6">
              <button
                  v-for="action in quickActions"
                  :key="action.label"
                  @click="navigate(action.path)"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all hover:shadow-md"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="action.bg">
                  <ion-icon :icon="action.icon" class="text-xl" :class="action.color" />
                </div>
                <span class="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{{ $t(action.label) }}</span>
              </button>
            </div>

            <!-- Menu Items -->
            <div class="space-y-1">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider px-3 mb-2">Menu</p>

              <button
                  v-for="item in menuItems"
                  :key="item.path"
                  @click="navigate(item.path)"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-[0.98] transition-all hover:shadow-md group"
              >
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="item.bg">
                  <ion-icon :icon="item.icon" class="text-lg" :class="item.color" />
                </div>
                <span class="flex-1 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ $t(item.label) }}</span>
                <span v-if="item.badge" class="px-2 py-0.5 text-[10px] font-bold rounded-full" :class="item.badgeClass">
                  {{ item.badge }}
                </span>
                <ion-icon :icon="chevronForwardOutline" class="text-sm text-zinc-300 dark:text-zinc-600" />
              </button>
            </div>

            <!-- Settings Section -->
            <div class="space-y-1 mt-4">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider px-3 mb-2">Settings</p>

              <button
                  v-for="item in settingsItems"
                  :key="item.path"
                  @click="navigate(item.path)"
                  class="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-[0.98] transition-all hover:shadow-md"
              >
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="item.bg">
                  <ion-icon :icon="item.icon" class="text-lg" :class="item.color" />
                </div>
                <span class="flex-1 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ $t(item.label) }}</span>
                <span v-if="item.value" class="text-xs text-zinc-400 dark:text-zinc-500">{{ item.value }}</span>
                <ion-icon :icon="chevronForwardOutline" class="text-sm text-zinc-300 dark:text-zinc-600" />
              </button>
            </div>

            <!-- Logout -->
            <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/30 mt-6 active:scale-[0.98] transition-all hover:shadow-md"
            >
              <div class="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
                <ion-icon :icon="logOutOutline" class="text-lg text-rose-600 dark:text-rose-400" />
              </div>
              <span class="flex-1 text-left text-sm font-bold text-rose-600 dark:text-rose-400">{{ $t('nav.logout') }}</span>
              <ion-icon :icon="chevronForwardOutline" class="text-sm text-rose-300 dark:text-rose-600" />
            </button>

            <!-- Version -->
            <p class="text-center text-[10px] text-zinc-400 dark:text-zinc-600 mt-6">One UI 8.5 • Version 2.4.1</p>
          </div>
        </ion-content>
      </ion-menu>

      <!-- Main Content -->
      <ion-page id="main-content">
        <ion-tabs>
          <ion-router-outlet />

          <!-- One UI Style Tab Bar -->
          <ion-tab-bar slot="bottom" class="oneui-tabbar bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 h-[72px] shadow-lg shadow-black/5">
            <ion-tab-button
                v-for="tab in tabs"
                :key="tab.tab"
                :tab="tab.tab"
                :href="tab.href"
                class="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1"
                style="--color: #9ca3af; --color-selected: #2563eb; --background: transparent; --background-focused: transparent;"
            >
              <div class="relative">
                <ion-icon :icon="tab.icon" class="text-2xl transition-all duration-200" />
                <span v-if="tab.badge" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-md">
                  {{ tab.badge }}
                </span>
              </div>
              <ion-label class="text-[9px] font-medium mt-0.5">{{ $t(tab.label) }}</ion-label>

            </ion-tab-button>

            <!-- Menu Button -->
            <ion-tab-button
                @click="menuController.open()"
                class="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1"
                style="--color: #9ca3af; --color-selected: #2563eb; --background: transparent; --background-focused: transparent;"
            >
              <div class="relative">
                <ion-icon :icon="gridOutline" class="text-2xl transition-all duration-200" />
              </div>
              <ion-label class="text-[9px] font-medium mt-0.5">{{ $t('nav.menu') }}</ion-label>
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
  IonIcon,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonLabel,
  menuController,
} from '@ionic/vue'

import {
  gridOutline,
  peopleOutline,
  medkitOutline,
  menuOutline,
  settingsOutline,
  languageOutline,
  helpCircleOutline,
  informationCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  personOutline,
  calendarOutline,
  notificationsOutline,
  homeOutline,
  chevronForwardOutline,
  timeOutline,
  cloudOutline,
  heartOutline,
} from 'ionicons/icons'

import { useAuthStore } from '@/stores/auth'
import { useLanguage } from '@/composables/useLanguage'
import { useRouter, useRoute } from 'vue-router'
import { useFunction } from "@/composables/index.js"
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { currentLocaleInfo } = useLanguage()
const { logout } = useFunction()

const currentTab = ref('dashboard')

// Quick Actions
const quickActions = [
  {
    path: '/tabs/children',
    label: 'nav.children',
    icon: peopleOutline,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    path: '/tabs/vaccination',
    label: 'nav.vaccination',
    icon: medkitOutline,
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    path: '/tabs/calendar',
    label: 'nav.calendar',
    icon: calendarOutline,
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    path: '/notifications',
    label: 'nav.notifications',
    icon: notificationsOutline,
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    color: 'text-rose-600 dark:text-rose-400'
  },
]

// Menu Items
const menuItems = [
  {
    path: '/dashboard',
    label: 'nav.dashboard',
    icon: homeOutline,
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    color: 'text-indigo-600 dark:text-indigo-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/tabs/children',
    label: 'nav.children',
    icon: peopleOutline,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    color: 'text-blue-600 dark:text-blue-400',
    badge: '3',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
  },
  {
    path: '/tabs/vaccination',
    label: 'nav.vaccination',
    icon: medkitOutline,
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    color: 'text-emerald-600 dark:text-emerald-400',
    badge: '2',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
  },
  {
    path: '/tabs/calendar',
    label: 'nav.calendar',
    icon: calendarOutline,
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    color: 'text-purple-600 dark:text-purple-400',
    badge: null,
    badgeClass: ''
  },
]

// Settings Items
const settingsItems = [
  {
    path: '/settings',
    label: 'nav.settings',
    icon: settingsOutline,
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    color: 'text-zinc-600 dark:text-zinc-400',
    value: null
  },
  {
    path: '/language',
    label: 'nav.language',
    icon: languageOutline,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    color: 'text-amber-600 dark:text-amber-400',
    value: currentLocaleInfo.nativeName
  },
  {
    path: '/support',
    label: 'nav.support',
    icon: helpCircleOutline,
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    color: 'text-cyan-600 dark:text-cyan-400',
    value: null
  },
  {
    path: '/about',
    label: 'nav.about',
    icon: informationCircleOutline,
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    color: 'text-rose-600 dark:text-rose-400',
    value: null
  },
]

// Tabs
const tabs = [
  { tab: 'dashboard', href: '/tabs/dashboard', icon: gridOutline, label: 'nav.dashboard', badge: null },
  { tab: 'children', href: '/tabs/children', icon: peopleOutline, label: 'nav.children', badge: '3' },
  { tab: 'vaccination', href: '/tabs/vaccination', icon: medkitOutline, label: 'nav.vaccination', badge: '2' },
]

const isActiveTab = (tab) => {
  return route.path.includes(tab)
}

const getUserInitials = () => {
  const name = authStore.user?.name || 'Guest'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

async function navigate(path) {
  await menuController.close()
  router.push(path)
}

async function handleLogout() {
  await menuController.close()
  await logout()
}
</script>

<style scoped>
/* One UI Menu Styles */
.oneui-menu {
  --width: 320px;
  --background: transparent;
}

/* One UI Tab Bar */
.oneui-tabbar {
  padding: 4px 0 6px;
}

/* Tab Button Active State */
ion-tab-button {
  --ripple-color: transparent;
  position: relative;
}

ion-tab-button[aria-selected="true"] ion-icon {
  transform: translateY(-2px);
}

ion-tab-button[aria-selected="true"] ion-label {
  color: #2563eb;
  font-weight: 600;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .oneui-tabbar {
    background: rgba(24, 24, 27, 0.95) !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .oneui-menu {
    --width: 280px;
  }
}

/* Smooth Animations */
button:active {
  transform: scale(0.98);
}

/* Custom Scrollbar */
ion-content {
  --scroll-background: transparent;
}

/* One UI Style Cards */
.rounded-2xl {
  border-radius: 16px;
}

/* Glass Effect */
.bg-white {
  backdrop-filter: blur(0);
}

/* Samsung One UI 8.5 Inspired Colors */
:root {
  --oneui-blue: #2563eb;
  --oneui-dark: #111827;
  --oneui-surface: #f8fafc;
}

/* Dark Mode Adjustments */
.dark .bg-white {
  background-color: #18181b;
}

.dark .border-zinc-100 {
  border-color: #27272a;
}
</style>