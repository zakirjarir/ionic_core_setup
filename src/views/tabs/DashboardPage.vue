<template>
  <ion-page>
    <ion-content class="ion-padding-bottom">

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
            <div class="text-[20px] font-black text-gray-800 dark:text-white m-0 pt-2 truncate leading-tight">{{ user?.name || 'Guest User ' }}</div>
            <p class="text-[10px] text-gray-400 dark:text-zinc-400 m-0 truncate">{{ $t('dashboard.registered_children', { count: children.length }) }}</p>
          </div>
        </div>

        <!-- ChatBot Button -->
        <ion-button fill="clear" @click="router.push('/chatbot')" class="m-0 h-10 w-10 flex-shrink-0" style="--padding-start: 0; --padding-end: 0; --color: currentColor; --border-radius: 50%;">
          <ion-icon slot="icon-only" :icon="sparklesOutline" class="text-2xl text-indigo-600 dark:text-indigo-400" />
        </ion-button>
      </div>

      <!-- Child Selector (Horizontal Scroll - infinite) -->
      <div class="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        <div
            v-for="(child, index) in children"
            :key="child.id"
            class="flex-1 min-w-[166px] rounded-2xl p-1.5 flex items-center justify-between relative transition-all duration-200 overflow-hidden"
            :class="activeChildId === child.id
            ? 'border-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
            : 'border-2 border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'"
            @click="activeChildId = child.id"
        >
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-200 dark:bg-zinc-800">
              <img :src="child.avatar" :alt="child.name" class="w-full h-full object-cover" />
            </div>
            <div>
              <span class="text-sm text-gray-800 dark:text-white m-0">{{ child.name }}</span>
              <p class="text-[10px] text-gray-500 dark:text-zinc-400 m-0">{{ child.age }}</p>
            </div>
          </div>
          <div v-if="activeChildId === child.id" class="bg-indigo-600 text-white rounded-full p-1 flex items-center justify-center w-5 h-5">
            <ion-icon :icon="checkmarkOutline" class="text-xs font-bold"></ion-icon>
          </div>
          <ion-icon v-else :icon="chevronForwardOutline" class="text-gray-400 dark:text-zinc-500"></ion-icon>
        </div>
      </div>
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
          <div class="text-[13px] font-bold text-gray-700 dark:text-zinc-300  self-start">{{ $t('dashboard.progress_title') }}</div>
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
        <div class="grid grid-cols-2 gap-1">
          <div
              v-for="action in quickActions"
              :key="action.label"
              class="p-3 rounded-xl flex flex-col items-center justify-center text-center border transition-colors"
              :class="action.bg"
          >
            <div class=" rounded-lg mb-1" :class="action.iconBg">
              <ion-icon :icon="action.icon" :class="action.iconColor"></ion-icon>
            </div>
            <span class="text-[10px] font-bold text-gray-700 dark:text-zinc-300">{{ action.label }}</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <div class="px-4 my-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold text-gray-800 dark:text-white">{{ $t('dashboard.upcoming_schedule') }}</h3>
          <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">{{ $t('dashboard.view_all') }}</span>
        </div>

        <div
            v-for="schedule in upcomingSchedules"
            :key="schedule.id"
            class="bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl p-3 flex items-center justify-between shadow-sm dark:shadow-zinc-800/50 mb-3"
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
                  <div class="w-3 h-3 rounded-full bg-blue-200 dark:bg-zinc-700 overflow-hidden inline-block">
                    <img :src="schedule.childAvatar" class="w-full h-full object-cover"/>
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
      </div>

      <!-- Notifications -->
      <div class="px-4 my-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold text-gray-800 dark:text-white">{{ $t('dashboard.recent_notifications') }}</h3>
          <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">{{ $t('dashboard.view_all') }}</span>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl divide-y divide-gray-100 dark:divide-zinc-800 shadow-sm dark:shadow-zinc-800/50">
          <div
              v-for="note in notifications"
              :key="note.id"
              class="p-3 flex items-start justify-between"
          >
            <div class="flex gap-3">
              <div class="p-2 rounded-full mt-4" >
                <ion-icon :icon="note.icon" :class="note.iconColor"></ion-icon>
              </div>
              <div>
                <h5 class="text-[11px] font-bold text-gray-800 dark:text-white m-0">{{ note.title }}</h5>
                <p class="text-[10px] text-gray-500 dark:text-zinc-400 m-0 mt-0.5">{{ note.desc }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1.5 min-w-[60px]">
              <span class="text-[8px] text-gray-400 dark:text-zinc-500">{{ note.time }}</span>
              <span v-if="!note.read" class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Tip -->
      <div class="mx-4 my-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-3 flex items-center gap-3">
        <div class="w-16 h-16 flex-shrink-0 bg-amber-100 dark:bg-amber-800/30 rounded-xl overflow-hidden flex items-center justify-center">
          <span class="text-2xl">👨‍👩‍👦</span>
        </div>
        <div>
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
  IonPage, IonContent, IonIcon, IonButton, onIonViewWillEnter
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
} from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import router from "@/router/index.js";
import {useCP, useFunction} from "@/composables/index.js";

