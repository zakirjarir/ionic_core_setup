<template>
  <ion-page>
    <z-header :title="$t('notifications.title')">
      <template #end>
        <ion-button fill="clear" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400" @click="markAllRead">
          {{ $t('notifications.mark_all_read') }}
        </ion-button>
      </template>
    </z-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- Segment -->
      <div class="px-4 pt-3 pb-1">
        <ion-segment v-model="activeSegment" class="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-0.5">
          <ion-segment-button value="all" class="min-h-[38px] text-xs font-semibold">
            <ion-label>{{ $t('notifications.all') }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="unread" class="min-h-[38px] text-xs font-semibold">
            <ion-label>{{ $t('notifications.unread') }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <div class="p-4 flex flex-col gap-3">
        <template v-if="displayedNotifications.length > 0">
          <div
            v-for="notif in displayedNotifications"
            :key="notif.id"
            class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm relative cursor-pointer active:scale-[0.98] transition-transform"
            :class="{ 'border-l-4 border-l-indigo-600 dark:border-l-indigo-400': !notif.read }"
            @click="viewNotification(notif)"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              :class="notif.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' : notif.type === 'danger' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'"
            >
              <ion-icon :icon="notif.type === 'warning' ? alertCircleOutline : informationCircleOutline" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ notif.title }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ notif.message }}</p>
              <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">{{ notif.time }}</p>
            </div>
            <div v-if="!notif.read" class="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0 self-start mt-1"></div>
          </div>
        </template>

        <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
          <ion-icon :icon="notificationsOffOutline" class="text-5xl text-zinc-300 dark:text-zinc-700" />
          <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('notifications.no_notifications') }}</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ $t('notifications.no_notifications_sub') }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonMenuButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  IonRefresher, IonRefresherContent
} from '@ionic/vue'
import { alertCircleOutline, informationCircleOutline, notificationsOffOutline } from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";
import { useCP, useFunction, useStore } from "@/composables/index.js"

const router = useRouter()
const { getData, submitData } = useFunction()
const CP = useCP()
const store = useStore()
const activeSegment = ref('all')
const notifications = ref([])

const fetchNotifications = async () => {
  // 1. Load from local cache first for instant offline view
  const cached = await CP.get('cached_notifications', [])
  if (cached && cached.length > 0) {
    notifications.value = cached
    store.unreadNotificationsCount = cached.filter(n => !n.read).length
  }

  // 2. Fetch fresh data from the server
  try {
    const result = await getData({ url: 'notifications', rtn: true })
    if (result) {
      notifications.value = result
      store.unreadNotificationsCount = result.filter(n => !n.read).length
      // Save updated data to cache
      await CP.set('cached_notifications', result)
    }
  } catch (err) {
    console.error('Failed to fetch notifications from server:', err)
  }
}

onMounted(() => {
  fetchNotifications()
})

const handleRefresh = async (event) => {
  await fetchNotifications()
  event.target.complete()
}

const displayedNotifications = computed(() =>
  activeSegment.value === 'unread'
    ? notifications.value.filter(n => !n.read)
    : notifications.value
)

async function viewNotification(notif) {
  if (!notif.read) {
    notif.read = true
    store.unreadNotificationsCount = notifications.value.filter(n => !n.read).length
    // Save to cache immediately
    await CP.set('cached_notifications', notifications.value)
    
    // Mark as read in the backend database (run asynchronously)
    submitData({
      url: `notifications/${notif.id}/mark-read`,
      data: {},
      method: 'post'
    })
  }
  router.push(`/notification-detail/${notif.id}`)
}

async function markAllRead() {
  const success = await submitData({
    url: 'notifications/mark-read',
    data: {},
    method: 'post'
  })
  if (success) {
    notifications.value.forEach(n => n.read = true)
    store.unreadNotificationsCount = 0
    // Update local cache
    await CP.set('cached_notifications', notifications.value)
  }
}
</script>
