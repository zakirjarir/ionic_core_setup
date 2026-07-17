<template>
  <ion-page>
    <ion-content class="ion-padding-bottom">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- ===== Header (Sticky) ===== -->
      <div class="sticky top-0 z-20 bg-[#F8FAFC]/90 dark:bg-[#09090B]/90 backdrop-blur-md px-4 pt-[calc(env(safe-area-inset-top,24px)+16px)] pb-4 flex items-center gap-3">

        <div class="flex items-center gap-2 min-w-0 flex-1">
          <div
            class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0 shadow-md shadow-indigo-500/20 cursor-pointer"
            @click="router.push('/profile')"
          >
            <div class="w-full h-full rounded-full bg-[#F8FAFC] dark:bg-[#09090B] overflow-hidden flex items-center justify-center">
              <img :src="LFA(user?.photo)" alt="Profile" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-[20px] font-black text-gray-800 dark:text-white m-0 pt-2 truncate leading-tight">{{ user?.name || 'Guest User' }}</div>
            <p class="text-[10px] text-gray-400 dark:text-zinc-400 m-0 truncate">{{ $t('dashboard.registered_children', { count: dbChildren.length }) }}</p>
          </div>
        </div>

        <!-- ChatBot Button -->
        <ion-button fill="clear" @click="router.push('/chatbot')" class="m-0 h-10 w-10 flex-shrink-0" style="--padding-start: 0; --padding-end: 0; --color: currentColor; --border-radius: 50%;">
          <ion-icon slot="icon-only" :icon="sparklesOutline" class="text-2xl text-indigo-600 dark:text-indigo-400" />
        </ion-button>
      </div>

      <!-- Child Selector (Horizontal Scroll) -->
      <div v-if="dbChildren.length > 0" class="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        <div
            v-for="child in dbChildren"
            :key="child.id"
            class="flex-1 min-w-[166px] rounded-2xl p-1.5 flex items-center justify-between relative transition-all duration-200 overflow-hidden cursor-pointer"
            :class="activeChildId === child.id
            ? 'border-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
            : 'border-2 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'"
            @click="activeChildId = child.id"
        >
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-200 dark:bg-zinc-800 flex items-center justify-center p-0.5">
              <img v-if="child.photo" :src="LFA(child.photo)" :alt="child.name" class="w-full h-full object-cover rounded-full" />
              <div v-else class="w-full h-full rounded-full flex items-center justify-center text-xs font-bold bg-indigo-100 text-indigo-700">
                {{ child.name?.charAt(0) }}
              </div>
            </div>
            <div>
              <span class="text-sm font-semibold text-gray-800 dark:text-white m-0">{{ child.name }}</span>
              <p class="text-[10px] text-gray-500 dark:text-zinc-400 m-0">{{ calculateAge(child.dob) }}</p>
            </div>
          </div>
          <div v-if="activeChildId === child.id" class="bg-indigo-600 text-white rounded-full p-1 flex items-center justify-center w-5 h-5">
            <ion-icon :icon="checkmarkOutline" class="text-xs font-bold"></ion-icon>
          </div>
          <ion-icon v-else :icon="chevronForwardOutline" class="text-gray-400 dark:text-zinc-500"></ion-icon>
        </div>
      </div>

      <!-- Empty State if no children are registered -->
      <div v-else class="mx-4 my-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 shadow-md">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
          <ion-icon :icon="peopleOutline" class="text-4xl" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
            {{ $t('children.no_children') || 'No Children Registered' }}
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
            {{ $t('children.no_children_sub') || 'Add your child to start tracking their vaccine cards.' }}
          </p>
        </div>
        <ion-button
            style="--background: linear-gradient(to right, #4f46e5, #9333ea); --border-radius: 12px; --color: #fff;"
            class="h-11 font-bold text-xs px-6"
            @click="router.push('/children-register')"
        >
          <ion-icon :icon="personAddOutline" slot="start" />
          {{ $t('children.add_child') || 'Add Child' }}
        </ion-button>
      </div>

      <!-- Dynamic Child Info Container -->
      <template v-if="dbChildren.length > 0">
        <!-- Next Vaccine Card -->
        <div
            class="mx-4 my-3 relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat shadow-lg"
            style="background-image: url('/images/vaccine_battle.png'); min-height: 190px;"
        >
          <!-- Overlay -->
          <div
              class="absolute inset-0
             bg-gradient-to-r
             from-white/95
             via-cyan-50/80
             to-teal-100/20
             dark:from-zinc-950/95
             dark:via-zinc-900/80
             dark:to-zinc-950/20"
          ></div>

          <!-- Content -->
          <div class="relative z-10 p-4 flex h-full items-center">
            <div class="max-w-[58%]">

              <!-- Badge -->
              <div
                  class="inline-flex items-center rounded-full
                 bg-emerald-500/10
                 px-2.5 py-1
                 text-[10px] font-semibold
                 text-emerald-700 dark:text-emerald-300"
              >
                {{ $t('dashboard.next_vaccine') }}
              </div>

              <!-- Vaccine Name -->
              <h2
                  class="mt-2 text-lg font-black
                 leading-tight
                 text-slate-900 dark:text-white"
              >
                {{ nextVaccine.name }}
              </h2>

              <!-- Info -->
              <div class="mt-3 flex flex-col gap-2">

                <div
                    class="inline-flex w-fit items-center gap-2
                   rounded-lg bg-white/70
                   px-3 py-1.5 text-xs
                   dark:bg-zinc-800/70"
                >
                  <IonIcon
                      :icon="calendarOutline"
                      class="text-sm"
                  />
                  <span>{{ nextVaccine.date }}</span>
                </div>

                <div
                    class="inline-flex w-fit items-center gap-2
                   rounded-lg bg-orange-50
                   px-3 py-1.5 text-xs
                   dark:bg-orange-900/20"
                >
                  <IonIcon
                      :icon="timeOutline"
                      class="text-sm text-orange-500"
                  />
                  <span
                      class="font-medium text-orange-600 dark:text-orange-400"
                  >
                    {{ nextVaccine.remaining }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ===== Progress + Quick Actions ===== -->
        <div class="px-4 my-4 grid grid-cols-2 gap-4">
          <!-- Progress Circle (SVG) -->
          <div class="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-50 dark:border-zinc-800 flex flex-col items-center justify-center shadow-sm dark:shadow-zinc-800/50">
            <div class="text-[13px] font-bold text-gray-700 dark:text-zinc-300 self-start">{{ $t('dashboard.progress_title') }}</div>
            <div class="relative w-28 h-28 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#e5e7eb"
                    class="dark:stroke-zinc-800"
                    stroke-width="8"
                />
                <!-- Progress circle -->
                <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#4F46E5"
                    class="dark:stroke-indigo-400"
                    stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (circumference * progress / 100)"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-lg font-black text-gray-800 dark:text-white">{{ progress }}%</span>
                <p class="text-[9px] text-gray-500 dark:text-zinc-400 font-bold m-0 mt-0.5 leading-tight text-center">
                  {{ $t('dashboard.progress_unit', { completed: completedVaccines, total: totalVaccines }) }}
                  <br><span class="font-normal text-gray-400 dark:text-zinc-500">{{ $t('dashboard.completed_label') }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-1.5">
            <div
                v-for="action in quickActions"
                :key="action.label"
                class="p-3 rounded-xl flex flex-col items-center justify-center text-center border transition-colors cursor-pointer active:scale-95"
                :class="action.bg"
                @click="action.action()"
            >
              <div class="rounded-lg mb-1" :class="action.iconBg">
                <ion-icon :icon="action.icon" :class="action.iconColor"></ion-icon>
              </div>
              <span class="text-[10px] font-bold text-gray-700 dark:text-zinc-300 leading-tight">{{ action.label }}</span>
            </div>
          </div>
        </div>

        <!-- Upcoming Schedule -->
        <div class="px-4 my-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xs font-bold text-gray-800 dark:text-white">{{ $t('dashboard.upcoming_schedule') }}</h3>
            <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" @click="router.push('/tabs/vaccination')">
              {{ $t('dashboard.view_all') }}
            </span>
          </div>

          <template v-if="upcomingSchedules.length > 0">
            <div
                v-for="schedule in upcomingSchedules"
                :key="schedule.id"
                class="bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl p-3 flex items-center justify-between shadow-sm dark:shadow-zinc-800/50 mb-3 cursor-pointer active:scale-[0.98] transition-transform"
                @click="router.push('/vaccine-detail/' + schedule.schedule_id)"
            >
              <div class="flex items-center gap-3">
                <div class="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl p-2 text-center flex flex-col justify-center min-w-[50px]">
                  <span class="text-sm font-black leading-none">{{ schedule.day }}</span>
                  <span class="text-[9px] font-bold mt-1">{{ schedule.monthYear }}</span>
                </div>
                <div>
                  <h4 class="text-[11px] font-bold text-gray-800 dark:text-white m-0">{{ schedule.vaccine }} <span class="text-[9px] text-gray-400 dark:text-zinc-400 font-normal">{{ schedule.detail }}</span></h4>
                  <div class="flex items-center gap-3 mt-1">
                    <span class="text-[9px] text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                      <div class="w-3 h-3 rounded-full bg-blue-200 dark:bg-zinc-700 overflow-hidden inline-block flex items-center justify-center">
                        <img v-if="schedule.childAvatar" :src="LFA(schedule.childAvatar)" class="w-full h-full object-cover rounded-full"/>
                        <span v-else class="text-[8px] font-bold">{{ schedule.childName?.charAt(0) }}</span>
                      </div>
                      {{ schedule.childName }}
                    </span>
                    <span class="text-[9px] text-gray-400 dark:text-zinc-500">{{ schedule.childAge }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 rounded-full">{{ schedule.remaining }}</span>
                <ion-icon :icon="chevronForwardOutline" class="text-gray-400 dark:text-zinc-500 text-sm"></ion-icon>
              </div>
            </div>
          </template>
          <div v-else class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
            <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ $t('vaccination.no_upcoming') || 'No upcoming vaccinations scheduled.' }}</p>
          </div>
        </div>
      </template>

      <!-- Notifications -->
      <div class="px-4 my-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold text-gray-800 dark:text-white">{{ $t('dashboard.recent_notifications') }}</h3>
          <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" @click="router.push('/tabs/notifications')">
            {{ $t('dashboard.view_all') }}
          </span>
        </div>

        <div v-if="notificationsList.length > 0" class="bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl divide-y divide-gray-100 dark:divide-zinc-800 shadow-sm dark:shadow-zinc-800/50 overflow-hidden">
          <div
              v-for="note in notificationsList"
              :key="note.id"
              class="p-3 flex items-start justify-between cursor-pointer active:bg-zinc-50 dark:active:bg-zinc-800"
              @click="router.push('/notification-detail/' + note.id)"
          >
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-zinc-50 dark:bg-zinc-800/50" >
                <ion-icon :icon="note.icon" :class="note.iconColor"></ion-icon>
              </div>
              <div>
                <h5 class="text-[11px] font-bold text-gray-800 dark:text-white m-0">{{ note.title }}</h5>
                <p class="text-[10px] text-gray-500 dark:text-zinc-400 m-0 mt-0.5 leading-snug">{{ note.desc }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1.5 min-w-[70px] flex-shrink-0">
              <span class="text-[8px] text-gray-400 dark:text-zinc-500 font-semibold">{{ note.time }}</span>
              <span v-if="!note.read" class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </div>
        <div v-else class="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ $t('notifications.no_notifications') || 'No notifications found.' }}</p>
        </div>
      </div>

      <!-- Health Tip -->
      <div class="mx-4 my-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-3 flex items-center gap-3">
        <div class="w-16 h-16 flex-shrink-0 bg-amber-100 dark:bg-amber-800/30 rounded-xl overflow-hidden flex items-center justify-center">
          <span class="text-2xl">👨‍👩‍👦</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-[11px] font-bold text-amber-800 dark:text-amber-400 m-0 flex items-center gap-1">
            {{ $t('dashboard.health_tip_title') }}
          </h4>
          <p class="text-[10px] text-amber-700/90 dark:text-amber-300/80 m-0 mt-0.5 leading-relaxed">
            {{ $t('dashboard.health_tip_desc') }}
          </p>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IonPage, IonContent, IonIcon, IonButton, onIonViewWillEnter,
  IonRefresher, IonRefresherContent
} from '@ionic/vue'
import {
  notificationsOutline,
  personAddOutline,
  checkmarkOutline,
  chevronForwardOutline,
  calendarOutline,
  timeOutline,
  arrowForwardOutline,
  shieldCheckmark,
  ribbonOutline,
  calendarNumberOutline,
  documentTextOutline,
  cardOutline,
  sparklesOutline,
  alertCircleOutline,
  informationCircleOutline,
  peopleOutline,
} from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCP, useFunction } from "@/composables/index.js";

