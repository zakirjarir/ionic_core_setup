<template>
  <ion-page>
    <z-header :title="t('aefi.title')" />

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div class="max-w-md mx-auto px-4 py-5 space-y-6">

        <!-- Tabs Segment -->
        <div class="bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-2xl">
          <ion-segment v-model="activeTab" mode="ios" class="bg-transparent">
            <ion-segment-button value="report" class="rounded-xl font-bold py-2">
              <ion-label class="text-xs">{{ t('aefi.report_tab') }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="history" class="rounded-xl font-bold py-2">
              <ion-label class="text-xs">{{ t('aefi.history_tab') }}</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- ──────────────── Tab: Report Symptoms ──────────────── -->
        <div v-if="activeTab === 'report'" class="space-y-5">
          <!-- Form Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            <!-- Child Selector -->
            <my-input
              v-model="formData.child_id"
              type="select"
              name="child_id"
              :label="t('aefi.child_label')"
              :options="children"
              value-key="id"
              label-key="name"
              validate="required"
              @change="handleChildChange"
            />

            <!-- Vaccine Selector -->
            <div v-if="filteredCompletedVaccines.length > 0">
              <my-input
                v-model="formData.child_vaccination_id"
                type="select"
                name="child_vaccination_id"
                :label="t('aefi.vaccine_label')"
                :options="vaccineOptions"
                value-key="id"
                label-key="label"
                validate="required"
              />
            </div>
            <div v-else class="mb-6">
              <span class="ml-0.5 mr-1 text-sm text-zinc-400 dark:text-zinc-500 font-bold block mb-1.5 uppercase tracking-wider">
                {{ t('aefi.vaccine_label') }} *
              </span>
              <p class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3.5 rounded-2xl font-semibold mt-1 flex items-center gap-1.5 animate-fadeIn">
                <ion-icon :icon="alertCircleOutline" class="text-sm" />
                {{ t('aefi.no_completed_vaccines') }}
              </p>
            </div>

            <!-- Onset Date & Time -->
            <div class="grid grid-cols-2 gap-4">
              <my-input
                v-model="formData.onset_date"
                type="date"
                name="onset_date"
                :label="t('aefi.onset_date_label')"
                validate="required"
              />
              <my-input
                v-model="formData.onset_time"
                type="time"
                name="onset_time"
                :label="t('aefi.onset_time_label')"
                validate="required"
              />
            </div>

            <!-- Symptoms Input (Reaction Type) -->
            <my-input 
              v-model="formData.reaction_type" 
              name="reaction_type" 
              :label="t('aefi.reaction_type_label')"
              :placeholder="t('aefi.reaction_placeholder')"
              validate="required"
            />

            <!-- Severity selection -->
            <div class="mb-6">
              <label class="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2.5 uppercase tracking-wider">
                {{ t('aefi.severity_label') }} *
              </label>
              <div class="grid grid-cols-2 gap-3.5">
                <button
                  v-for="sev in ['mild', 'moderate', 'severe', 'fatal']"
                  :key="sev"
                  type="button"
                  class="severity-btn"
                  :class="formData.severity === sev ? `selected-${sev}` : 'unselected'"
                  @click="formData.severity = sev"
                >
                  <span class="severity-dot" :class="sev"></span>
                  <span class="flex-1 text-left">{{ t(`aefi.severity_${sev}`) }}</span>
                  <ion-icon 
                    v-if="formData.severity === sev" 
                    :icon="checkmarkCircleOutline" 
                    class="text-lg flex-shrink-0"
                  />
                </button>
              </div>
            </div>

            <!-- Outcome Selection -->
            <my-input
              v-model="formData.outcome"
              type="select"
              name="outcome"
              :label="t('aefi.outcome_label')"
              :options="outcomeOptions"
              value-key="id"
              label-key="label"
              validate="required"
            />

            <!-- Detailed Symptoms Description -->
            <my-input
              v-model="formData.symptoms"
              type="textarea"
              name="symptoms"
              :label="t('aefi.symptoms_label')"
              :placeholder="t('aefi.symptoms_placeholder')"
              validate="required"
              :rows="4"
            />

            <!-- Action Taken -->
            <my-input 
              v-model="formData.action_taken" 
              name="action_taken" 
              :label="t('aefi.action_taken_label')"
              :placeholder="t('aefi.action_taken_placeholder')"
            />

            <!-- Photos Upload -->
            <div class="mb-4">
              <label class="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2.5 uppercase tracking-wider">
                {{ t('aefi.photos_label') }}
              </label>
              
              <div class="flex flex-wrap gap-3">
                <!-- Preview Thumbnails -->
                <div 
                  v-for="(img, idx) in selectedImages" 
                  :key="idx" 
                  class="relative w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center flex-shrink-0"
                >
                  <img :src="img.localUrl" class="w-full h-full object-cover" />
                  
                  <!-- Loading overlay -->
                  <div v-if="img.uploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <ion-spinner name="crescent" color="light" class="w-5 h-5" />
                  </div>
                  
                  <!-- Delete button -->
                  <button 
                    v-else
                    type="button" 
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-sm z-10"
                    @click="removeImage(idx)"
                  >
                    <ion-icon :icon="trashOutline" class="text-xs" />
                  </button>
                </div>

                <!-- Upload trigger buttons -->
                <div v-if="selectedImages.length < 5" class="flex gap-2.5">
                  <!-- Camera Button -->
                  <button
                    type="button"
                    class="w-20 h-20 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/30 flex flex-col items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all cursor-pointer flex-shrink-0"
                    @click="takePhoto"
                  >
                    <ion-icon :icon="cameraOutline" class="text-xl" />
                    <span class="text-[9px] font-bold uppercase tracking-wider">{{ t('aefi.camera') }}</span>
                  </button>
                  
                  <!-- Gallery Button -->
                  <button
                    type="button"
                    class="w-20 h-20 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/30 flex flex-col items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all cursor-pointer flex-shrink-0"
                    @click="selectGallery"
                  >
                    <ion-icon :icon="imageOutline" class="text-xl" />
                    <span class="text-[9px] font-bold uppercase tracking-wider">{{ t('aefi.gallery') }}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Submit Button -->
          <ion-button
            expand="block"
            class="h-12 font-bold text-sm shadow-md"
            style="--background: linear-gradient(to right, #ef4444, #f97316); --border-radius: 16px; --color: #fff;"
            :disabled="submitting || filteredCompletedVaccines.length === 0"
            @click="submitReport"
          >
            <ion-spinner v-if="submitting" name="crescent" slot="start" class="text-white" />
            <ion-icon v-else :icon="alertCircleOutline" slot="start" />
            {{ t('aefi.submit_report') }}
          </ion-button>
        </div>

        <!-- ──────────────── Tab: Past Reports ──────────────── -->
        <div v-else class="space-y-4">
          <div v-if="loadingHistory" class="flex flex-col items-center justify-center py-20 gap-3">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ t('common.loading') }}</p>
          </div>

          <template v-else-if="reportsHistory.length > 0">
            <div 
              v-for="rep in reportsHistory" 
              :key="rep.id"
              class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-4 shadow-sm relative overflow-hidden"
            >
              <!-- Colored status stripe -->
              <div 
                class="absolute top-0 left-0 w-1.5 h-full"
                :class="rep.status === 'open' ? 'bg-amber-500' : rep.status === 'investigating' ? 'bg-indigo-500' : 'bg-emerald-500'"
              ></div>

              <div class="pl-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
                      {{ rep.reaction_type }}
                    </h4>
                    <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {{ rep.vaccination?.child?.name }} • 
                      {{ locale === 'bn' ? (rep.vaccination?.schedule?.vaccine?.name_bn || rep.vaccination?.schedule?.vaccine?.name) : rep.vaccination?.schedule?.vaccine?.name }}
                    </p>
                  </div>

                  <!-- Status badges -->
                  <div class="flex flex-col items-end gap-1.5">
                    <span 
                      class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      :class="rep.status === 'open' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : rep.status === 'investigating' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'"
                    >
                      {{ t(`aefi.status_${rep.status}`) }}
                    </span>
                    <span 
                      class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    >
                      {{ t(`aefi.severity_${rep.severity}`) }}
                    </span>
                  </div>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                  <div>
                    <span class="text-zinc-400 dark:text-zinc-500">{{ t('aefi.onset') }}:</span>
                    <p class="font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">{{ formatDate(rep.onset_date) }} {{ rep.onset_time ? rep.onset_time.substring(0, 5) : '' }}</p>
                  </div>
                  <div>
                    <span class="text-zinc-400 dark:text-zinc-500">{{ t('aefi.outcome') }}:</span>
                    <p class="font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 capitalize">{{ t(`aefi.outcome_${rep.outcome}`) }}</p>
                  </div>
                </div>

                <div class="mt-3 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl p-3">
                  <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">{{ t('aefi.symptoms_label') }}</span>
                  <p class="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-1 leading-normal whitespace-pre-line">{{ rep.symptoms }}</p>
                </div>

                <div v-if="rep.action_taken" class="mt-2 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl p-3">
                  <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">{{ t('aefi.action_taken_label') }}</span>
                  <p class="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-1 leading-normal">{{ rep.action_taken }}</p>
                </div>

                <!-- Attached Photos Preview -->
                <div v-if="rep.photos && rep.photos.length > 0" class="mt-3">
                  <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">{{ t('aefi.photos_label') }}</span>
                  <div class="flex gap-2 overflow-x-auto pb-1">
                    <div 
                      v-for="(photo, pIdx) in rep.photos" 
                      :key="pIdx"
                      class="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex-shrink-0"
                    >
                      <img :src="LFA(photo)" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="flex flex-col items-center justify-center py-16 px-6 text-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <ion-icon :icon="medkitOutline" class="text-3xl" />
            </div>
            <div>
              <h3 class="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {{ t('aefi.no_reports') }}
              </h3>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonSpinner, toastController,
  IonRefresher, IonRefresherContent
} from '@ionic/vue'
import {
  alertCircleOutline, chevronForwardOutline, checkmarkCircleOutline,
  timeOutline, calendarOutline, peopleOutline, bandageOutline, medkitOutline,
  cameraOutline, trashOutline, imageOutline
} from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import ZHeader from '@/components/ZHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { useCP, useFunction, useForm, useStore } from "@/composables/index.js"

