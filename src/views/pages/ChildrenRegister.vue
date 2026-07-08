<template>
  <ion-page>
    <z-header :title="$t('children.add_child')"/>

    <ion-content class="bg-[#F5F6FA] dark:bg-zinc-950">
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

          <!-- STEP 1: Child General Info -->
          <div v-show="currentStep === 0">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ $t('children.section_general_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('children.section_general_sub') }}</p>
            </div>

            <!-- Photo Upload -->
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
              <div class="relative">
                <div class="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-lg">
                  <img v-if="formData.photo" :src="formData.photo" class="w-full h-full rounded-full object-cover" alt="Profile photo" />
                  <ion-icon v-else :icon="personCircleOutline" class="text-6xl text-zinc-300 dark:text-zinc-600" />
                </div>
                <ion-button @click="showImagePicker = true" color="primary" shape="round" class="absolute bottom-0 right-0 m-0"
                            style="--border-radius:50%; width:36px; height:36px; --padding-start:0; --padding-end:0; --min-height:36px; --padding-top:0; --padding-bottom:0;">
                  <ion-icon :icon="cameraOutline" slot="icon-only" class="text-base" />
                </ion-button>
              </div>
              <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{{ $t('children.photo_upload') }}</p>
            </div>

            <div class="p-5 space-y-4">
              <my-input
                  v-model="formData.name"
                  name="name"
                  :label="$t('children.child_name')"
                  placeholder="John Doe"
                  :required="true"
                  validate="required|min:2|max:100"
                  :error="errors.name"
              />

              <my-input
                  v-model="formData.name_bn"
                  name="name_bn"
                  :label="$t('children.child_name_bn')"
                  :placeholder="$t('children.child_name_bn')"
              />

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    v-model="formData.dob"
                    type="date"
                    name="dob"
                    :label="$t('children.date_of_birth')"
                    :required="true"
                    :error="errors.dob"
                    validate="required"
                />

                <my-input
                    v-model="formData.gender"
                    name="gender"
                    type="select"
                    :placeholder="$t('children.gender')"
                    :label="$t('children.gender')"
                    :options="store?.genders || []"
                    validate="required"
                    :error="errors.gender"
                    value-key="value"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    v-model="formData.blood_group"
                    type="select"
                    :placeholder="$t('children.blood_group')"
                    :label="$t('children.blood_group')"
                    :options="store?.bloodGroups || []"
                    value-key="value"
                />

                <my-input
                    v-model="formData.birth_weight_kg"
                    type="number"
                    step="0.01"
                    :label="$t('children.birth_weight')"
                    :placeholder="$t('children.birth_weight_placeholder')"
                    validate="min_number:0.1|max_number:10"
                />
              </div>

              <my-input
                  type="select"
                  v-model="formData.birth_type"
                  :options="store?.birthTypes || []"
                  :label="$t('children.birth_type')"
                  :placeholder="$t('children.birth_type')"
                  validate="required"
                  name="birth_type"
                  :error="errors.birth_type"
                  value-key="value"
              />

              <div class="space-y-3">
                <my-input
                    type="checkbox"
                    v-model="formData.premature"
                    :label="$t('children.premature')"
                />

                <my-input
                    type="checkbox"
                    v-model="formData.disabled"
                    :label="$t('children.disability')"
                />
              </div>

              <div v-if="formData.disabled" class="animate-slideDown">
                <my-input
                    v-model="formData.disability_note"
                    :placeholder="$t('children.disability_note_placeholder')"
                    :label="$t('children.disability_note')"
                    validate="required|min:3|max:500"
                    :rows="3"
                    :error="errors.disability_note"
                />
              </div>
            </div>
          </div>

          <!-- STEP 2: Address -->
          <div v-show="currentStep === 1">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ $t('children.section_address_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('children.section_address_sub') }}</p>
            </div>
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <my-input
                    type="select"
                    v-model="formData.division_id"
                    :options="store?.generalData?.divisions || []"
                    :label="$t('children.division')"
                    :placeholder="$t('children.division')"
                    @update:modelValue="onDivisionChange"
                    validate="required"
                    :error="errors.division_id"
                />

                <my-input
                    type="select"
                    v-model="formData.district_id"
                    :options="store?.generalData?.districts || []"
                    :label="$t('children.district')"
                    :placeholder="$t('children.district')"
                    @update:modelValue="onDistrictChange"
                    validate="required"
                    :error="errors.district_id"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <my-input
                    type="select"
                    v-model="formData.upazila_id"
                    :options="store?.generalData?.upazilas || []"
                    :label="$t('children.upazila')"
                    :placeholder="$t('children.upazila')"
                    @update:modelValue="onUpazilaChange"
                />

                <my-input
                    type="select"
                    v-model="formData.union_id"
                    :options="store?.generalData?.unions || []"
                    :label="$t('children.union')"
                    :placeholder="$t('children.union')"
                />
              </div>

              <my-input
                  v-model="formData.village_name"
                  :label="$t('children.village_name')"
                  :placeholder="$t('children.village_placeholder')"
                  validate="min:2|max:100"
              />

              <my-input
                  type="textarea"
                  v-model="formData.address"
                  :label="$t('children.address')"
                  :placeholder="$t('children.address_placeholder')"
                  :rows="3"
                  validate="min:5|max:500"
                  :error="errors.address"
              />
            </div>
          </div>

          <!-- STEP 3: Confirmation -->
          <div v-show="currentStep === 2">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ $t('children.section_confirm_title') }}</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('children.section_confirm_sub') }}</p>
            </div>
            <div class="p-5">
              <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center border-2 border-white dark:border-zinc-700 shadow">
                    <img v-if="formData.photo" :src="formData.photo" class="w-full h-full rounded-full object-cover" alt="Profile photo" />
                    <ion-icon v-else :icon="personCircleOutline" class="text-4xl text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-zinc-900 dark:text-zinc-50 truncate">{{ formData.name || $t('children.no_data_label') }}</h3>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      {{ formData.dob ? formatDate(formData.dob) : '--' }}
                      <span v-if="formData.gender">• {{ getGenderLabel(formData.gender) }}</span>
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
            {{ $t('children.prev') }}
          </ion-button>
          <ion-button @click="goToNext" color="primary" shape="round" class="flex-1 m-0"
                      style="--border-radius:1rem; --padding-top:1rem; --padding-bottom:1rem; --background: linear-gradient(to right, #4f46e5, #9333ea);">
            {{ currentStep === steps.length - 1 ? $t('common.submit') : $t('common.next') }}
            <ion-icon v-if="currentStep < steps.length - 1" :icon="arrowForwardOutline" slot="end" />
            <ion-icon v-else :icon="checkmarkCircleOutline" slot="end" />
          </ion-button>
        </div>

        <div class="flex items-center justify-center gap-2 py-4">
          <ion-icon :icon="lockClosedOutline" class="text-sm text-zinc-400 dark:text-zinc-500" />
          <p class="text-xs text-zinc-500 dark:text-zinc-400 text-center">{{ $t('children.secure_note') }}</p>
        </div>
      </div>
    </ion-content>

    <!-- Modals -->
    <ImagePickerModal
        v-model:is-open="showImagePicker"
        :has-image="!!formData.photo"
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MyInput from '@/components/MyInput.vue'
import ImagePickerModal from '@/components/ImagePickerModal.vue'
import {
  arrowBackOutline, arrowForwardOutline, checkmarkOutline, checkmarkCircleOutline,
  personCircleOutline, cameraOutline, lockClosedOutline
} from 'ionicons/icons'
import { useFunction, useStore } from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"

