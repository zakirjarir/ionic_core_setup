<template>
  <ion-page>
    <z-header :title="$t('vaccination.title')"/>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <!-- Segment -->
      <div class="px-4 pt-3 pb-1">
        <ion-segment v-model="activeSegment" class="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-0.5">
          <ion-segment-button value="upcoming" class="min-h-[38px] text-xs font-semibold">
            <ion-label>{{ $t('vaccination.upcoming') }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed" class="min-h-[38px] text-xs font-semibold">
            <ion-label>{{ $t('vaccination.completed') }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="missed" class="min-h-[38px] text-xs font-semibold">
            <ion-label>{{ $t('vaccination.missed') }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <div class="p-4 flex flex-col gap-3">
        <!-- Upcoming -->
        <template v-if="activeSegment === 'upcoming'">
          <div
            v-for="v in upcomingVaccines"
            :key="v.id"
            class="flex flex-col gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                <ion-icon :icon="medkitOutline" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ v.name }}</p>
                <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ v.child }}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {{ $t('vaccination.due_date') }}: <strong class="text-zinc-700 dark:text-zinc-300 font-bold">{{ v.dueDate }}</strong>
                </p>
              </div>
            </div>
            <ion-button
              size="small"
              fill="outline"
              class="self-end text-xs font-bold"
              style="--border-radius: 8px; --color: #22c55e; --border-color: #22c55e;"
            >
              {{ $t('vaccination.mark_done') }}
            </ion-button>
          </div>
        </template>

        <!-- Completed -->
        <template v-if="activeSegment === 'completed'">
          <div
            v-for="v in completedVaccines"
            :key="v.id"
            class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ v.name }}</p>
              <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ v.child }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {{ $t('vaccination.given_date') }}: <strong class="text-zinc-700 dark:text-zinc-300 font-bold">{{ v.givenDate }}</strong>
              </p>
            </div>
          </div>
        </template>

        <!-- Missed -->
        <template v-if="activeSegment === 'missed'">
          <div v-if="missedVaccines.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
            <ion-icon :icon="checkmarkCircleOutline" class="text-5xl text-zinc-300 dark:text-zinc-700" />
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('common.no_data') }}</h3>
          </div>
          <div
            v-else
            v-for="v in missedVaccines"
            :key="v.id"
            class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
              <ion-icon :icon="alertCircleOutline" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ v.name }}</p>
              <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ v.child }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {{ $t('vaccination.due_date') }}: <strong class="text-zinc-700 dark:text-zinc-300 font-bold">{{ v.dueDate }}</strong>
              </p>
            </div>
          </div>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonMenuButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/vue'
import { medkitOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";

const activeSegment = ref('upcoming')

const upcomingVaccines = [
  { id: 1, name: 'MMR (Measles-Mumps-Rubella)', child: 'Ayaan Rahman', dueDate: 'Jul 10, 2026' },
  { id: 2, name: 'DTP Booster', child: 'Zara Khan', dueDate: 'Jul 18, 2026' },
  { id: 3, name: 'Hepatitis B - Dose 3', child: 'Rayan Ali', dueDate: 'Aug 2, 2026' },
]
const completedVaccines = [
  { id: 4, name: 'BCG', child: 'Ayaan Rahman', givenDate: 'Mar 16, 2021' },
  { id: 5, name: 'Hepatitis B - Dose 1', child: 'Ayaan Rahman', givenDate: 'Mar 16, 2021' },
  { id: 6, name: 'OPV - Dose 1', child: 'Zara Khan', givenDate: 'Jul 21, 2022' },
]
const missedVaccines = []
</script>
