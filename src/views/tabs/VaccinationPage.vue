<template>
  <ion-page>
    <z-header :title="$t('vaccination.title')"/>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <!-- Child Selector -->
      <div class="px-4 pt-3">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <p class="text-xs uppercase tracking-wide text-zinc-500">
              {{ $t('vaccination.select_child') }}
            </p>
          </div>

          <!-- Horizontal Scroll Container -->
          <div class="p-3 overflow-x-auto hide-scrollbar">
            <div class="flex items-center gap-3" style="min-width: max-content;">
              <!-- All Children -->
              <button
                  @click="selectedChild = 'all'"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all flex-shrink-0 w-20"
                  :class="selectedChild === 'all'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border-2 border-transparent'"
              >
                <div class="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <ion-icon :icon="peopleOutline" class="text-2xl text-indigo-600" />
                </div>
                <div class="text-center">
                  <div class="text-xs font-semibold leading-tight">{{ $t('vaccination.all') }}</div>
                  <div class="text-[10px] text-zinc-500">{{ children.length }}</div>
                </div>
              </button>

              <!-- Child List -->
              <button
                  v-for="child in children"
                  :key="child.id"
                  @click="selectedChild = child.id"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all flex-shrink-0 w-20"
                  :class="selectedChild === child.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border-2 border-transparent'"
              >
                <div class="relative">
                  <img
                      v-if="child.photo"
                      :src="child.photo"
                      class="w-14 h-14 rounded-full object-cover border-2 border-zinc-200"
                      alt=""
                  />
                  <div
                      v-else
                      class="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold"
                  >
                    {{ child.name?.charAt(0) }}
                  </div>
                  <!-- Selected indicator -->
                  <div
                      v-if="selectedChild === child.id"
                      class="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-0.5 border-2 border-white dark:border-zinc-900"
                  >
                    <ion-icon :icon="checkmarkCircleOutline" class="text-white text-xs" />
                  </div>
                </div>
                <div class="text-center w-full">
                  <div class="text-xs font-semibold leading-tight truncate max-w-full" :title="child.name">
                    {{ child.name.split(' ')[0] }}
                  </div>
                  <div class="text-[10px] text-zinc-500">{{ child.age }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

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
              v-for="v in filteredUpcomingVaccines"
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
                @click="markAsDone(v.id)"
            >
              {{ $t('vaccination.mark_done') }}
            </ion-button>
          </div>

          <div v-if="filteredUpcomingVaccines.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
            <ion-icon :icon="checkmarkCircleOutline" class="text-5xl text-zinc-300 dark:text-zinc-700" />
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('common.no_data') }}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ $t('vaccination.no_upcoming') }}</p>
          </div>
        </template>

        <!-- Completed -->
        <template v-if="activeSegment === 'completed'">
          <div
              v-for="v in filteredCompletedVaccines"
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

          <div v-if="filteredCompletedVaccines.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
            <ion-icon :icon="medkitOutline" class="text-5xl text-zinc-300 dark:text-zinc-700" />
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('common.no_data') }}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ $t('vaccination.no_completed') }}</p>
          </div>
        </template>

        <!-- Missed -->
        <template v-if="activeSegment === 'missed'">
          <div
              v-for="v in filteredMissedVaccines"
              :key="v.id"
              class="flex flex-col gap-3.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                <ion-icon :icon="alertCircleOutline" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ v.name }}</p>
                <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ v.child }}</p>
                <p class="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                  {{ $t('vaccination.due_date') }}: <strong class="text-zinc-800 dark:text-zinc-200 font-bold">{{ v.dueDate }}</strong>
                </p>
                <span class="inline-block mt-2 px-3 py-1 text-[10px] font-bold rounded-full bg-rose-200 dark:bg-rose-800/50 text-rose-800 dark:text-rose-300">
                  {{ $t('vaccination.overdue') }}
                </span>
              </div>
            </div>
            <ion-button
                size="small"
                fill="solid"
                class="self-end text-xs font-bold"
                style="--border-radius: 8px; --background: #ef4444; --background-hover: #dc2626;"
                @click="markAsDone(v.id)"
            >
              {{ $t('vaccination.mark_done') }}
            </ion-button>
          </div>

          <div v-if="filteredMissedVaccines.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
            <ion-icon :icon="checkmarkCircleOutline" class="text-5xl text-emerald-500 dark:text-emerald-400" />
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ $t('vaccination.no_missed') }}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ $t('vaccination.all_caught_up') }}</p>
          </div>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSegment, IonSegmentButton,
  IonLabel
} from '@ionic/vue'
import {
  medkitOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  peopleOutline
} from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeSegment = ref('upcoming')
const selectedChild = ref('all')

