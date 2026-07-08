<script setup>
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue'

import {
  notificationsOutline,
  arrowBackOutline,
  logOutOutline,
  settingsOutline,
  personOutline,
  closeOutline,
  chevronForwardOutline,
} from 'ionicons/icons'

import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const popoverRef = ref()

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
  showProfile: {
    type: Boolean,
    default: true,
  },
})

const goBack = () => {
  router.back()
}

const openPopover = (e) => {
  popoverRef.value.$el.present(e)
}


</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar
        class="bg-white/80 dark:bg-zinc-950/80 "

    >
      <!-- Back Button -->
      <ion-buttons slot="start" v-if="showBackButton">
        <ion-button
            fill="clear"
            @click="goBack"
            class="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-10 h-10"
        >
          <ion-icon :icon="arrowBackOutline" class="text-2xl" />
        </ion-button>
      </ion-buttons>

      <!-- Title -->
      <ion-title class="ms-2 text-left font-bold text-lg text-zinc-900 dark:text-zinc-50">
        {{ title }}
      </ion-title>

      <!-- Right Buttons -->
      <ion-buttons slot="end" class="gap-1">
        <slot name="end" />

        <!-- Notification Button -->
        <ion-button
            v-if="showNotification"
            fill="clear"
            class="relative text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full w-10 h-10"
        >
          <ion-icon :icon="notificationsOutline" class="text-2xl" />
          <span
              v-if="notificationCount > 0"
              class="absolute top-0 right-0 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold shadow-lg shadow-red-500/30"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span>
        </ion-button>

        <!-- Profile Avatar -->
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

</template>

<style scoped>


/* Ion Item Customization */
ion-item {
  --background: transparent;
  --background-hover: transparent;
  --border-color: transparent;
  --min-height: 44px;
  --padding-start: 8px;
  --padding-end: 8px;
  --inner-padding-end: 0px;
}

ion-item::part(native) {
  padding: 4px 8px;
  border-radius: 12px;
}

ion-item::part(native):hover {
  background: transparent;
}

/* Avatar hover animation */
ion-avatar {
  transition: all 0.3s ease;
}

.group:hover ion-avatar {
  transform: scale(1.05);
}

/* Notification badge animation */
@keyframes pulse-ring {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.absolute.top-0.right-0 {
  animation: pulse-ring 2s ease-in-out infinite;
}

</style>