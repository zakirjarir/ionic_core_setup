<template>
  <ion-app>
    <ion-router-outlet class="env_margin_bottom" />
  </ion-app>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { usePushNotifications } from '@/composables/usePushNotifications';
import { useCP } from "@/composables";
import { useLanguage } from '@/composables/useLanguage';

const { addListeners, registerPush, syncTokenWithBackend } = usePushNotifications();
const CP = useCP();
const { loadSavedLanguage } = useLanguage();

// Initialize listeners and load saved language on startup
addListeners();
loadSavedLanguage();

watch(
    async () => await CP.get("user"),
    async (newVal) => {
      if (newVal && (newVal.push_enabled ?? true)) {
        await registerPush();
        await syncTokenWithBackend();
      }
    },
    { immediate: true }
);
</script>