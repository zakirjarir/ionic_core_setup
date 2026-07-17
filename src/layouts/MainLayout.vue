<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <!-- Sidebar Menu -->
      <ion-menu content-id="main-content" type="overlay" class="oneui-menu">
        <div class="sidebar-header-bg px-5 pt-12 pb-5">
          <div
            class="flex items-center gap-4 cursor-pointer active:opacity-80 transition-opacity"
            @click="navigate('/profile')"
          >
            <div class="relative flex-shrink-0">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30">
                <div class="sidebar-avatar-inner w-full h-full rounded-[14px] overflow-hidden flex items-center justify-center">
                  <img v-if="user.photo" :src="LFA(user?.photo)" class="w-full h-full object-cover" />
                  <span v-else class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-500">{{ getUserInitials() }}</span>
                </div>
              </div>
              <div class="sidebar-avatar-dot absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 shadow-sm"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="sidebar-name-text text-base font-black truncate">{{ user?.name || 'Guest User' }}</p>
              <p class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                {{ user?.phone || user?.email || 'Health Worker' }}
              </p>
              <span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Online
              </span>
            </div>
            <ion-icon :icon="chevronForwardOutline" class="text-sm text-zinc-300 dark:text-zinc-600 flex-shrink-0" />
          </div>
        </div>

        <ion-content>
          <div class="px-4 py-4 space-y-5">

            <!-- Quick Actions Grid -->
            <div>
              <p class="sidebar-section-label">{{ $t('nav.quick_access') || 'Quick Access' }}</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                    v-for="action in quickActions"
                    :key="action.label"
                    @click="navigate(action.path)"
                    class="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl cursor-pointer active:scale-95 transition-transform"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center">
                    <ion-icon :icon="action.icon" class="text-2xl" :class="action.color" />
                  </div>
                  <span class="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 text-center leading-tight truncate w-full px-0.5">{{ $t(action.label) }}</span>
                </button>
              </div>
            </div>

            <!-- Main Navigation -->
            <div>
              <p class="sidebar-section-label">{{ $t('nav.main_menu') || 'Navigation' }}</p>
              <div class="space-y-1.5">
                <button
                    v-for="item in allMenuItems"
                    :key="item.path"
                    @click="navigate(item.path)"
                    class="sidebar-nav-item"
                >
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ion-icon :icon="item.icon" class="text-[20px]" :class="item.color" />
                  </div>
                  <span class="flex-1 text-left text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">{{ $t(item.label) }}</span>
                  <span v-if="item.badge" class="px-2 py-0.5 text-[9px] font-extrabold rounded-full flex-shrink-0" :class="item.badgeClass">{{ item.badge }}</span>
                  <ion-icon :icon="chevronForwardOutline" class="text-[11px] text-zinc-300 dark:text-zinc-600 flex-shrink-0" />
                </button>
              </div>
            </div>

            <!-- Logout -->
            <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div class="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0">
                <ion-icon :icon="logOutOutline" class="text-[17px] text-rose-600 dark:text-rose-400" />
              </div>
              <span class="flex-1 text-left text-[13px] font-semibold text-rose-600 dark:text-rose-400">{{ $t('nav.logout') }}</span>
              <ion-icon :icon="chevronForwardOutline" class="text-[11px] text-rose-300 dark:text-rose-700" />
            </button>

            <!-- Version -->
            <p class="text-center text-[10px] text-zinc-300 dark:text-zinc-600 pt-1">BIVEEC • v2.4.1</p>
          </div>
        </ion-content>
      </ion-menu>

      <!-- Main Content -->
      <ion-page id="main-content">
        <ion-tabs>
          <ion-router-outlet />

          <!-- Tab Bar -->
          <ion-tab-bar slot="bottom" class="modern-tabbar">
            <ion-tab-button
                v-for="tab in tabs"
                :key="tab.tab"
                :tab="tab.tab"
                :href="tab.href"
                class="tab-btn"
            >
              <div class="tab-content">
                <div class="tab-icon-wrapper">
                  <ion-icon :icon="tab.icon" class="tab-icon" />
                  <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
                </div>
                <ion-label class="tab-label">{{ $t(tab.label) }}</ion-label>
              </div>
              <div class="tab-indicator"></div>
            </ion-tab-button>

            <!-- Menu Button -->
            <ion-tab-button tab="menu" class="tab-btn" @click.prevent="menuController.open()">
              <div class="tab-content">
                <div class="tab-icon-wrapper">
                  <ion-icon :icon="menuOutline" class="tab-icon" />
                </div>
                <ion-label class="tab-label">{{ $t('nav.menu') }}</ion-label>
              </div>
              <div class="tab-indicator"></div>
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
  onIonViewWillEnter,
} from '@ionic/vue'

