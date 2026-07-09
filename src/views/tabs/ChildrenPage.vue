<template>
  <ion-page>
    <z-header :title="t('children.title')">
      <template #end>
        <ion-button fill="clear" @click="router.push('/children-register')" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="addOutline" class="text-xl" />
        </ion-button>
      </template>
    </z-header>

    <ion-content class="bg-[#F8F9FD] dark:bg-zinc-950">
      <div class="max-w-md mx-auto px-4 py-5 space-y-5">
        
        <!-- Header Banner / Stats Summary (Premium feature) -->
        <div v-if="children.length > 0" class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white p-5 shadow-lg border border-indigo-400/20">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-lg"></div>
          <div class="relative z-10 flex justify-between items-center">
            <div class="space-y-1">
              <p class="text-[10px] uppercase font-bold tracking-wider text-indigo-200">{{ t('children.registered_total') || 'Total Registered' }}</p>
              <h2 class="text-2xl font-extrabold tracking-tight flex items-baseline gap-1.5">
                {{ children.length }} 
                <span class="text-xs font-medium text-indigo-200">{{ children.length === 1 ? t('children.child') || 'Child' : t('children.children_count') || 'Children' }}</span>
              </h2>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <ion-icon :icon="heartOutline" class="text-2xl text-white" />
            </div>
          </div>
        </div>

        <!-- Search and Gender Filter Bar -->
        <div v-if="children.length > 0 || searchQuery" class="flex flex-col gap-3">
          <div class="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-1">
            <ion-icon :icon="searchOutline" class="absolute left-4 text-zinc-400 dark:text-zinc-500 text-lg" />
            <input 
              v-model="searchQuery" 
              type="text" 
              :placeholder="t('common.search') || 'Search children...'" 
              class="w-full bg-transparent border-none py-2.5 pl-10 pr-4 text-sm font-medium text-zinc-800 dark:text-zinc-150 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="bg-transparent border-0 text-zinc-400 hover:text-zinc-650 p-2 cursor-pointer flex">
              <ion-icon :icon="closeCircleOutline" class="text-base" />
            </button>
          </div>

          <!-- Quick Gender Filter Tabs -->
          <div class="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl">
            <button 
              v-for="filter in filterTabs" 
              :key="filter.value"
              @click="activeFilter = filter.value"
              class="flex-1 py-1.5 text-xs font-bold rounded-lg border-0 transition-all cursor-pointer flex items-center justify-center gap-1"
              :class="activeFilter === filter.value 
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'"
            >
              <ion-icon v-if="filter.icon" :icon="filter.icon" class="text-xs" />
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ t('common.loading') }}</p>
        </div>

        <!-- Empty / Search No Results State -->
        <div v-else-if="filteredChildren.length === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center gap-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
            <ion-icon :icon="searchQuery ? searchOutline : peopleOutline" class="text-3xl" />
          </div>
          <div>
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {{ searchQuery ? (t('children.no_search_results') || 'No matches found') : (t('children.no_children') || 'No Children Registered') }}
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              {{ searchQuery ? (t('children.no_search_results_sub') || 'Try refining your search text or filter options.') : (t('children.no_children_sub') || 'Add your child to start tracking their vaccine cards.') }}
            </p>
          </div>
          <ion-button
              v-if="!searchQuery"
              style="--background: linear-gradient(to right, #4f46e5, #9333ea); --border-radius: 12px; --color: #fff;"
              class="h-11 font-bold text-xs px-6 mt-2"
              @click="router.push('/children-register')"
          >
            {{ t('children.add_child') }}
          </ion-button>
        </div>

        <!-- Children List -->
        <div v-else class="flex flex-col gap-3.5">
          <div
              v-for="child in filteredChildren"
              :key="child.id"
              class="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
              @click="goToDetail(child)"
          >
            <!-- Colored strip indicating gender on the left edge -->
            <div 
              class="absolute top-0 left-0 w-1.5 h-full"
              :class="child.gender === 'male' ? 'bg-blue-500' : child.gender === 'female' ? 'bg-pink-500' : 'bg-indigo-500'"
            ></div>

            <!-- Avatar/Image with colored ring -->
            <div class="w-14 h-14 rounded-full flex-shrink-0 border-2 shadow-inner overflow-hidden flex items-center justify-center p-0.5"
                 :class="child.gender === 'male' ? 'border-blue-100 dark:border-blue-900/30' : child.gender === 'female' ? 'border-pink-100 dark:border-pink-900/30' : 'border-indigo-100 dark:border-indigo-900/30'">
              <img v-if="child.photo" :src="child.photo" class="w-full h-full rounded-full object-cover" alt="Child profile" />
              <div v-else class="w-full h-full rounded-full flex items-center justify-center text-base font-extrabold"
                   :class="child.gender === 'male' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400'">
                {{ getInitials(child.name) }}
              </div>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 truncate flex items-center gap-1.5">
                {{ child.name }}
                <span v-if="child.nickname" class="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">({{ child.nickname }})</span>
              </h3>
              
              <!-- Gender and Age Pills -->
              <div class="flex items-center gap-1.5 mt-1">
                <span class="px-2 py-0.5 rounded-md text-[9px] font-bold" 
                      :class="child.gender === 'male' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400'">
                  {{ child.gender === 'male' ? t('children.male') : child.gender === 'female' ? t('children.female') : t('children.other') }}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  {{ calculateAge(child.dob) }}
                </span>
              </div>
              
              <!-- Core Vaccination Stub (Theme integration) -->
              <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-1 font-medium">
                <ion-icon :icon="shieldCheckmarkOutline" class="text-indigo-500 dark:text-indigo-400 text-xs" />
                {{ t('children.next_vaccine') || 'Next Dose: ' }} 
                <span class="text-zinc-600 dark:text-zinc-300 font-bold ml-0.5">2 Months Schedule</span>
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1" @click.stop>
              <button 
                @click="openEditModal(child)"
                class="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 border-0 transition-colors"
              >
                <ion-icon :icon="createOutline" class="text-sm" />
              </button>
              <button 
                @click="goToDetail(child)"
                class="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 border-0 transition-colors"
              >
                <ion-icon :icon="chevronForwardOutline" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Name Modal -->
      <ion-modal 
        :is-open="isEditModalOpen" 
        @didDismiss="closeEditModal"
        class="name-edit-modal"
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
import { ref, reactive, computed } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, IonModal, onIonViewWillEnter
} from '@ionic/vue'
import { 
  addOutline, peopleOutline, maleFemaleOutline, createOutline, 
  chevronForwardOutline, closeOutline, searchOutline, closeCircleOutline,
  heartOutline, shieldCheckmarkOutline, manOutline, womanOutline, gridOutline
} from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFunction, useStore } from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"
import MyInput from "@/components/MyInput.vue"

