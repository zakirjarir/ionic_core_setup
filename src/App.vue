<template>
  <ion-app>
    <ion-router-outlet class="env_margin_bottom" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { usePushNotifications } from '@/composables/usePushNotifications';
import { useLanguage } from '@/composables/useLanguage';

const { addListeners } = usePushNotifications();
const { loadSavedLanguage } = useLanguage();

// Initialize listeners and load saved language on startup
addListeners();
loadSavedLanguage();
</script>