const { t, locale } = useI18n()
const CP = useCP()
const F = useForm()
const store = useStore()
const { getData, submitData, formatDate, uploadImageDataUrl, LFA } = useFunction()

const activeTab = ref('report')
const children = ref([])
const completedVaccines = ref([])
const reportsHistory = ref([])
const selectedImages = ref([])

const loadingHistory = ref(true)
const submitting = ref(false)

const formData = ref({
  child_id: null,
  child_vaccination_id: null,
  reaction_type: '',
  severity: 'mild',
  onset_date: new Date().toISOString().substring(0, 10),
  onset_time: '12:00',
  symptoms: '',
  action_taken: '',
  outcome: 'unknown'
})

// Filter completed vaccines for the selected child
const filteredCompletedVaccines = computed(() => {
  if (!formData.value.child_id) return []
  return completedVaccines.value.filter(v => v.child_id === formData.value.child_id)
})

const vaccineOptions = computed(() => {
  return filteredCompletedVaccines.value.map(v => ({
    id: v.child_vaccination_id,
    label: `${locale.value === 'bn' ? (v.vaccine_name_bn || v.vaccine_name) : v.vaccine_name} - ${v.dose_name} (${v.givenDate})`
  }))
})

const outcomeOptions = computed(() => {
  return ['recovered', 'recovering', 'hospitalized', 'death', 'unknown'].map(out => ({
    id: out,
    label: t(`aefi.outcome_${out}`)
  }))
})



