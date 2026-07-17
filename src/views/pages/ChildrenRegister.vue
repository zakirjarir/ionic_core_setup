<template>
  <ion-page>
    <z-header :title="isEditMode ? t('children.edit_child') : t('children.add_child')"/>

    <ion-content>
      <div class="max-w-md mx-auto px-4 py-4">

        <!-- Stepper -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-5">
          <div class="flex items-center justify-between relative">
            <!-- Progress bar background -->
            <div class="absolute top-[18px] left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-700" style="margin: 0 20px;"></div>
            <!-- Progress bar fill -->
            <div class="absolute top-[18px] left-0 h-0.5 bg-indigo-500 transition-all duration-500"
                 :style="{ width: progressWidth + '%', marginLeft: '20px' }"></div>

            <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center relative z-10">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                   :class="index <= currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'">
                <ion-icon v-if="index < currentStep" :icon="checkmarkOutline" class="text-lg" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-[10px] font-medium mt-1.5 whitespace-nowrap"
                    :class="index <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'">
                {{ step }}
              </span>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">

          <!-- STEP 1: General Info -->
          <div v-if="currentStep === 0">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ t('children.section_general_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ t('children.section_general_sub') }}</p>
            </div>

            <!-- Photo Upload -->
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
              <div class="relative">
                <div class="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-lg">
                  <img v-if="photoPreview || store.formData.photo"
                       :src="photoPreview || LFA(store.formData.photo)"
                       class="w-full h-full rounded-full object-cover" alt="Profile photo" />
                  <ion-icon v-else :icon="personCircleOutline" class="text-6xl text-zinc-300 dark:text-zinc-600" />
                </div>
                <ion-button @click="showImagePicker = true" color="primary" shape="round" class="absolute bottom-0 right-0 m-0"
                            style="--border-radius:50%; width:36px; height:36px; --padding-start:0; --padding-end:0; --min-height:36px; --padding-top:0; --padding-bottom:0;">
                  <ion-icon :icon="cameraOutline" slot="icon-only" class="text-base" />
                </ion-button>
              </div>
              <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{{ t('children.photo_upload') }}</p>
            </div>

            <div class="p-5 space-y-4">
              <my-input
                  v-model="store.formData.name"
                  name="name"
                  :label="t('children.child_name')"
                  placeholder="John Doe"
                  :required="true"
                  validate="required|min:2|max:100"
              />

              <my-input
                  v-model="store.formData.name_bn"
                  name="name_bn"
                  :label="t('children.child_name_bn')"
                  :placeholder="t('children.child_name_bn')"
              />

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    v-model="store.formData.dob"
                    type="date"
                    name="dob"
                    :label="t('children.date_of_birth')"
                    :required="true"
                    validate="required|before_today"
                />

                <my-input
                    v-model="store.formData.gender"
                    name="gender"
                    type="select"
                    :placeholder="t('children.gender')"
                    :label="t('children.gender')"
                    :options="store?.genders || []"
                    validate="required"
                    value-key="value"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    v-model="store.formData.blood_group"
                    type="select"
                    :placeholder="t('children.blood_group')"
                    :label="t('children.blood_group')"
                    :options="store?.bloodGroups || []"
                    value-key="value"
                    name="blood_group"
                />

                <my-input
                    v-model="store.formData.birth_weight_kg"
                    type="number"
                    :step="0.01"
                    :label="t('children.birth_weight')"
                    :placeholder="t('children.birth_weight_placeholder')"
                    validate="min_number:0.1|max_number:10"
                />
              </div>

              <my-input
                  type="select"
                  v-model="store.formData.birth_type"
                  :options="store?.birthTypes || []"
                  :label="t('children.birth_type')"
                  :placeholder="t('children.birth_type')"
                  validate="required"
                  name="birth_type"
                  value-key="value"
              />

              <div class="space-y-3">
                <my-input
                    type="checkbox"
                    v-model="store.formData.premature"
                    :label="t('children.premature')"
                />

                <my-input
                    type="checkbox"
                    v-model="store.formData.disabled"
                    :label="t('children.disability')"
                />
              </div>

              <div v-if="store.formData.disabled" class="animate-slideDown">
                <my-input
                    v-model="store.formData.disability_note"
                    :placeholder="t('children.disability_note_placeholder')"
                    :label="t('children.disability_note')"
                    validate="required|min:3|max:500"
                    :rows="3"
                    name="disability_note"
                />
              </div>
            </div>
          </div>

          <!-- STEP 2: Address -->
          <div v-if="currentStep === 1">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ t('children.section_address_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ t('children.section_address_sub') }}</p>
            </div>
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <my-input
                    type="select"
                    v-model="store.formData.division_id"
                    :options="store?.generalData?.divisions || []"
                    :label="t('children.division')"
                    :placeholder="t('children.division')"
                    @change="
                    store.formData.district_id = '';
                    store.formData.upazila_id = '';
                    store.formData.union_id = '';
                    getGeneralData({ districts: { division_id: store.formData.division_id } })"
                    validate="required"
                    name="division_id"
                />

                <my-input
                    type="select"
                    v-model="store.formData.district_id"
                    :options="store?.generalData?.districts || []"
                    :label="t('children.district')"
                    :placeholder="t('children.district')"
                    @change="
                    store.formData.upazila_id = '';
                    store.formData.union_id = '';
                    getGeneralData({ upazilas: { district_id: store.formData.district_id } })"
                    validate="required"
                    name="district_id"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    type="select"
                    v-model="store.formData.upazila_id"
                    :options="store?.generalData?.upazilas || []"
                    :label="t('children.upazila')"
                    :placeholder="t('children.upazila')"
                    @change="
                    store.formData.union_id = ''
                     store.formData.village_id = '';
                    getGeneralData({ unions: { upazila_id: store.formData.upazila_id } })"
                />

                <my-input
                    type="select"
                    v-model="store.formData.union_id"
                    :options="store?.generalData?.unions || []"
                    :label="t('children.union')"
                    :placeholder="t('children.union')"
                    @change="
                    store.formData.village_id = '';
                    getGeneralData({ villages: { union_id: store.formData.union_id } })"
                />
              </div>

              <my-input
                  type="select"
                  v-model="store.formData.village_id"
                  :options="store?.generalData?.villages || []"
                  :label="t('children.village')"
                  :placeholder="t('children.village')"
              />

              <my-input v-if="!store.formData.village_id"
                  v-model="store.formData.post_code"
                  :label="t('children.post_code')"
                  :placeholder="t('children.post_code_placeholder')"
                  validate="min:2|max:100"
              />

              <my-input
                  type="textarea"
                  v-model="store.formData.address"
                  :label="t('children.address')"
                  :placeholder="t('children.address_placeholder')"
                  :rows="3"
                  validate="min:5|max:500"
                  name="address"
              />
            </div>
          </div>

          <!-- STEP 3: Confirmation -->
          <div v-if="currentStep === 2">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ t('children.section_confirm_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ t('children.section_confirm_sub') }}</p>
            </div>
            <div class="p-5">
              <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center border-2 border-white dark:border-zinc-700 shadow">
                    <img v-if="photoPreview || store.formData.photo"
                         :src="photoPreview || LFA(store.formData.photo)"
                         class="w-full h-full rounded-full object-cover" alt="Profile photo" />
                    <ion-icon v-else :icon="personCircleOutline" class="text-4xl text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-zinc-900 dark:text-zinc-50 truncate">{{ store.formData.name || t('children.no_data_label') }}</h3>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      {{ store.formData.dob ? formatDate(store.formData.dob) : '--' }}
                      <span v-if="store.formData.gender">• {{ getGenderLabel(store.formData.gender) }}</span>
                    </p>
                  </div>
                </div>
                <div class="space-y-2 text-sm">
                  <div v-for="row in summaryRows" :key="row.label" class="flex justify-between border-b border-indigo-100 dark:border-indigo-800/50 pb-1.5 last:border-0 last:pb-0">
                    <span class="text-zinc-500 dark:text-zinc-400">{{ row.label }}</span>
                    <span class="font-medium text-zinc-900 dark:text-zinc-50 text-right ml-4">{{ row.value || '--' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex gap-3">
          <ion-button v-if="currentStep > 0" @click="currentStep--" color="light" shape="round" class="w-1/3 m-0"
                      style="--border-radius:1rem; --padding-top:1rem; --padding-bottom:1rem;">
            <ion-icon :icon="arrowBackOutline" slot="start" />
            {{ t('children.prev') }}
          </ion-button>
          <ion-button @click="goToNext" color="primary" shape="round" class="flex-1 m-0"
                      style="--border-radius:1rem; --padding-top:1rem; --padding-bottom:1rem; --background: linear-gradient(to right, #4f46e5, #9333ea);">
            {{ currentStep === steps.length - 1 ? t('common.submit') : t('common.next') }}
            <ion-icon v-if="currentStep < steps.length - 1" :icon="arrowForwardOutline" slot="end" />
            <ion-icon v-else :icon="checkmarkCircleOutline" slot="end" />
          </ion-button>
        </div>

        <div class="flex items-center justify-center gap-2 py-4">
          <ion-icon :icon="lockClosedOutline" class="text-sm text-zinc-400 dark:text-zinc-500" />
          <p class="text-xs text-zinc-500 dark:text-zinc-400 text-center">{{ t('children.secure_note') }}</p>
        </div>
      </div>
    </ion-content>

    <!-- Modals -->
    <ImagePickerModal
        v-model:is-open="showImagePicker"
        :has-image="!!(photoPreview || store.formData.photo)"
        :current-image-path="store.formData.photo"
        @image-selected="handleImageSelected"
        @image-deleted="handleImageDeleted"
        :edit="true"
    />

  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, toastController, onIonViewWillEnter
} from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MyInput from '@/components/MyInput.vue'
import ImagePickerModal from '@/components/ImagePickerModal.vue'
import {
  arrowBackOutline, arrowForwardOutline, checkmarkOutline, checkmarkCircleOutline,
  personCircleOutline, cameraOutline, lockClosedOutline
} from 'ionicons/icons'
import {useForm, useFunction, useStore, useCP} from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const store = useStore()
const {validate} = useForm()

const { getGeneralData, submitData, getData, fileRemove, LFA } = useFunction()
const CP = useCP()

const steps = computed(() => [
  t('children.step_general'),
  t('children.step_address'),
  t('children.step_confirm')
])

const currentStep = ref(0)
const showImagePicker = ref(false)
const photoPreview = ref(null) // local dataUrl preview
const CP_DRAFT_KEY = 'child_register_draft_photo'

const isEditMode = computed(() => !!route.params.id)

const progressWidth = computed(() => (currentStep.value / (steps.value.length - 1)) * 100)

// Summary rows for confirmation
const summaryRows = computed(() => {
  const rows = [
    { label: t('children.child_name'), value: store.formData.name },
    { label: t('children.child_name_bn'), value: store.formData.name_bn || '--' },
    { label: t('children.date_of_birth'), value: store.formData.dob ? formatDate(store.formData.dob) : '--' },
    { label: t('children.gender'), value: getGenderLabel(store.formData.gender) },
    { label: t('children.blood_group'), value: getBloodGroupLabel(store.formData.blood_group) || '--' },
    { label: t('children.birth_weight'), value: store.formData.birth_weight_kg ? `${store.formData.birth_weight_kg} kg` : '--' },
    { label: t('children.birth_type'), value: getBirthTypeLabel(store.formData.birth_type) || '--' },
    { label: t('children.premature'), value: store.formData.premature ? t('common.yes') : t('common.no') },
    { label: t('children.disability'), value: store.formData.disabled ? t('common.yes') : t('common.no') },
  ]

  if (store.formData.disabled) {
    rows.push({ label: t('children.disability_note'), value: store.formData.disability_note || '--' })
  }

  rows.push(
      { label: t('children.division'), value: getDivisionLabel(store.formData.division_id) || '--' },
      { label: t('children.district'), value: getDistrictLabel(store.formData.district_id) || '--' },
      { label: t('children.upazila'), value: getUpazilaLabel(store.formData.upazila_id) || '--' },
      { label: t('children.union'), value: getUnionLabel(store.formData.union_id) || '--' },
      { label: t('children.post_code'), value: store.formData.post_code || '--' },
      { label: t('children.address'), value: store.formData.address || '--' }
  )

  return rows
})

// Helper functions
const formatDate = (date) => {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getGenderLabel = (value) => {
  const genders = store?.genders || []
  const found = genders.find(g => g.value === value || g.id === value)
  return found?.label || found?.name || value || '--'
}

const getBloodGroupLabel = (value) => {
  const groups = store?.bloodGroups || []
  const found = groups.find(g => g.value === value || g.id === value)
  return found?.label || found?.name || value
}

const getBirthTypeLabel = (value) => {
  const types = store?.birthTypes || []
  const found = types.find(t => t.value === value || t.id === value)
  return found?.label || found?.name || value
}

const getDivisionLabel = (id) => {
  const divisions = store?.generalData?.divisions || []
  const found = divisions.find(d => d.id === id || d.value === id)
  return found?.name || found?.label
}
const getDistrictLabel = (id) => {
  const districts = store?.generalData?.districts || []
  const found = districts.find(d => d.id === id || d.value === id)
  return found?.name || found?.label
}

const getUpazilaLabel = (id) => {
  const upazilas = store?.generalData?.upazilas || []
  const found = upazilas.find(u => u.id === id || u.value === id)
  return found?.name || found?.label
}

const getUnionLabel = (id) => {
  const unions = store?.generalData?.unions || []
  const found = unions.find(u => u.id === id || u.value === id)
  return found?.name || found?.label
}


// Image handlers
const handleImageSelected = async ({ serverPath, dataUrl }) => {
  // server path form data তে save করো
  store.formData.photo = serverPath
  // local preview এর জন্য dataUrl রাখো
  photoPreview.value = dataUrl
  if (!isEditMode.value) {
    // submitForm পর্যন্ত CP তে draft রাখো
    await CP.set(CP_DRAFT_KEY, { serverPath, dataUrl })
  }
}

const handleImageDeleted = async () => {
  // server থেকে file delete করো
  if (store.formData.photo) {
    await fileRemove(null, null, store.formData.photo)
  }
  store.formData.photo = null
  photoPreview.value = null
  if (!isEditMode.value) {
    await CP.remove(CP_DRAFT_KEY)
  }
}

// Validation
const validateStep = async () => {
  if (currentStep.value === 0 || currentStep.value === 1) {
    return await validate()
  }
  return true
}

const goToNext = async () => {
  const valid = await validateStep()
  if (!valid) return

  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  } else {
    submitForm()
  }
}
const submitForm = async () => {
  try {
    const url = isEditMode.value ? `children/${route.params.id}/update` : 'create_children'
    const success = await submitData({
      url: url,
      data: { ...store.formData },
      reset: !isEditMode.value,
    })
    if (success) {
      if (!isEditMode.value) {
        // success হলে CP draft মুছে দাও
        await CP.remove(CP_DRAFT_KEY)
      }
      photoPreview.value = null
      currentStep.value = 0
      router.back()
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}


// Lifecycle
onIonViewWillEnter(async () => {
  if (isEditMode.value) {
    const childId = Number(route.params.id)
    try {
      store.loading = true
      const list = await getData({ url: 'children', rtn: true })
      if (list) {
        const found = list.find(c => c.id === childId)
        if (found) {
          store.formData = {
            name: found.name,
            name_bn: found.name_bn,
            nickname: found.nickname,
            dob: found.dob,
            gender: found.gender,
            blood_group: found.blood_group,
            birth_weight_kg: found.birth_weight_kg,
            birth_type: found.birth_type,
            premature: !!found.premature,
            disabled: !!found.disabled,
            disability_note: found.disability_note,
            allergies: found.allergies,
            medical_conditions: found.medical_conditions,
            division_id: found.division_id,
            district_id: found.district_id,
            upazila_id: found.upazila_id,
            union_id: found.union_id,
            village_id: found.village_id,
            post_code: found.post_code,
            address: found.address,
            photo: found.photo
          }
          if (found.photo) {
            photoPreview.value = LFA(found.photo)
          } else {
            photoPreview.value = null
          }

          // Fetch Address Hierarchy
          await getGeneralData({
            divisions: {},
            districts: { division_id: found.division_id },
            upazilas: { district_id: found.district_id },
            unions: { upazila_id: found.upazila_id },
            villages: { union_id: found.union_id }
          })
        }
      }
    } catch (err) {
      console.error("Error loading child for edit:", err)
    } finally {
      store.loading = false
    }
  } else {
    getGeneralData(['divisions'])
    store.formData = {
      name: '',
      name_bn: '',
      nickname: '',
      dob: '',
      gender: '',
      blood_group: '',
      birth_weight_kg: '',
      birth_type: 'normal_delivery',
      premature: false,
      disabled: false,
      disability_note: '',
      allergies: '',
      medical_conditions: '',
      division_id: '',
      district_id: '',
      upazila_id: '',
      union_id: '',
      village_id: '',
      post_code: '',
      address: '',
      photo: null
    }
    photoPreview.value = null
    // CP তে save করা draft photo restore করো
    const draft = await CP.get(CP_DRAFT_KEY)
    if (draft?.serverPath) {
      store.formData.photo = draft.serverPath
      photoPreview.value = draft.dataUrl || null
    }
  }
})
</script>

<style scoped>

</style>