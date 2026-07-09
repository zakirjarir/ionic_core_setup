<template>
  <ion-page>
    <z-header :title="t('children.details') || 'Child Details'">
      <template #end>
        <ion-button v-if="child" fill="clear" @click="openEditModal" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="createOutline" class="text-xl" />
        </ion-button>
      </template>
    </z-header>

    <ion-content class="bg-[#F8F9FD] dark:bg-zinc-950">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ t('common.loading') }}</p>
      </div>

      <!-- Detail Layout -->
      <div v-else-if="child" class="max-w-md mx-auto px-4 py-6 space-y-6">
        
        <!-- Premium Child Health Card with Holographic/Glossy reflection -->
        <div class="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white p-6 shadow-xl border border-indigo-500/20 group">
          
          <!-- Diagonal Glossy Reflection Overlay -->
          <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
          
          <!-- Background decoration bubbles -->
          <div class="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/5 blur-xl"></div>
          <div class="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-white/5 blur-xl"></div>
          
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-5 relative z-10">
            <div>
              <div class="flex items-center gap-2">
                <ion-icon :icon="heartOutline" class="text-indigo-200 text-base" />
                <h2 class="text-[9px] font-extrabold tracking-widest text-indigo-200 uppercase">{{ t('children.health_card') || 'CHILD HEALTH CARD' }}</h2>
              </div>
              <h1 class="text-2xl font-black mt-1 tracking-tight">{{ child.name }}</h1>
              <p v-if="child.name_bn" class="text-xs text-indigo-150 font-semibold mt-0.5">{{ child.name_bn }}</p>
            </div>
            
            <span class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {{ child.child_status || 'ACTIVE' }}
            </span>
          </div>

          <!-- Card Body with QR Code -->
          <div class="flex gap-4 items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/15 relative z-10">
            <!-- Left Info -->
            <div class="space-y-3 flex-1 min-w-0">
              <div>
                <p class="text-[9px] text-indigo-200 uppercase font-black tracking-wider">{{ t('children.id') || 'CHILD ID' }}</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <p class="font-mono text-sm font-black tracking-wider text-white truncate">{{ child.child_uid }}</p>
                  <button @click="copyUid(child.child_uid)" class="bg-white/10 hover:bg-white/20 border-0 text-white rounded-lg p-1.5 cursor-pointer flex transition-all">
                    <ion-icon :icon="copyOutline" class="text-xs" />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-[8px] text-indigo-200 uppercase font-black tracking-wider">{{ t('children.gender') }}</p>
                  <p class="text-xs font-bold mt-0.5">{{ getGenderLabel(child.gender) }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-indigo-200 uppercase font-black tracking-wider">{{ t('children.blood_group') }}</p>
                  <p class="text-xs font-bold mt-0.5">{{ child.blood_group || '--' }}</p>
                </div>
              </div>

              <div>
                <p class="text-[8px] text-indigo-200 uppercase font-black tracking-wider">{{ t('children.date_of_birth') }}</p>
                <p class="text-xs font-bold mt-0.5">{{ formatDateString(child.dob) }} ({{ calculateAge(child.dob) }})</p>
              </div>
            </div>

            <!-- Right QR Code (Health passport QR) -->
            <div class="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl shadow-md flex-shrink-0">
              <img 
                :src="`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(child.child_uid)}`" 
                class="w-20 h-20 object-contain" 
                alt="Child QR Code" 
              />
              <span class="text-[8px] text-zinc-500 font-mono font-bold">{{ child.child_uid }}</span>
            </div>
          </div>

          <!-- Bottom Bar: Barcode Mockup (Adds authentic card feel) -->
          <div class="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2 relative z-10">
            <!-- Clinic Center Info -->
            <div class="flex items-center justify-between text-xs text-indigo-150">
              <span class="flex items-center gap-1">
                <ion-icon :icon="businessOutline" class="text-indigo-200" />
                <span class="font-extrabold tracking-wide uppercase text-[9px] text-indigo-200">{{ t('children.organization') || 'Center' }}:</span>
              </span>
              <span class="font-bold text-right max-w-[200px] truncate text-white">
                {{ child.organization?.name || t('children.no_org_assigned') || 'Universal Health Center' }}
              </span>
            </div>

            <!-- Authentic Stylized Barcode Scanning Band -->
            <div class="bg-white/95 rounded-xl p-2.5 flex flex-col items-center gap-1 shadow-inner mt-2">
              <div class="flex justify-between w-full h-7 items-stretch px-1">
                <div v-for="w in [2,1,3,1,2,4,1,2,1,3,1,2,1,4,2,1,3,1,2,1,2,4,1,3,1,2,1,1,3]" :key="w" 
                     :class="`bg-zinc-900 rounded-sm` + (w === 1 ? ' w-[1.5px]' : w === 2 ? ' w-[3px]' : w === 3 ? ' w-[5px]' : ' w-[7px]')"></div>
              </div>
              <span class="text-[9px] text-zinc-650 font-mono font-bold tracking-[4px] mt-0.5">{{ child.child_uid }}</span>
            </div>
          </div>
        </div>

        <!-- Vaccination Schedule Tracker Timeline (Theme-specific premium widget) -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div class="flex items-center gap-2">
              <ion-icon :icon="shieldCheckmarkOutline" class="text-lg text-indigo-600 dark:text-indigo-400" />
              <h3 class="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{{ t('vaccination.schedule') || 'Vaccine Milestones' }}</h3>
            </div>
            <span class="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
              {{ t('children.completed_status') || '25% Completed' }}
            </span>
          </div>

          <!-- Micro vaccine timeline -->
          <div class="space-y-4 pt-1">
            <div class="flex gap-3 relative">
              <!-- Vertical line -->
              <div class="absolute left-3.5 top-7 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800"></div>

              <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold z-10">
                ✓
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline">
                  <h4 class="text-xs font-bold text-zinc-800 dark:text-zinc-250">BCG & OPV-0</h4>
                  <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.25 rounded">{{ t('vaccination.completed') || 'Completed' }}</span>
                </div>
                <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Administered at Birth</p>
              </div>
            </div>

            <div class="flex gap-3 relative">
              <div class="absolute left-3.5 top-7 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800"></div>
              <div class="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold z-10 animate-pulse">
                •
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline">
                  <h4 class="text-xs font-bold text-indigo-600 dark:text-indigo-400">Penta-1, PCV-1, OPV-1</h4>
                  <span class="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.25 rounded">{{ t('vaccination.upcoming') || 'DUE' }}</span>
                </div>
                <p class="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Due at 6 Weeks (Next Vaccine)</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-650 flex items-center justify-center text-xs font-bold z-10">
                3
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline">
                  <h4 class="text-xs font-bold text-zinc-400 dark:text-zinc-600">Penta-2, PCV-2, OPV-2</h4>
                  <span class="text-[9px] font-bold text-zinc-450 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-850/50 px-1.5 py-0.25 rounded">10 Weeks</span>
                </div>
                <p class="text-[10px] text-zinc-400 dark:text-zinc-650 mt-0.5">Upcoming Milestones</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Health & Birth Profile Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="heartOutline" class="text-lg text-indigo-600 dark:text-indigo-400" />
            <h3 class="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{{ t('children.health_info') }}</h3>
          </div>

          <div class="grid grid-cols-2 gap-3.5">
            <div class="bg-zinc-55/50 dark:bg-zinc-800/30 p-3 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/30">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">{{ t('children.birth_weight') }}</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ child.birth_weight_kg ? `${child.birth_weight_kg} kg` : '--' }}
              </p>
            </div>
            <div class="bg-zinc-55/50 dark:bg-zinc-800/30 p-3 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/30">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">{{ t('children.birth_type') }}</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">
                {{ getBirthTypeLabel(child.birth_type) }}
              </p>
            </div>
            <div class="bg-zinc-55/50 dark:bg-zinc-800/30 p-3 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/30">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">{{ t('children.premature') }}</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ child.premature ? t('common.yes') : t('common.no') }}
              </p>
            </div>
            <div class="bg-zinc-55/50 dark:bg-zinc-800/30 p-3 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/30">
              <p class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">{{ t('children.disability') }}</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {{ child.disabled ? t('common.yes') : t('common.no') }}
              </p>
            </div>
          </div>

          <div v-if="child.disabled && child.disability_note" class="bg-red-50 dark:bg-red-950/10 p-3.5 rounded-2xl border border-red-100 dark:border-red-900/20 animate-slideDown">
            <p class="text-[9px] text-red-500 uppercase font-black tracking-wider">{{ t('children.disability_note') }}</p>
            <p class="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed font-semibold">{{ child.disability_note }}</p>
          </div>

          <div v-if="child.allergies" class="bg-amber-50/50 dark:bg-amber-950/10 p-3.5 rounded-2xl border border-amber-100/50 dark:border-amber-900/20">
            <p class="text-[9px] text-amber-600 dark:text-amber-500 uppercase font-black tracking-wider">{{ t('children.allergies') || 'Allergies' }}</p>
            <p class="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed font-semibold">{{ child.allergies }}</p>
          </div>

          <div v-if="child.medical_conditions" class="bg-zinc-55/50 dark:bg-zinc-800/30 p-3.5 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/30">
            <p class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">{{ t('children.medical_conditions') || 'Medical Conditions' }}</p>
            <p class="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed font-semibold">{{ child.medical_conditions }}</p>
          </div>
        </div>

        <!-- Location & Address Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <ion-icon :icon="locationOutline" class="text-lg text-indigo-600 dark:text-indigo-400" />
            <h3 class="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{{ t('children.address_info') }}</h3>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
              <span class="text-zinc-400 dark:text-zinc-500">{{ t('children.division') }}</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.division?.name || '--' }}</span>
            </div>
            <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
              <span class="text-zinc-400 dark:text-zinc-500">{{ t('children.district') }}</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.district?.name || '--' }}</span>
            </div>
            <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
              <span class="text-zinc-400 dark:text-zinc-500">{{ t('children.upazila') }}</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.upazila?.name || '--' }}</span>
            </div>
            <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
              <span class="text-zinc-400 dark:text-zinc-500">{{ t('children.union') }}</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.union?.name || '--' }}</span>
            </div>
            <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
              <span class="text-zinc-400 dark:text-zinc-500">{{ t('children.village') }}</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.village?.name || child.village_name || '--' }}</span>
            </div>
            <div class="flex flex-col gap-1.5 pt-1">
              <span class="text-zinc-400 dark:text-zinc-500 text-xs font-semibold">{{ t('children.address') }}</span>
              <p class="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                {{ child.address || '--' }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Not Found State -->
      <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center gap-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm max-w-md mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
          <ion-icon :icon="peopleOutline" class="text-3xl" />
        </div>
        <div>
          <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ t('children.not_found') }}</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">{{ t('children.not_found_sub') }}</p>
        </div>
        <ion-button
            style="--background: linear-gradient(to right, #4f46e5, #9333ea); --border-radius: 12px; --color: #fff;"
            class="h-11 font-bold text-xs px-6 mt-2 animate-bounce"
            @click="router.back()"
        >
          {{ t('common.go_back') }}
        </ion-button>
      </div>

      <!-- Edit Name Modal -->
      <ion-modal 
        :is-open="isEditModalOpen" 
        @didDismiss="closeEditModal"
        class="name-edit-modal-detail"
      >
        <div class="p-6 bg-white dark:bg-zinc-900 h-full flex flex-col justify-between">
          <div class="space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ t('children.edit_name') || 'Edit Child Name' }}</h2>
              <button @click="closeEditModal" class="bg-transparent border-0 text-zinc-400 dark:text-zinc-500 text-xl cursor-pointer flex">
                <ion-icon :icon="closeOutline" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Name (English) -->
              <my-input
                  v-model="editForm.name"
                  name="name"
                  :label="t('children.child_name')"
                  placeholder="John Doe"
                  :required="true"
                  validate="required|min:2|max:100"
              />

              <!-- Name (Bangla) -->
              <my-input
                  v-model="editForm.name_bn"
                  name="name_bn"
                  :label="t('children.child_name_bn')"
                  placeholder="জন ডো"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <ion-button 
              fill="outline" 
              color="medium" 
              shape="round" 
              class="flex-1 m-0"
              style="--border-radius: 12px; height: 48px; font-weight: 700;"
              @click="closeEditModal"
            >
              {{ t('common.cancel') }}
            </ion-button>
            <ion-button 
              color="primary" 
              shape="round" 
              class="flex-1 m-0"
              style="--border-radius: 12px; height: 48px; font-weight: 700; --background: linear-gradient(to right, #4f46e5, #9333ea);"
              @click="saveChildName"
            >
              {{ t('common.save') }}
            </ion-button>
          </div>
        </div>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, IonModal, toastController
} from '@ionic/vue'
import { 
  createOutline, copyOutline, businessOutline, heartOutline, 
  locationOutline, closeOutline, shieldCheckmarkOutline, peopleOutline
} from 'ionicons/icons'
import { useFunction, useStore } from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"
import MyInput from "@/components/MyInput.vue"

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useStore()
const { getData, submitData } = useFunction()

