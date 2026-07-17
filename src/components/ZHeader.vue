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
} from 'ionicons/icons'

import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { menuController } from '@ionic/vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const popoverRef = ref()

const props = defineProps({
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

const showBack = computed(() => {
  return props.showBackButton && !route.path.startsWith('/tabs/')
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
    <ion-toolbar>
      <div class="flex items-center justify-between w-full px-2 py-1">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">

          <!-- Back Button -->
          <ion-button
              v-if="showBack"
              fill="clear"
              @click="goBack"
              class="m-0 h-10 w-10 flex-shrink-0"
              style="--padding-start: 0; --padding-end: 0; --color: currentColor; --border-radius: 50%;"
          >
            <ion-icon slot="icon-only" :icon="arrowBackOutline" class="text-2xl text-zinc-700 dark:text-zinc-300" />
          </ion-button>

          <!-- Title -->
          <div class="font-bold text-lg ms-5 text-zinc-900 dark:text-zinc-50 truncate">
            {{ title }}
          </div>
        </div>

        <!-- Right Buttons -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <slot name="end" />

          <!-- Notification Button -->
          <ion-button
              v-if="showNotification"
              fill="clear"
              class="relative m-0 h-10 w-10"
              style="--padding-start: 0; --padding-end: 0; --color: currentColor; --border-radius: 50%;"
          >
            <ion-icon slot="icon-only" :icon="notificationsOutline" class="text-2xl text-zinc-700 dark:text-zinc-300" />
            <span
                v-if="notificationCount > 0"
                class="absolute top-0 right-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold shadow-lg shadow-red-500/30"
            >
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </ion-button>
        </div>
      </div>
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