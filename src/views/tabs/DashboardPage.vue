<template>
  <ion-page>

    <z-header :title=" $t('dashboard.title')" :show-notification="true"/>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <div class="p-4 flex flex-col gap-5">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-3xl p-5 flex justify-between items-center shadow-lg shadow-indigo-500/10">
          <div class="flex flex-col gap-1">
            <p class="text-lg font-bold text-white">{{ $t('dashboard.welcome', { name: authStore.user?.name || 'User' }) }}</p>
            <p class="text-xs text-white/80 font-medium">{{ $t('common.app_tagline') }}</p>
          </div>
          <div class="text-4xl text-white/60">
            <ion-icon :icon="heartOutline" />
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl p-4 flex flex-col gap-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
            <ion-icon :icon="peopleOutline" class="text-xl" />
            <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">3</p>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ $t('dashboard.total_children') }}</p>
          </div>
          <div class="rounded-2xl p-4 flex flex-col gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
            <ion-icon :icon="timeOutline" class="text-xl" />
            <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">2</p>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ $t('dashboard.due_soon') }}</p>
          </div>
          <div class="rounded-2xl p-4 flex flex-col gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <ion-icon :icon="checkmarkCircleOutline" class="text-xl" />
            <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">14</p>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ $t('dashboard.completed') }}</p>
          </div>
          <div class="rounded-2xl p-4 flex flex-col gap-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
            <ion-icon :icon="alertCircleOutline" class="text-xl" />
            <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">1</p>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{{ $t('dashboard.overdue') }}</p>
          </div>
        </div>

        <!-- Upcoming Vaccinations -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('dashboard.upcoming') }}</h2>
            <button class="bg-transparent border-none text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer" @click="$router.push('/tabs/vaccination')">
              {{ $t('dashboard.view_all') }}
            </button>
          </div>

          <div class="flex flex-col gap-2.5">
            <div
              v-for="item in upcomingItems"
              :key="item.id"
              class="flex justify-between items-center p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="item.dotColor"></div>
                <div>
                  <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50">{{ item.vaccine }}</p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ item.child }}</p>
                </div>
              </div>
              <div>
                <span class="text-xs font-bold px-3 py-1.5 rounded-full" :class="item.badgeClass">
                  {{ item.date }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonContent, IonIcon,} from '@ionic/vue'
import {
  heartOutline, peopleOutline, timeOutline, checkmarkCircleOutline,
  alertCircleOutline,
} from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import ZHeader from "@/components/ZHeader.vue";

const authStore = useAuthStore()

const upcomingItems = [
  {
    id: 1,
    vaccine: 'MMR (Measles-Mumps-Rubella)',
    child: 'Ayaan Rahman',
    date: 'Jul 10',
    dotColor: 'bg-amber-500',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
  },
  {
    id: 2,
    vaccine: 'DTP Booster',
    child: 'Zara Khan',
    date: 'Jul 18',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
  },
  {
    id: 3,
    vaccine: 'Hepatitis B',
    child: 'Rayan Ali',
    date: 'Aug 2',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
  },
]
</script>
