<template>
  <ion-page>
    <z-header :title="t('children.details') || 'Child Details'">
      <template #end>
        <ion-button v-if="child" fill="clear" @click="router.push('/children-edit/' + child.id)"
                    class="text-teal-600 dark:text-teal-400">
          <ion-icon slot="icon-only" :icon="createOutline" class="text-xl"/>
        </ion-button>
      </template>
    </z-header>

    <ion-content>
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-teal-400/20 blur-xl animate-pulse"></div>
          <ion-spinner name="crescent" color="primary" class="w-12 h-12"></ion-spinner>
        </div>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="child" class="max-w-md mx-auto px-4 py-4 space-y-4">

        <div
            class="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg">

          <!-- Header -->
          <div class="bg-gradient-to-r from-[#008080] via-[#009999] to-[#006666] px-4 py-2 text-white">
            <div class="flex items-center gap-3">

              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">

                <img src="/images/login-image.png" class="rounded-full w-full h-full object-cover" alt="Logo" />
              </div>

              <div>
                <div class="text-lg font-black tracking-wider leading-none">
                  BIVEEC
                </div>
                <p class="text-[10px] text-white/80 font-medium">
                  Digital Health ID
                </p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-4">

            <div class="grid grid-cols-12 gap-3 items-center">

              <!-- Photo -->
              <div class="col-span-3">
                <img :src="LFA(child.photo)" class="w-20 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center" />
              </div>

              <!-- Details -->
              <div class="col-span-6 min-w-0">

                <div class="font-bold text-[#0c2340] dark:text-white text-base truncate">{{ child.name }}</div>

                <div class="mt-2 space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                  <div>
                    <span class="font-semibold text-zinc-900 dark:text-zinc-100">ID:</span>
                    <span class="font-mono ml-1">{{ child.child_uid }}</span>
                  </div>

                  <div>
                    <span class="font-semibold text-zinc-900 dark:text-zinc-100">DOB:</span>
                    <span class="ml-1">{{ formatDate(child.dob) }}</span>
                  </div>

                  <div>
                    <span class="font-semibold text-zinc-900 dark:text-zinc-100">Gender:</span>
                    <span class="ml-1">{{ getGenderLabel(child.gender) }}</span>
                  </div>
                </div>

              </div>

              <!-- QR -->
              <div class="col-span-3 flex flex-col items-center">

                <div class="p-1">
                  <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(child.child_uid)}`" class="w-18 h-18" alt="QR"/>
                </div>

                <span class="text-[8px] text-center text-zinc-500 dark:text-zinc-400 mt-1">Scan To Verify</span>

              </div>

            </div>

          </div>

          <!-- Footer -->
          <div class="bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 px-3 py-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-[#006666] dark:text-teal-400">One Child, One Digital Health ID</span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400">Bangladesh</span>
            </div>
          </div>

        </div>

        <div
            class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
              <ion-icon :icon="heartOutline" class="text-rose-600 dark:text-rose-400 text-sm"/>
            </div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">Health Profile</h3>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Birth
                Weight</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {{ child.birth_weight_kg ? `${child.birth_weight_kg} kg` : '--' }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Birth Type</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {{ getBirthTypeLabel(child.birth_type) }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Premature</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ child.premature ? 'Yes' : 'No' }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Disability</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ child.disabled ? 'Yes' : 'No' }}</p>
            </div>
          </div>

          <div v-if="child.allergies"
               class="mt-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-2.5 border border-amber-100 dark:border-amber-900/20">
            <p class="text-[8px] text-amber-600 dark:text-amber-500 font-black uppercase tracking-wider">⚠ Allergies</p>
            <p class="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">{{ child.allergies }}</p>
          </div>

          <div v-if="child.medical_conditions"
               class="mt-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl p-2.5 border border-blue-100 dark:border-blue-900/20">
            <p class="text-[8px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">🏥 Medical
              Conditions</p>
            <p class="text-xs text-blue-800 dark:text-blue-300 font-medium mt-0.5">{{ child.medical_conditions }}</p>
          </div>

          <div v-if="child.disabled && child.disability_note"
               class="mt-2 bg-red-50 dark:bg-red-950/20 rounded-xl p-2.5 border border-red-100 dark:border-red-900/20">
            <p class="text-[8px] text-red-600 dark:text-red-400 font-black uppercase tracking-wider">📝 Disability
              Note</p>
            <p class="text-xs text-red-800 dark:text-red-300 font-medium mt-0.5">{{ child.disability_note }}</p>
          </div>
        </div>

        <div
            class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <ion-icon :icon="locationOutline" class="text-emerald-600 dark:text-emerald-400 text-sm"/>
            </div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">Location</h3>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Division</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.division?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">District</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.district?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Upazila</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.upazila?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Union</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.union?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Village</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{
                  child.village?.name || child.post_code || '--'
                }}</span>
            </div>
          </div>

          <div v-if="child.address" class="mt-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-2.5">
            <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Address</p>
            <p class="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">{{ child.address }}</p>
          </div>
        </div>

        <div v-if="child.organization"
             class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center flex-shrink-0">
              <ion-icon :icon="businessOutline" class="text-teal-600 dark:text-teal-400 text-lg"/>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">
                Organization</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ child.organization?.name }}</p>
            </div>
          </div>
        </div>

        <div class="text-center py-2">
          <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
            Last updated: {{ formatDate(child.updated_at) || 'N/A' }}
          </p>
        </div>

      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
        <div class="relative">
          <div
              class="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-950/30 dark:to-emerald-950/30 flex items-center justify-center">
            <ion-icon :icon="peopleOutline" class="text-5xl text-teal-500 dark:text-teal-400"/>
          </div>
          <div
              class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">{{ t('children.not_found') }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">{{ t('children.not_found_sub') }}</p>
        </div>
        <button
            @click="router.back()"
            class="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
        >
          ← Go Back
        </button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, toastController
} from '@ionic/vue'
import {
  createOutline, businessOutline, heartOutline,
  locationOutline, peopleOutline
} from 'ionicons/icons'
import {useFunction, useStore, useCP} from "@/composables/index.js" // Added useCP
import ZHeader from "@/components/ZHeader.vue"

const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const store = useStore()
const CP = useCP() // Initialized CP
const {getData, formatDate,LFA} = useFunction()

const child = ref(null)
const loading = ref(true) // Set loading to true initially

onMounted(async () => {
  const childId = Number(route.params.id);

  // 1. Try to load from cache first
  const cachedChild = await CP.get(`child_${childId}`);
  if (cachedChild) {
    child.value = cachedChild;
    loading.value = false; // Display cached data immediately
  }

  // 2. Fetch fresh data from server
  await fetchChildDetails(childId);
});

const fetchChildDetails = async (childId) => {
  try {
    // Only show spinner if no cached data was loaded
    if (!child.value) {
      loading.value = true;
    }

    const list = await getData({url: 'children', rtn: true});
    if (list) {
      const found = list.find(c => c.id === childId);
      if (found) {
        child.value = found;
        await CP.set(`child_${childId}`, found); // Cache the specific child
      } else {
        // Child not found on server, maybe it was deleted or ID is wrong
        child.value = null; // Clear if previously cached and not found on server
      }
    } else {
      console.error('Failed to fetch children list from server.');
      // If server fetch fails, and no cached data, child.value remains null
    }
  } catch (error) {
    console.error('Error fetching child details:', error);
    // If error, and no cached data, child.value remains null
  } finally {
    loading.value = false; // Always set loading to false after fetch attempt
  }
};

const getGenderLabel = (value) => {
  const genders = store?.genders || []
  const found = genders.find(g => g.value === value || g.id === value)
  return found?.label || value || '--'
}

const getBirthTypeLabel = (value) => {
  const types = store?.birthTypes || []
  const found = types.find(t => t.value === value || t.id === value)
  return found?.label || value || '--'
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
    return `${years}y ${months}m`
  }
  return `${months}m`
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #008080, #004d4d);
  border-radius: 10px;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>