const router = useRouter()
const { t } = useI18n()
const store = useStore()
const { getData, submitData } = useFunction()

const children = ref([])
const loading = ref(false)

// Search & Filter State
const searchQuery = ref('')
const activeFilter = ref('all')

const filterTabs = computed(() => [
  { label: t('children.filter_all') || 'All', value: 'all', icon: gridOutline },
  { label: t('children.male') || 'Male', value: 'male', icon: manOutline },
  { label: t('children.female') || 'Female', value: 'female', icon: womanOutline }
])

// Edit Modal State
const isEditModalOpen = ref(false)
const selectedChildId = ref(null)
const editForm = reactive({
  name: '',
  name_bn: ''
})

onIonViewWillEnter(async () => {
  await fetchChildren()
})

const fetchChildren = async () => {
  try {
    loading.value = true
    const res = await getData({ url: 'children', rtn: true })
    if (res) {
      children.value = res
    }
  } catch (error) {
    console.error('Error fetching children:', error)
  } finally {
    loading.value = false
  }
}

// Compute filtered children list
const filteredChildren = computed(() => {
  return children.value.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (child.name_bn && child.name_bn.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                          child.child_uid.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesGender = activeFilter.value === 'all' ? true : child.gender === activeFilter.value
    
    return matchesSearch && matchesGender
  })
})

const goToDetail = (child) => {
  router.push(`/children-detail/${child.id}`)
}

const openEditModal = (child) => {
  selectedChildId.value = child.id
  editForm.name = child.name
  editForm.name_bn = child.name_bn || ''
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedChildId.value = null
  editForm.name = ''
  editForm.name_bn = ''
}

const saveChildName = async () => {
  if (!editForm.name.trim()) return

  try {
    const success = await submitData({
      url: `children/${selectedChildId.value}/update-name`,
      data: { 
        name: editForm.name, 
        name_bn: editForm.name_bn 
      },
      reset: false
    })

    if (success) {
      closeEditModal()
      await fetchChildren()
    }
  } catch (error) {
    console.error('Error updating child name:', error)
  }
}

// Helpers
const getInitials = (name) => {
  if (!name) return 'CH'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
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
ion-modal.name-edit-modal {
  --height: 380px;
  --border-radius: 20px;
  --box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
