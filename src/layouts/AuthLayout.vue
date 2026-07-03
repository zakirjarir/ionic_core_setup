<template>
  <ion-page>
    <ion-content :fullscreen="true" class=" bg-zinc-50 dark:bg-zinc-950">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent } from '@ionic/vue'
</script>