const { t, locale } = useI18n()
const CP = useCP();
const router = useRouter()
const { getData, LFA, formatDate } = useFunction()

const user = ref({})
const dbChildren = ref([])
const dbVaccines = ref([])
const dbNotifications = ref([])
const activeChildId = ref(null)

const loadDashboardData = async () => {
  // 1. Try to load user and cached data from CP
  user.value = await CP.get('user') || {}
  
  const cachedVaccines = await CP.get('vaccination_list')
  if (cachedVaccines) {
    dbChildren.value = cachedVaccines.children || []
    dbVaccines.value = cachedVaccines.vaccines || []
    if (dbChildren.value.length > 0 && !activeChildId.value) {
      activeChildId.value = dbChildren.value[0].id
    }
  }

  const cachedNotes = await CP.get('cached_notifications', [])
  if (cachedNotes) {
    dbNotifications.value = cachedNotes
  }

  // 2. Fetch fresh data from the server
  try {
    const vResult = await getData({ url: 'vaccinations', rtn: true })
    if (vResult) {
      dbChildren.value = vResult.children || []
      dbVaccines.value = vResult.vaccines || []
      await CP.set('vaccination_list', vResult)
      
      // If we don't have an active child selected or the selected child doesn't exist anymore, select the first
      if (dbChildren.value.length > 0 && (!activeChildId.value || !dbChildren.value.find(c => c.id === activeChildId.value))) {
        activeChildId.value = dbChildren.value[0].id
      }
    }

    const nResult = await getData({ url: 'notifications', rtn: true })
    if (nResult) {
      dbNotifications.value = nResult
      await CP.set('cached_notifications', nResult)
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }
}

onIonViewWillEnter(async () => {
  await loadDashboardData()
})

const handleRefresh = async (event) => {
  await loadDashboardData()
  event.target.complete()
}

const calculateAge = (dob) => {
  if (!dob) return ''
  const birthDate = new Date(dob)
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--
    months += 12
  }

  if (years > 0) {
    return locale.value === 'bn' ? `${years} বছর ${months} মাস` : `${years}y ${months}m`
  }
  return locale.value === 'bn' ? `${months} মাস` : `${months}m`
}

