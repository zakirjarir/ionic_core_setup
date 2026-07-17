<template>
  <ion-page>
    <z-header :title="$t('notifications.details') || 'Notification Details'"></z-header>

    <ion-content>
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl animate-pulse"></div>
          <ion-spinner name="crescent" color="primary" class="w-12 h-12"></ion-spinner>
        </div>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">{{ $t('common.loading') || 'Loading...' }}</p>
      </div>

      <div v-else-if="notification" class="max-w-md mx-auto px-4 py-4 space-y-4">
        <!-- Main Card -->
        <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 space-y-5">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              :class="notification.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' : notification.type === 'danger' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'"
            >
              <ion-icon :icon="notification.type === 'warning' ? alertCircleOutline : informationCircleOutline" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-base font-black text-zinc-900 dark:text-white leading-tight">
                {{ notification.title }}
              </h2>
              <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-semibold">
                {{ notification.time }}
              </p>
            </div>
          </div>

          <div class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
            {{ notification.message }}
          </div>
        </div>

        <!-- Additional Actions Card if it's a vaccine reminder -->
        <div v-if="notification.payload && notification.payload.child_id" class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-md space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="sparklesOutline" class="text-indigo-600 dark:text-indigo-400 text-lg" />
            <h3 class="text-xs font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-wide">
              {{ $t('notifications.quick_actions') || 'Quick Actions' }}
            </h3>
          </div>

          <div class="flex flex-col gap-2">
            <ion-button
              expand="block"
              class="[--border-radius:12px] text-sm font-semibold"
              @click="router.push(`/children-detail/${notification.payload.child_id}`)"
            >
              <ion-icon :icon="peopleOutline" slot="start" />
              {{ $t('notifications.view_child_profile') || 'View Child Profile' }}
            </ion-button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
        <ion-icon :icon="notificationsOffOutline" class="text-5xl text-zinc-300 dark:text-zinc-700" />
        <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('notifications.not_found') || 'Notification Not Found' }}</h3>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage, IonContent, IonSpinner, IonIcon, IonButton
} from '@ionic/vue'
import {
  alertCircleOutline, informationCircleOutline, notificationsOffOutline,
  sparklesOutline, peopleOutline
} from 'ionicons/icons'
import { useFunction } from '@/composables/useFunction'
import { useCP } from '@/composables/useCP'
import ZHeader from "@/components/ZHeader.vue"

const route = useRoute()
const router = useRouter()
const { getData } = useFunction()
const CP = useCP()

const notification = ref(null)
const loading = ref(true)

const loadNotificationDetail = async () => {
  try {
    loading.value = true

    // 1. Try to load from cached notifications first
    const cached = await CP.get('cached_notifications', [])
    const found = cached.find(n => n.id === route.params.id)
    if (found) {
      notification.value = found
      loading.value = false
    }

    // 2. Fetch fresh details from network
    const result = await getData({
      url: 'notifications',
      uid: route.params.id,
      rtn: true
    })
    if (result) {
      notification.value = result
    }
  } catch (err) {
    console.error('Failed to load notification detail from server:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNotificationDetail()
})
</script>