const child = ref(null)
const loading = ref(false)

// Edit Modal State
const isEditModalOpen = ref(false)
const editForm = reactive({
  name: '',
  name_bn: ''
})

onMounted(async () => {
  await fetchChildDetails()
})

const fetchChildDetails = async () => {
  try {
    loading.value = true
    const list = await getData({ url: 'children', rtn: true })
    if (list) {
      const found = list.find(c => c.id === Number(route.params.id))
      if (found) {
        child.value = found
      }
    }
  } catch (error) {
    console.error('Error fetching child details:', error)
  } finally {
    loading.value = false
  }
}

const copyUid = async (uid) => {
  try {
    await navigator.clipboard.writeText(uid)
    const toast = await toastController.create({
      message: t('common.copied') || 'Copied to clipboard!',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
  } catch (err) {
    console.error('Could not copy UID:', err)
  }
}

const openEditModal = () => {
  if (!child.value) return
  editForm.name = child.value.name
  editForm.name_bn = child.value.name_bn || ''
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editForm.name = ''
  editForm.name_bn = ''
}

const saveChildName = async () => {
  if (!editForm.name.trim() || !child.value) return

  try {
    const success = await submitData({
      url: `children/${child.value.id}/update-name`,
      data: { 
        name: editForm.name, 
        name_bn: editForm.name_bn 
      },
      reset: false
    })

    if (success) {
      closeEditModal()
      await fetchChildDetails()
    }
  } catch (error) {
    console.error('Error updating child name:', error)
  }
}

// Option labels resolvers
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

const formatDateString = (date) => {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
ion-modal.name-edit-modal-detail {
  --height: 380px;
  --border-radius: 20px;
  --box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