onMounted(async () => {
  // Load cached children and vaccinations list immediately
  const cachedVaccines = await CP.get('vaccination_list')
  if (cachedVaccines) {
    children.value = cachedVaccines.children || []
    completedVaccines.value = (cachedVaccines.vaccines || []).filter(v => v.status === 'completed' && v.child_vaccination_id)
    if (children.value.length > 0) {
      formData.value.child_id = children.value[0].id
      if (filteredCompletedVaccines.value.length > 0) {
        formData.value.child_vaccination_id = filteredCompletedVaccines.value[0].child_vaccination_id
      }
    }
  }

  // Load cached AEFI reports history
  const cachedAefi = await CP.get('cached_aefi_reports')
  if (cachedAefi) {
    reportsHistory.value = cachedAefi
    loadingHistory.value = false
  }

  // Sync data in background
  await syncData()
})

const handleRefresh = async (event) => {
  await syncData()
  event.target.complete()
}

const handleChildChange = () => {
  if (filteredCompletedVaccines.value.length > 0) {
    formData.value.child_vaccination_id = filteredCompletedVaccines.value[0].child_vaccination_id
  } else {
    formData.value.child_vaccination_id = null
  }
}

const syncData = async () => {
  try {
    // 1. Refresh vaccinations to make sure we have latest completed doses
    const vResult = await getData({ url: 'vaccinations', rtn: true })
    if (vResult) {
      children.value = vResult.children || []
      completedVaccines.value = (vResult.vaccines || []).filter(v => v.status === 'completed' && v.child_vaccination_id)
      await CP.set('vaccination_list', vResult)
      
      // Update form selections if empty
      if (!formData.value.child_id && children.value.length > 0) {
        formData.value.child_id = children.value[0].id
      }
      if (formData.value.child_id && !formData.value.child_vaccination_id && filteredCompletedVaccines.value.length > 0) {
        formData.value.child_vaccination_id = filteredCompletedVaccines.value[0].child_vaccination_id
      }
    }

    // 2. Refresh AEFI reports from backend
    const aefiResult = await getData({ url: 'aefi-reports', rtn: true })
    if (aefiResult) {
      reportsHistory.value = aefiResult
      await CP.set('cached_aefi_reports', aefiResult)
    }
  } catch (err) {
    console.error('Error syncing AEFI data:', err)
  } finally {
    loadingHistory.value = false
  }
}

