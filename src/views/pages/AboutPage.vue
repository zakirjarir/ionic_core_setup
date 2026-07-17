<template>
  <ion-page>
    <z-header :title=" $t('about.title')"/>

    <ion-content>
      <div class="p-4 flex flex-col gap-6">
        <!-- App Card -->
        <div class="flex flex-col items-center gap-3 text-center py-6">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-4xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
            <ion-icon :icon="heartOutline" />
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">{{ $t('about.app_name') }}</h1>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{{ $t('common.app_tagline') }}</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3.5 py-1.5 rounded-full mt-1">
            {{ $t('about.version') }} 1.0.0
          </span>
        </div>

        <!-- Description -->
        <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">{{ $t('about.app_description') }}</p>
        </div>

        <!-- Info List -->
        <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <ion-icon :icon="codeSlashOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <p class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('about.developer') }}</p>
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">BIVEEC Team</p>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="globeOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <p class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('about.website') }}</p>
              <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 cursor-pointer hover:underline" @click="openWebsite">www.biveec.app</p>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="calendarOutline" class="text-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <p class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Built With</p>
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">Ionic Vue + Capacitor</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button @click="rateApp" class="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer active:scale-[0.98] transition-transform text-xs font-bold text-zinc-900 dark:text-zinc-50 shadow-sm">
            <ion-icon :icon="starOutline" class="text-2xl text-indigo-600 dark:text-indigo-400" />
            <span>{{ $t('about.rate_app') }}</span>
          </button>
          <button @click="shareApp" class="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer active:scale-[0.98] transition-transform text-xs font-bold text-zinc-900 dark:text-zinc-50 shadow-sm">
            <ion-icon :icon="shareOutline" class="text-2xl text-indigo-600 dark:text-indigo-400" />
            <span>{{ $t('about.share_app') }}</span>
          </button>
        </div>

        <p class="text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-4">© 2026 BIVEEC. All rights reserved.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonIcon,
} from '@ionic/vue'
import {
  heartOutline, codeSlashOutline, globeOutline, calendarOutline, starOutline, shareOutline,
} from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";

function openWebsite() { window.open('https://biveec.app') }
function rateApp() { window.open('https://play.google.com/store') }
function shareApp() { if (navigator.share) navigator.share({ title: 'BIVEEC', url: 'https://biveec.app' }) }
</script>