import {
  gridOutline,
  peopleOutline,
  medkitOutline,
  menuOutline,
  settingsOutline,
  helpCircleOutline,
  informationCircleOutline,
  personCircleOutline,
  logOutOutline,
  calendarOutline,
  notificationsOutline,
  homeOutline,
  chevronForwardOutline,
  sparklesOutline,
  alertCircleOutline,
} from 'ionicons/icons'

import { useRouter } from 'vue-router'
import { useCP, useFunction, useStore } from "@/composables/index.js"
import { usePushNotifications } from '@/composables/usePushNotifications'
import { ref, computed } from 'vue'

const CP = useCP()
const store = useStore()
const router = useRouter()
const { logout, LFA, getData } = useFunction()
const { registerPush, syncTokenWithBackend } = usePushNotifications()

const user = ref({})

onIonViewWillEnter(async () => {
  user.value = await CP.get('user')
  
  if (user.value && (user.value.push_enabled ?? true)) {
    await registerPush()
    await syncTokenWithBackend()
  }

  // Load unread notifications count from cache immediately
  const cachedNotifs = await CP.get('cached_notifications', [])
  store.unreadNotificationsCount = cachedNotifs.filter(n => !n.read).length

  // Sync notifications in background
  try {
    const result = await getData({ url: 'notifications', rtn: true })
    if (result) {
      store.unreadNotificationsCount = result.filter(n => !n.read).length
      await CP.set('cached_notifications', result)
    }
  } catch (err) {
    console.error('Failed to sync notifications in MainLayout:', err)
  }
})

// Quick Actions (top icon grid)
const quickActions = [
  {
    path: '/tabs/dashboard',
    label: 'nav.dashboard',
    icon: homeOutline,
    bg: 'bg-indigo-100 dark:bg-indigo-950/40',
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    path: '/tabs/children',
    label: 'nav.children',
    icon: peopleOutline,
    bg: 'bg-blue-100 dark:bg-blue-950/40',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    path: '/tabs/vaccination',
    label: 'nav.vaccination',
    icon: medkitOutline,
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    path: '/tabs/notifications',
    label: 'nav.notifications',
    icon: notificationsOutline,
    bg: 'bg-rose-100 dark:bg-rose-950/40',
    color: 'text-rose-600 dark:text-rose-400'
  },
]

// All navigation in a single merged list (no duplicates)
const allMenuItems = computed(() => [
  {
    path: '/profile',
    label: 'nav.profile',
    icon: personCircleOutline,
    bg: 'bg-violet-100 dark:bg-violet-950/40',
    color: 'text-violet-600 dark:text-violet-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/tabs/children',
    label: 'nav.children',
    icon: peopleOutline,
    bg: 'bg-blue-100 dark:bg-blue-950/40',
    color: 'text-blue-600 dark:text-blue-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/tabs/vaccination',
    label: 'nav.vaccination',
    icon: medkitOutline,
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    color: 'text-emerald-600 dark:text-emerald-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/tabs/notifications',
    label: 'nav.notifications',
    icon: notificationsOutline,
    bg: 'bg-rose-100 dark:bg-rose-950/40',
    color: 'text-rose-600 dark:text-rose-400',
    badge: store.unreadNotificationsCount > 0 ? store.unreadNotificationsCount.toString() : null,
    badgeClass: 'bg-rose-500 text-white font-extrabold shadow-sm'
  },
  {
    path: '/aefi-report',
    label: 'nav.aefi',
    icon: alertCircleOutline,
    bg: 'bg-red-100 dark:bg-red-950/40',
    color: 'text-red-600 dark:text-red-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/settings',
    label: 'nav.settings',
    icon: settingsOutline,
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    color: 'text-zinc-600 dark:text-zinc-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/support',
    label: 'nav.support',
    icon: helpCircleOutline,
    bg: 'bg-cyan-100 dark:bg-cyan-950/40',
    color: 'text-cyan-600 dark:text-cyan-400',
    badge: null,
    badgeClass: ''
  },
  {
    path: '/about',
    label: 'nav.about',
    icon: informationCircleOutline,
    bg: 'bg-orange-100 dark:bg-orange-950/40',
    color: 'text-orange-600 dark:text-orange-400',
    badge: null,
    badgeClass: ''
  },
])

