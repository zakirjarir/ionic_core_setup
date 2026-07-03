<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="border-b border-zinc-100 dark:border-zinc-900" style="--background: var(--color-surface, #ffffff); --color: var(--color-text, #0f172a);">
        <ion-title class="font-bold text-lg text-zinc-900 dark:text-zinc-50">Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="bg-zinc-50 dark:bg-zinc-950">
      <div class="flex flex-col items-center justify-center min-h-full p-6 text-center gap-2">
        <strong class="text-xl font-bold text-zinc-900 dark:text-zinc-50">Ready to create an app?</strong>
        <p class="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">UI Components</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
</script>