const submitReport = async () => {
  // Validate using useForm
  const validate = await F.validate()
  if (!validate) return

  if (!formData.value.child_vaccination_id) {
    showToast(t('aefi.submit_error'), 'danger')
    return
  }

  submitting.value = true
  try {
    const res = await submitData({
      url: 'aefi-reports',
      data: {
        child_vaccination_id: formData.value.child_vaccination_id,
        reaction_type: formData.value.reaction_type,
        severity: formData.value.severity,
        onset_date: formData.value.onset_date,
        onset_time: formData.value.onset_time,
        symptoms: formData.value.symptoms,
        action_taken: formData.value.action_taken,
        outcome: formData.value.outcome,
        photos: selectedImages.value.map(img => img.serverPath).filter(Boolean)
      },
      rtn: true
    })

    if (res) {
      showToast(t('aefi.submit_success'), 'success')
      
      // Reset form fields but keep selectors
      formData.value.reaction_type = ''
      formData.value.symptoms = ''
      formData.value.action_taken = ''
      formData.value.severity = 'mild'
      formData.value.outcome = 'unknown'
      selectedImages.value = []

      // Switch to history tab and refresh
      activeTab.value = 'history'
      loadingHistory.value = true
      await syncData()
    } else {
      showToast(t('aefi.submit_error'), 'danger')
    }
  } catch (err) {
    console.error('Failed to submit AEFI:', err)
    showToast(t('aefi.submit_error'), 'danger')
  } finally {
    submitting.value = false
  }
}

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      width: 1024,
      height: 1024,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })
    if (image?.dataUrl) {
      await uploadImage(image.dataUrl)
    }
  } catch (err) {
    if (err.message !== 'User cancelled photos app') {
      console.error('Camera capture error:', err)
    }
  }
}

const selectGallery = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      width: 1024,
      height: 1024,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    })
    if (image?.dataUrl) {
      await uploadImage(image.dataUrl)
    }
  } catch (err) {
    if (err.message !== 'User cancelled photos app') {
      console.error('Gallery selection error:', err)
    }
  }
}

const uploadImage = async (dataUrl) => {
  const placeholder = { localUrl: dataUrl, serverPath: null, uploading: true }
  selectedImages.value.push(placeholder)
  try {
    const serverPath = await uploadImageDataUrl(dataUrl)
    if (serverPath) {
      placeholder.serverPath = serverPath
      placeholder.uploading = false
    } else {
      selectedImages.value = selectedImages.value.filter(img => img !== placeholder)
    }
  } catch (err) {
    console.error('Upload image error:', err)
    selectedImages.value = selectedImages.value.filter(img => img !== placeholder)
  }
}

const removeImage = (idx) => {
  selectedImages.value.splice(idx, 1)
}

const showToast = async (message, color) => {
  const toast = await toastController.create({
    message,
    duration: 3000,
    color,
    position: 'bottom',
    buttons: [
      {
        text: 'OK',
        role: 'cancel'
      }
    ]
  })
  await toast.present()
}
</script>

<style scoped>
/* Custom transitions and styling */
* {
  transition: all 0.2s ease-in-out;
}

.severity-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  font-weight: 700;
  font-size: 14px;
  text-transform: capitalize;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}
.severity-btn:active {
  transform: scale(0.96);
}

.severity-btn.unselected {
  background-color: var(--ion-color-zinc-50, #fafafa);
  border-color: var(--ion-color-zinc-200, #e4e4e7);
  color: var(--ion-color-zinc-600, #52525b);
}
.severity-btn.unselected:hover {
  background-color: var(--ion-color-zinc-100, #f4f4f5);
}

.dark .severity-btn.unselected {
  background-color: rgba(9, 9, 11, 0.6);
  border-color: var(--ion-color-zinc-800, #27272a);
  color: var(--ion-color-zinc-400, #a1a1aa);
}
.dark .severity-btn.unselected:hover {
  background-color: rgba(24, 24, 27, 0.8);
}

/* Selected states */
.severity-btn.selected-mild {
  background-color: #10b981;
  border-color: #10b981;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}
.severity-btn.selected-moderate {
  background-color: #f59e0b;
  border-color: #f59e0b;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
}
.severity-btn.selected-severe {
  background-color: #f97316;
  border-color: #f97316;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
}
.severity-btn.selected-fatal {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
}

/* Dots styling */
.severity-dot {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  flex-shrink: 0;
  transition: background-color 0.15s ease;
}
.severity-dot.mild { background-color: #10b981; }
.severity-dot.moderate { background-color: #f59e0b; }
.severity-dot.severe { background-color: #f97316; }
.severity-dot.fatal { background-color: #ef4444; }

.severity-btn[class*="selected-"] .severity-dot {
  background-color: #ffffff !important;
}
</style>
