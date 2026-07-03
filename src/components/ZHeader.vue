```vue
<script setup>
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/vue'

import {
  notificationsOutline,
  arrowBackOutline,
} from 'ionicons/icons'

import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  title: {
    type: String,
    required: true,
  },
  showNotification: {
    type: Boolean,
    default: false,
  },
  notificationCount: {
    type: Number,
    default: 0,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar
        class="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800"
    >
      <ion-buttons
          slot="start"
          v-if="showBackButton"
      >
        <ion-button
            fill="clear"
            @click="goBack"
            class="text-zinc-700 dark:text-zinc-300"
        >
          <ion-icon
              :icon="arrowBackOutline"
              class="text-xl"
          />
        </ion-button>
      </ion-buttons>

      <ion-title
          class="ms-3 text-left font-bold text-zinc-900 dark:text-zinc-50"
      >
        {{ title }}
      </ion-title>

      <ion-buttons slot="end">
        <slot name="end" />

        <ion-button
            v-if="showNotification"
            fill="clear"
            class="relative text-zinc-700 dark:text-zinc-300"
        >
          <ion-icon
              :icon="notificationsOutline"
              class="text-xl"
          />

          <span
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