// Sample children data with photos
const children = ref([
  {
    id: 1,
    name: 'Ayaan Rahman',
    age: '3 yrs',
    gender: 'Male',
    photo: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 2,
    name: 'Zara Khan',
    age: '2 yrs',
    gender: 'Female',
    photo: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: 'Rayan Ali',
    age: '1 yr',
    gender: 'Male',
    photo: null
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    age: '4 yrs',
    gender: 'Female',
    photo: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 5,
    name: 'Omar Hasan',
    age: '2 yrs',
    gender: 'Male',
    photo: null
  },
])

// Sample vaccines data with child_id and status
const vaccines = ref([
  // Upcoming
  { id: 1, name: 'MMR (Measles-Mumps-Rubella)', child: 'Ayaan Rahman', child_id: 1, dueDate: 'Jul 10, 2026', status: 'upcoming' },
  { id: 2, name: 'DTP Booster', child: 'Zara Khan', child_id: 2, dueDate: 'Jul 18, 2026', status: 'upcoming' },
  { id: 3, name: 'Hepatitis B - Dose 3', child: 'Rayan Ali', child_id: 3, dueDate: 'Aug 2, 2026', status: 'upcoming' },

  // Completed
  { id: 4, name: 'BCG', child: 'Ayaan Rahman', child_id: 1, givenDate: 'Mar 16, 2021', status: 'completed' },
  { id: 5, name: 'Hepatitis B - Dose 1', child: 'Ayaan Rahman', child_id: 1, givenDate: 'Mar 16, 2021', status: 'completed' },
  { id: 6, name: 'OPV - Dose 1', child: 'Zara Khan', child_id: 2, givenDate: 'Jul 21, 2022', status: 'completed' },

  // Missed
  { id: 7, name: 'DPT - Dose 2', child: 'Ayaan Rahman', child_id: 1, dueDate: 'Jan 15, 2026', status: 'missed' },
  { id: 8, name: 'Polio Booster', child: 'Zara Khan', child_id: 2, dueDate: 'Feb 20, 2026', status: 'missed' },
])

// Filter by child
const filterByChild = (items) => {
  if (selectedChild.value === 'all') return items
  return items.filter(item => item.child_id === selectedChild.value)
}

// Upcoming vaccines filtered by child
const upcomingVaccines = computed(() => vaccines.value.filter(v => v.status === 'upcoming'))
const filteredUpcomingVaccines = computed(() => filterByChild(upcomingVaccines.value))

// Completed vaccines filtered by child
const completedVaccines = computed(() => vaccines.value.filter(v => v.status === 'completed'))
const filteredCompletedVaccines = computed(() => filterByChild(completedVaccines.value))

// Missed vaccines filtered by child
const missedVaccines = computed(() => vaccines.value.filter(v => v.status === 'missed'))
const filteredMissedVaccines = computed(() => filterByChild(missedVaccines.value))

// Mark vaccine as done
const markAsDone = (id) => {
  const vaccine = vaccines.value.find(v => v.id === id)
  if (vaccine) {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    vaccine.status = 'completed'
    vaccine.givenDate = today
    delete vaccine.dueDate
  }
}
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

ion-select::part(placeholder) {
  color: #6b7280;
}

ion-select::part(text) {
  color: #18181b;
}

.dark ion-select::part(text) {
  color: #fafafa;
}

/* Style for the select options */
ion-select-option {
  --padding-start: 12px;
  --padding-end: 12px;
  --min-height: 52px;
}
</style>