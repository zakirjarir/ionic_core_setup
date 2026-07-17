<template>
  <ion-page>
    <z-header :title="$t('vaccination.title')"/>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
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
              <!-- All Children -->
              <div
                  @click="selectedChild = 'all'"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all flex-shrink-0 w-20 overflow-hidden cursor-pointer"
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
              </div>

              <!-- Child List -->
              <div
                  v-for="child in children"
                  :key="child.id"
                  @click="selectedChild = child.id"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all flex-shrink-0 w-20 overflow-hidden cursor-pointer"
                  :class="selectedChild === child.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border-2 border-transparent'"
              >
                <div class="relative">
                  <img
                      v-if="child.photo"
                      :src="LFA(child.photo)"
                      class="w-14 h-14 rounded-full object-cover border-2 border-zinc-200"
                      alt=""
                  />
                  <div
                      v-else
                      class="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-50 to-purple-500 flex items-center justify-center text-white text-lg font-bold"
                  >
                    {{ (locale === 'bn' ? (child.name_bn || child.name) : child.name)?.charAt(0) }}
                  </div>
                  <!-- Selected indicator -->
                </div>
                <div class="text-center w-full">
                  <div class="text-xs font-semibold leading-tight truncate max-w-full" :title="locale === 'bn' ? (child.name_bn || child.name) : child.name">
                    {{ locale === 'bn' ? (child.name_bn || child.name).split(' ')[0] : child.name.split(' ')[0] }}
                  </div>
                  <div class="text-[10px] text-zinc-500">{{ formatChildAge(child.age) }}</div>
                </div>
              </div>
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
              @click="router.push('/vaccine-detail/' + v.schedule_id)"
              class="flex flex-col gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                <ion-icon :icon="medkitOutline" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {{ locale === 'bn' ? (v.vaccine_name_bn || v.vaccine_name) : v.vaccine_name }} - {{ v.dose_name }}
                </p>
                <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {{ getChildName(v.child_id) }}
                </p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {{ $t('vaccination.due_date') }}: <strong class="text-zinc-700 dark:text-zinc-300 font-bold">{{ formatDate(v.dueDate) }}</strong>
                </p>
              </div>
            </div>
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
              @click="router.push('/vaccine-detail/' + v.schedule_id)"
              class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                {{ locale === 'bn' ? (v.vaccine_name_bn || v.vaccine_name) : v.vaccine_name }} - {{ v.dose_name }}
              </p>
              <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {{ getChildName(v.child_id) }}
              </p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {{ $t('vaccination.given_date') }}: <strong class="text-zinc-700 dark:text-zinc-300 font-bold">{{ formatDate(v.givenDate) }}</strong>
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
              @click="router.push('/vaccine-detail/' + v.schedule_id)"
              class="flex flex-col gap-3.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                <ion-icon :icon="alertCircleOutline" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {{ locale === 'bn' ? (v.vaccine_name_bn || v.vaccine_name) : v.vaccine_name }} - {{ v.dose_name }}
                </p>
                <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {{ getChildName(v.child_id) }}
                </p>
                <p class="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                  {{ $t('vaccination.due_date') }}: <strong class="text-zinc-800 dark:text-zinc-200 font-bold">{{ formatDate(v.dueDate) }}</strong>
                </p>
                <span class="inline-block mt-2 px-3 py-1 text-[10px] font-bold rounded-full bg-rose-200 dark:bg-rose-800/50 text-rose-800 dark:text-rose-300">
                  {{ $t('vaccination.overdue') }}
                </span>
              </div>
            </div>
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
import { useRouter } from 'vue-router'
import {
  IonPage, IonContent, IonIcon, IonSegment, IonSegmentButton, IonLabel, onIonViewWillEnter,
  IonRefresher, IonRefresherContent
} from '@ionic/vue'
import {
  medkitOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  peopleOutline
} from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue"
import { useI18n } from 'vue-i18n'
import { useFunction, useStore, useCP } from '@/composables/index.js'

const { t, locale } = useI18n()
const router = useRouter()
const { getData, LFA, formatDate } = useFunction()
const store = useStore()
const CP = useCP()

const activeSegment = ref('upcoming')
const selectedChild = ref('all')

const children = ref([])
const vaccines = ref([])

onIonViewWillEnter(async () => {
  // 1. Load cached data immediately for offline support
  const cachedData = await CP.get('vaccination_list')
  if (cachedData) {
    children.value = cachedData.children || []
    vaccines.value = cachedData.vaccines || []
  }

  // 2. Fetch fresh data from server in background
  await loadData()
})

const loadData = async () => {
  try {
    const result = await getData({
      url: 'vaccinations',
      rtn: true
    })
    if (result) {
      children.value = result.children || []
      vaccines.value = result.vaccines || []
      // 3. Update cache with latest server data
      await CP.set('vaccination_list', result)
    }
  } catch (error) {
    console.error('Error fetching vaccinations:', error)
    // Falls back to cached data already displayed
  }
}

const handleRefresh = async (event) => {
  await loadData()
  event.target.complete()
}

const getChildName = (childId) => {
  const child = children.value.find(c => c.id === childId)
  if (!child) return ''
  return locale.value === 'bn' ? (child.name_bn || child.name) : child.name
}

const formatChildAge = (ageStr) => {
  if (!ageStr) return ''
  if (locale.value === 'bn') {
    return ageStr
      .replace('yrs', 'বছর')
      .replace('yr', 'বছর')
      .replace('months', 'মাস')
      .replace('month', 'মাস')
      .replace('days', 'দিন')
      .replace('day', 'দিন')
  }
  return ageStr
}

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