// Tabs
const tabs = computed(() => [
  { tab: 'dashboard', href: '/tabs/dashboard', icon: gridOutline, label: 'nav.dashboard', badge: null },
  { tab: 'children', href: '/tabs/children', icon: peopleOutline, label: 'nav.children', badge: null },
  { tab: 'vaccination', href: '/tabs/vaccination', icon: medkitOutline, label: 'nav.vaccination', badge: null },
  { tab: 'notifications', href: '/tabs/notifications', icon: notificationsOutline, label: 'nav.notifications', badge: store.unreadNotificationsCount > 0 ? store.unreadNotificationsCount.toString() : null }
])

const getUserInitials = () => {
  const name = user?.value?.name || 'Guest'
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
.oneui-menu {
  --width: 300px;
  --background: #F8FAFC;
}

:global(.dark) .oneui-menu {
  --background: #18181b;
}

.sidebar-header-bg {
  background: transparent;
  border-bottom: 1px solid var(--ion-border-color, rgba(0,0,0,0.06));
  padding-bottom: 20px;
}

.sidebar-avatar-inner {
  background: var(--ion-item-background);
}

.sidebar-avatar-dot {
  border-color: var(--ion-item-background);
}

.sidebar-name-text {
  color: var(--ion-text-color);
}

.sidebar-section-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a1a1aa;
  padding: 0 4px;
  margin-bottom: 5px;
}

:global(.dark) .sidebar-section-label {
  color: #52525b;
}


.sidebar-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 5px;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s ease;
}

.sidebar-nav-item:active {
  transform: scale(0.98);
  opacity: 0.85;
}

/* Modern Tab Bar */
.modern-tabbar {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;

  height: 88px;
  border-radius: 28px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  border: 1px solid rgba(255, 255, 255, 0.3);

  box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04);

  padding: 4px 8px;
}

/* Dark Theme */
.dark .modern-tabbar {
  background: rgba(24, 24, 27, 0.75);
  border: 1px solid rgba(63, 63, 70, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Tab Button */
.tab-btn {
  --color: #9ca3af;
  --color-selected: #2563eb;
  --background: transparent;
  --background-focused: transparent;
  --ripple-color: transparent;

  flex: 1;
  height: 100%;
  position: relative;
  border-radius: 16px;
  padding: 0 4px;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 100%;
}

.tab-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  font-size: 30px;
  transition: all 0.3s ease;
}

.tab-btn[aria-selected="true"] .tab-icon {
  color: #2563eb;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.tab-btn[aria-selected="true"] .tab-label {
  color: #2563eb;
  font-weight: 600;
}

.dark .tab-label {
  color: #71717a;
}

.dark .tab-btn[aria-selected="true"] .tab-label {
  color: #60a5fa;
}

/* Badge */
.tab-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.dark .tab-badge {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
}

/* Tab Indicator */
.tab-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.tab-btn[aria-selected="true"] .tab-indicator {
  transform: translateX(-50%) scaleX(1);
}

.dark .tab-indicator {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

/* Responsive */
@media (max-width: 768px) {
  .oneui-menu {
    --width: 280px;
  }

  .modern-tabbar {
    left: 12px;
    right: 12px;
    bottom: 12px;
    height: 72px;
    border-radius: 22px;
    padding: 3px 6px;
  }

  .tab-icon {
    font-size: 24px;
  }

  .tab-label {
    font-size: 10px;
  }

  .tab-badge {
    min-width: 18px;
    height: 18px;
    font-size: 10px;
    top: -5px;
    right: -6px;
  }

  .tab-indicator {
    width: 16px;
    height: 2.5px;
  }
}

@media (max-width: 400px) {
  .modern-tabbar {
    left: 8px;
    right: 8px;
    bottom: 8px;
    height: 66px;
    border-radius: 18px;
    padding: 2px 4px;
  }

  .tab-icon {
    font-size: 22px;
  }

  .tab-label {
    font-size: 9px;
  }

  .tab-badge {
    min-width: 16px;
    height: 16px;
    font-size: 9px;
    top: -4px;
    right: -5px;
    padding: 0 4px;
  }

  .tab-indicator {
    width: 14px;
    height: 2px;
  }
}

/* Utility */
ion-content {
  --scroll-background: transparent;
}

.rounded-2xl {
  border-radius: 16px;
}

.dark .bg-white {
  background-color: #18181b;
}

.dark .border-zinc-100 {
  border-color: #27272a;
}
</style>