const { t } = useI18n()
const CP = useCP();
const user = ref({})
const {LFA} = useFunction()

onIonViewWillEnter(async ()=>{
   user.value = await  CP.get('user');
})



// ===== Children Data =====
const children = computed(() => [
  {
    id: 1,
    name: t('dashboard.arafat'),
    age: t('dashboard.arafat_age'),
    avatar: 'https://plus.unsplash.com/premium_photo-1664474430762-f5201ecb6c43?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmV3Ym9ybnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 2,
    name: t('dashboard.ayesha'),
    age: t('dashboard.ayesha_age'),
    avatar: 'https://plus.unsplash.com/premium_photo-1664474430762-f5201ecb6c43?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmV3Ym9ybnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 3,
    name: t('dashboard.rafi'),
    age: t('dashboard.rafi_age'),
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop'
  }
])

const activeChildId = ref(1)

// ===== Next Vaccine =====
const nextVaccine = computed(() => ({
  name: 'MR Vaccine',
  date: t('dashboard.next_vaccine_date'),
  remaining: t('dashboard.next_vaccine_remaining')
}))

// ===== Progress =====
const totalVaccines = 12
const completedVaccines = 8
const progress = computed(() => Math.round((completedVaccines / totalVaccines) * 100))
const circumference = 2 * Math.PI * 42 // r=42

// ===== Quick Actions =====
const quickActions = computed(() => [
  {
    label: t('dashboard.action_schedule'),
    icon: ribbonOutline,
    bg: 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-100/50 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    label: t('dashboard.action_time'),
    icon: calendarNumberOutline,
    bg: 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-100/50 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: t('dashboard.action_history'),
    icon: documentTextOutline,
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100/50 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    label: t('dashboard.action_card'),
    icon: cardOutline,
    bg: 'bg-orange-50/50 dark:bg-orange-950/30 border-orange-100/50 dark:border-orange-800/30',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
])

// ===== Upcoming Schedules =====
const upcomingSchedules = computed(() => [
  {
    id: 1,
    day: '১৫',
    monthYear: t('dashboard.july_2026'),
    vaccine: 'MR Vaccine',
    detail: '(Measles-Rubella)',
    childName: t('dashboard.arafat'),
    childAge: t('dashboard.arafat_age'),
    childAvatar: 'https://plus.unsplash.com/premium_photo-1664474430762-f5201ecb6c43?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmV3Ym9ybnxlbnwwfHwwfHx8MA%3D%3D',
    remaining: t('dashboard.remaining_days_11')
  },
  {
    id: 2,
    day: '২২',
    monthYear: t('dashboard.august_2026'),
    vaccine: 'Polio Booster',
    detail: '(Oral)',
    childName: t('dashboard.ayesha'),
    childAge: t('dashboard.ayesha_age'),
    childAvatar: 'https://plus.unsplash.com/premium_photo-1664474430762-f5201ecb6c43?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmV3Ym9ybnxlbnwwfHwwfHx8MA%3D%3D',
    remaining: t('dashboard.remaining_days_42')
  }
])

// ===== Notifications =====
const notifications = computed(() => [
  {
    id: 1,
    title: t('dashboard.note_title_1'),
    desc: t('dashboard.note_desc_1'),
    time: t('dashboard.time_2h'),
    icon: notificationsOutline,
    iconColor: 'text-red-500 dark:text-red-400',
    read: false
  },
  {
    id: 2,
    title: t('dashboard.note_title_2'),
    desc: t('dashboard.note_desc_2'),
    time: t('dashboard.time_1d'),
    icon: calendarOutline,
    iconColor: 'text-blue-500 dark:text-blue-400',
    read: false
  },
  {
    id: 3,
    title: t('dashboard.note_title_3'),
    desc: t('dashboard.note_desc_3'),
    time: t('dashboard.time_2d'),
    icon: ribbonOutline,
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    read: true
  }
])
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