// Next Vaccine for selected child
const nextVaccine = computed(() => {
  if (!activeChildId.value) {
    return {
      name: t('dashboard.no_upcoming') || 'No upcoming vaccines',
      date: '--',
      remaining: '--'
    }
  }
  const upcoming = dbVaccines.value.filter(v => v.child_id === activeChildId.value && v.status === 'upcoming')
  if (upcoming.length === 0) {
    return {
      name: t('dashboard.all_caught_up') || 'All Caught Up',
      date: '--',
      remaining: t('dashboard.no_upcoming') || 'No upcoming vaccines'
    }
  }
  
  // Sort by due date ascending
  const sorted = upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  const next = sorted[0]
  
  // Calculate remaining days
  const due = new Date(next.dueDate)
  const today = new Date()
  // reset hours to midnight for date diff
  due.setHours(0,0,0,0)
  today.setHours(0,0,0,0)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  let remainingStr = ''
  if (diffDays < 0) {
    remainingStr = t('vaccination.overdue') || 'Overdue'
  } else if (diffDays === 0) {
    remainingStr = t('vaccination.due_today') || 'Due Today'
  } else {
    remainingStr = locale.value === 'bn' ? `${diffDays} দিন বাকি` : `${diffDays} days remaining`
  }

  return {
    name: locale.value === 'bn' ? (next.vaccine_name_bn || next.vaccine_name) : next.vaccine_name,
    date: formatDate(next.dueDate),
    remaining: remainingStr
  }
})

