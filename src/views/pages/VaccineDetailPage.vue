<template>
  <ion-page>
    <z-header :title="t('vaccination.details') || 'Vaccine Details'"></z-header>

    <ion-content>
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl animate-pulse"></div>
          <ion-spinner name="crescent" color="primary" class="w-12 h-12"></ion-spinner>
        </div>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="vaccine" class="max-w-md mx-auto px-4 py-4 space-y-4">
        <!-- Vaccine Main Card -->
        <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-5 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl flex-shrink-0">
              <ion-icon :icon="medkitOutline" />
            </div>
            <div class="min-w-0">
              <h2 class="text-xl font-black text-zinc-900 dark:text-white leading-tight">
                {{ locale === 'bn' ? (vaccine.vaccine_name_bn || vaccine.vaccine_name) : vaccine.vaccine_name }}
              </h2>
              <p class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {{ vaccine.dose_name }} ({{ t('vaccination.dose_no') || 'Dose' }} {{ vaccine.dose_no }})
              </p>
              <span class="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Code: {{ vaccine.code }}
              </span>
            </div>
          </div>

          <div v-if="vaccine.description" class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
            {{ vaccine.description }}
          </div>
        </div>

        <!-- Schedule details card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-md space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="calendarOutline" class="text-indigo-600 dark:text-indigo-400 text-lg" />
            <h3 class="text-sm font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-wide">
              {{ t('vaccination.schedule_info') || 'Schedule Information' }}
            </h3>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Recommended Age</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ formatAgeDays(vaccine.recommended_age_days) }}
              </p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Minimum Age</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ formatAgeDays(vaccine.minimum_age_days) }}
              </p>
            </div>
            <div v-if="vaccine.maximum_age_days" class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Maximum Age</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ formatAgeDays(vaccine.maximum_age_days) }}
              </p>
            </div>
            <div v-if="vaccine.minimum_gap_days" class="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Minimum Gap</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ formatAgeDays(vaccine.minimum_gap_days) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Available hospitals & centers -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-md space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="locationOutline" class="text-emerald-600 dark:text-emerald-400 text-lg" />
            <h3 class="text-sm font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-wide">
              {{ t('vaccination.available_hospitals') || 'Available Hospitals & Centers' }}
            </h3>
          </div>

          <div class="space-y-3">
            <div
                v-for="hospital in demoHospitals"
                :key="hospital.name"
                class="flex flex-col gap-2.5 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/20"
            >
              <div class="flex justify-between items-start">
                <div class="min-w-0">
                  <h4 class="font-bold text-zinc-900 dark:text-white text-sm truncate">
                    {{ locale === 'bn' ? hospital.name_bn : hospital.name }}
                  </h4>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-start gap-1">
                    <ion-icon :icon="businessOutline" class="flex-shrink-0 text-zinc-400 mt-0.5" />
                    <span>{{ locale === 'bn' ? hospital.address_bn : hospital.address }}</span>
                  </p>
                </div>
                <span class="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                  {{ t('vaccination.available') || 'Available' }}
                </span>
              </div>

              <div class="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                <span>🕒 {{ locale === 'bn' ? hospital.hours_bn : hospital.hours }}</span>
                <ion-button
                    size="small"
                    fill="clear"
                    class="text-emerald-600 dark:text-emerald-400 font-bold"
                    style="--padding-start: 4px; --padding-end: 4px; height: 24px; margin: 0;"
                >
                  <ion-icon slot="start" :icon="locationOutline" />
                  {{ t('vaccination.view_map') || 'View Map' }}
                </ion-button>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <ion-button
              expand="block"
              fill="outline"
              class="font-bold shadow-sm"
              style="--border-radius: 16px; --color: #4f46e5; --border-color: #e2e8f0; --border-width: 1px;"
              @click="router.back()"
          >
            ← {{ t('common.go_back') || 'Go Back' }}
          </ion-button>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
        <div class="relative">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
            <ion-icon :icon="medkitOutline" class="text-5xl text-indigo-500 dark:text-indigo-400" />
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">Vaccine Not Found</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">Could not find details for this vaccine.</p>
        </div>
        <button
            @click="router.back()"
            class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
        >
          ← Go Back
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, onIonViewWillEnter
} from '@ionic/vue'
import {
  medkitOutline, calendarOutline, locationOutline, businessOutline
} from 'ionicons/icons'
import { useFunction, useCP } from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { getData } = useFunction()
const CP = useCP()

const vaccine = ref(null)
const loading = ref(true)

// Cache key per schedule ID
const cacheKey = () => `vaccine_detail_${route.params.id}`

// Demo hospital list
const demoHospitals = ref([
  {
    name: 'Upazila Health Complex',
    name_bn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
    address: 'Sadar Road, Upazila Headquarter',
    address_bn: 'সদর রোড, উপজেলা সদর দপ্তর',
    hours: '8:00 AM - 2:00 PM (Sat - Thu)',
    hours_bn: 'সকাল ৮:০০ - দুপুর ২:০০ (শনি - বৃহস্পতি)'
  },
  {
    name: 'District General Hospital',
    name_bn: 'জেলা সদর হাসপাতাল',
    address: 'Hospital Road, District Center',
    address_bn: 'হাসপাতাল রোড, জেলা সদর',
    hours: '24 Hours Open',
    hours_bn: '২৪ ঘণ্টা খোলা'
  },
  {
    name: 'BIVEEC Community Clinic',
    name_bn: 'বাইভিক কমিউনিটি ক্লিনিক',
    address: 'Word No. 3, Near Primary School',
    address_bn: 'ওয়ার্ড নং ৩, প্রাথমিক বিদ্যালয়ের নিকট',
    hours: '9:00 AM - 1:00 PM (Sat - Wed)',
    hours_bn: 'সকাল ৯:০০ - দুপুর ১:০০ (শনি - বুধ)'
  }
])

onIonViewWillEnter(async () => {
  const scheduleId = Number(route.params.id)

  // 1. Load from CP cache immediately so offline users see data right away
  const cached = await CP.get(cacheKey())
  if (cached) {
    vaccine.value = cached
    loading.value = false
  }

  // 2. Fetch fresh data from server in background
  await fetchVaccineDetails(scheduleId)
})

const fetchVaccineDetails = async (scheduleId) => {
  try {
    // Only show full spinner if no cached data is available
    if (!vaccine.value) {
      loading.value = true
    }

    const res = await getData({
      url: `vaccinations/${scheduleId}`,
      rtn: true
    })

    if (res) {
      vaccine.value = res
      // 3. Update cache with fresh server data
      await CP.set(cacheKey(), res)
    }
  } catch (error) {
    console.error('Error fetching vaccine details:', error)
    // Falls back to cached data already displayed
  } finally {
    loading.value = false
  }
}

const formatAgeDays = (days) => {
  if (days === null || days === undefined) {
    return '--'
  }
  if (days === 0 || days === '0') {
    return locale.value === 'bn' ? 'জন্মের অব্যবহিত পরে' : 'Immediately after birth'
  }
  if (days >= 30) {
    const months = Math.floor(days / 30)
    return locale.value === 'bn' ? `${months} মাস` : `${months} month${months > 1 ? 's' : ''}`
  }
  return locale.value === 'bn' ? `${days} দিন` : `${days} day${days > 1 ? 's' : ''}`
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