const router = useRouter()
const { t } = useI18n()
const store = useStore()
const { getGeneralData } = useFunction()

const steps = computed(() => [
  t('children.step_general'),
  t('children.step_address'),
  t('children.step_confirm')
])

const currentStep = ref(0)
const showImagePicker = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  name: '',
  name_bn: '',
  photo: null,
  dob: '',
  gender: '',
  blood_group: '',
  birth_weight_kg: '',
  birth_type: 'normal',
  premature: false,
  disabled: false,
  disability_note: '',
  division_id: '',
  district_id: '',
  upazila_id: '',
  union_id: '',
  village_name: '',
  address: ''
})

const errors = ref({
  name: '',
  dob: '',
  gender: '',
  birth_type: '',
  division_id: '',
  district_id: '',
  address: '',
  disability_note: ''
})

const progressWidth = computed(() => (currentStep.value / (steps.value.length - 1)) * 100)

// Summary rows for confirmation
const summaryRows = computed(() => {
  const rows = [
    { label: t('children.child_name'), value: formData.value.name },
    { label: t('children.child_name_bn'), value: formData.value.name_bn || '--' },
    { label: t('children.date_of_birth'), value: formData.value.dob ? formatDate(formData.value.dob) : '--' },
    { label: t('children.gender'), value: getGenderLabel(formData.value.gender) },
    { label: t('children.blood_group'), value: getBloodGroupLabel(formData.value.blood_group) || '--' },
    { label: t('children.birth_weight'), value: formData.value.birth_weight_kg ? `${formData.value.birth_weight_kg} kg` : '--' },
    { label: t('children.birth_type'), value: getBirthTypeLabel(formData.value.birth_type) || '--' },
    { label: t('children.premature'), value: formData.value.premature ? t('common.yes') : t('common.no') },
    { label: t('children.disability'), value: formData.value.disabled ? t('common.yes') : t('common.no') },
  ]

  if (formData.value.disabled) {
    rows.push({ label: t('children.disability_note'), value: formData.value.disability_note || '--' })
  }

  rows.push(
      { label: t('children.division'), value: getDivisionLabel(formData.value.division_id) || '--' },
      { label: t('children.district'), value: getDistrictLabel(formData.value.district_id) || '--' },
      { label: t('children.upazila'), value: getUpazilaLabel(formData.value.upazila_id) || '--' },
      { label: t('children.union'), value: getUnionLabel(formData.value.union_id) || '--' },
      { label: t('children.village_name'), value: formData.value.village_name || '--' },
      { label: t('children.address'), value: formData.value.address || '--' }
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
  const genders = store.value?.genders || []
  const found = genders.find(g => g.value === value || g.id === value)
  return found?.label || found?.name || value || '--'
}

const getBloodGroupLabel = (value) => {
  const groups = store.value?.bloodGroups || []
  const found = groups.find(g => g.value === value || g.id === value)
  return found?.label || found?.name || value
}

const getBirthTypeLabel = (value) => {
  const types = store.value?.birthTypes || []
  const found = types.find(t => t.value === value || t.id === value)
  return found?.label || found?.name || value
}

const getDivisionLabel = (id) => {
  const divisions = store.value?.generalData?.divisions || []
  const found = divisions.find(d => d.id === id || d.value === id)
  return found?.name || found?.label
}

const getDistrictLabel = (id) => {
  const districts = store.value?.generalData?.districts || []
  const found = districts.find(d => d.id === id || d.value === id)
  return found?.name || found?.label
}

const getUpazilaLabel = (id) => {
  const upazilas = store.value?.generalData?.upazilas || []
  const found = upazilas.find(u => u.id === id || u.value === id)
  return found?.name || found?.label
}

const getUnionLabel = (id) => {
  const unions = store.value?.generalData?.unions || []
  const found = unions.find(u => u.id === id || u.value === id)
  return found?.name || found?.label
}

// Location change handlers
const onDivisionChange = (value) => {
  formData.value.district_id = ''
  formData.value.upazila_id = ''
  formData.value.union_id = ''
  if (value) {
    getGeneralData({ districts: { division_id: value } })
  }
}

const onDistrictChange = (value) => {
  formData.value.upazila_id = ''
  formData.value.union_id = ''
  if (value) {
    getGeneralData({ upazilas: { district_id: value } })
  }
}

const onUpazilaChange = (value) => {
  formData.value.union_id = ''
  if (value) {
    getGeneralData({ unions: { upazila_id: value } })
  }
}

// Image handlers
const handleImageSelected = (imageData) => {
  formData.value.photo = imageData
}

const handleImageDeleted = () => {
  formData.value.photo = null
}

// Validation
const validateStep = () => {
  // Clear previous errors
  Object.keys(errors.value).forEach(key => errors.value[key] = '')

  let valid = true

  if (currentStep.value === 0) {
    if (!formData.value.name?.trim()) {
      errors.value.name = t('validation.field_required', { field: t('children.child_name') })
      valid = false
    }
    if (!formData.value.dob) {
      errors.value.dob = t('validation.field_required', { field: t('children.date_of_birth') })
      valid = false
    }
    if (!formData.value.gender) {
      errors.value.gender = t('validation.field_required', { field: t('children.gender') })
      valid = false
    }
    if (!formData.value.birth_type) {
      errors.value.birth_type = t('validation.field_required', { field: t('children.birth_type') })
      valid = false
    }
    if (formData.value.disabled && !formData.value.disability_note?.trim()) {
      errors.value.disability_note = t('validation.field_required', { field: t('children.disability_note') })
      valid = false
    }
  } else if (currentStep.value === 1) {
    if (!formData.value.division_id) {
      errors.value.division_id = t('validation.field_required', { field: t('children.division') })
      valid = false
    }
    if (!formData.value.district_id) {
      errors.value.district_id = t('validation.field_required', { field: t('children.district') })
      valid = false
    }
    if (!formData.value.address?.trim()) {
      errors.value.address = t('validation.field_required', { field: t('children.address') })
      valid = false
    }
  }

  return valid
}

const goToNext = () => {
  if (!validateStep()) return

  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  } else {
    submitForm()
  }
}

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    console.log('Submitting form data:', formData.value)

    // TODO: API call to submit form
    // const response = await submitChild(formData.value)

    const toast = await toastController.create({
      message: t('children.register_success'),
      duration: 3000,
      color: 'success',
      position: 'top'
    })
    await toast.present()

    router.back()
  } catch (error) {
    console.error('Error submitting form:', error)
    const toast = await toastController.create({
      message: t('children.register_error'),
      duration: 3000,
      color: 'danger',
      position: 'top'
    })
    await toast.present()
  } finally {
    isSubmitting.value = false
  }
}




// Lifecycle
onIonViewWillEnter(() => {
  getGeneralData(['divisions'])
  formData.value.birth_type = 'normal'
})
</script>

<style scoped>

</style>