// Progress for selected child
const totalVaccines = computed(() => dbVaccines.value.filter(v => v.child_id === activeChildId.value).length)
const completedVaccines = computed(() => dbVaccines.value.filter(v => v.child_id === activeChildId.value && v.status === 'completed').length)
const progress = computed(() => totalVaccines.value > 0 ? Math.round((completedVaccines.value / totalVaccines.value) * 100) : 0)
const circumference = 2 * Math.PI * 42 // r=42

// Quick Actions
const quickActions = computed(() => [
  {
    label: t('dashboard.action_schedule'),
    icon: ribbonOutline,
    bg: 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-100/50 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    action: () => router.push('/tabs/vaccination')
  },
  {
    label: t('dashboard.action_time'),
    icon: calendarNumberOutline,
    bg: 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-100/50 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    action: () => router.push('/tabs/vaccination')
  },
  {
    label: t('dashboard.action_history'),
    icon: documentTextOutline,
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100/50 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    action: () => router.push('/tabs/vaccination')
  },
  {
    label: t('dashboard.action_card'),
    icon: cardOutline,
    bg: 'bg-orange-50/50 dark:bg-orange-950/30 border-orange-100/50 dark:border-orange-800/30',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    action: () => router.push('/tabs/vaccination')
  }
])

// Upcoming Schedules for all children
const upcomingSchedules = computed(() => {
  const upcoming = dbVaccines.value.filter(v => v.status === 'upcoming')
  const sorted = upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3)
  return sorted.map(v => {
    const child = dbChildren.value.find(c => c.id === v.child_id)
    const childName = child ? child.name : ''
    const childAge = child ? calculateAge(child.dob) : ''
    const childAvatar = child ? child.photo : null
    
    const d = new Date(v.dueDate)
    const day = d.getDate()
    const monthNames = locale.value === 'bn' 
      ? ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthYear = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    
    const dueTime = new Date(v.dueDate).setHours(0,0,0,0)
    const todayTime = new Date().setHours(0,0,0,0)
    const diffTime = dueTime - todayTime
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let remaining = ''
    if (diffDays < 0) remaining = t('vaccination.overdue') || 'Overdue'
    else if (diffDays === 0) remaining = t('vaccination.due_today') || 'Today'
    else remaining = locale.value === 'bn' ? `${diffDays} দিন বাকি` : `${diffDays}d left`

    return {
      id: v.id,
      schedule_id: v.schedule_id,
      day: String(day),
      monthYear,
      vaccine: locale.value === 'bn' ? (v.vaccine_name_bn || v.vaccine_name) : v.vaccine_name,
      detail: `(${v.dose_name})`,
      childName,
      childAge,
      childAvatar,
      remaining
    }
  })
})

// Notifications
const notificationsList = computed(() => {
  return dbNotifications.value.slice(0, 3).map(n => {
    return {
      id: n.id,
      title: n.title,
      desc: n.message,
      time: n.time,
      icon: n.type === 'warning' ? alertCircleOutline : informationCircleOutline,
      iconColor: n.type === 'warning' ? 'text-amber-500 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400',
      read: n.read
    }
  })
})
</script>

<style scoped>
/* Horizontal Scrollbar Hide */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>