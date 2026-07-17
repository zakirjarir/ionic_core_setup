<template>
  <ion-page>
    <z-header :title="t('children.title')">
      <template #end>
        <ion-button fill="clear" @click="router.push('/children-register')" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="addOutline" class="text-xl" />
        </ion-button>
      </template>
    </z-header>

    <ion-content>
      <div class="max-w-md mx-auto px-4 py-5 space-y-5">

        <!-- Search and Gender Filter Bar -->
        <div v-if="children.length > 0 || searchQuery" class="flex flex-col gap-3">

          <my-input type="search" :placeholder="t('common.search') || 'Search children...'" :value="searchQuery" @input="searchQuery = $event.target.value"/>

          <!-- Quick Gender Filter Tabs -->
<!--          <div class="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl">-->
<!--            <button-->
<!--              v-for="filter in filterTabs"-->
<!--              :key="filter.value"-->
<!--              @click="activeFilter = filter.value"-->
<!--              class="flex-1 py-1.5 text-xs font-bold rounded-lg border-0 transition-all cursor-pointer flex items-center justify-center gap-1"-->
<!--              :class="activeFilter === filter.value-->
<!--                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'-->
<!--                : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'"-->
<!--            >-->
<!--              <ion-icon v-if="filter.icon" :icon="filter.icon" class="text-xs" />-->
<!--              {{ filter.label }}-->
<!--            </button>-->
<!--          </div>-->
        </div>

        <!-- store.loading State -->
        <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 gap-3">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ t('common.loading') }}</p>
        </div>

        <!-- Empty / Search No Results State -->
        <div v-else-if="filteredChildren.length === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center gap-4 bg-transparent p-8">
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
            ></div>

            <!-- Avatar/Image with colored ring -->
            <div class="w-14 h-14 rounded-full flex-shrink-0 border-2 shadow-inner overflow-hidden flex items-center justify-center p-0.5"
                 :class="child.gender === 'male' ? 'border-blue-100 dark:border-blue-900/30' : child.gender === 'female' ? 'border-pink-100 dark:border-pink-900/30' : 'border-indigo-100 dark:border-indigo-900/30'">
              <img v-if="child.photo" :src="LFA(child.photo)" class="w-full h-full rounded-full object-cover" alt="Child profile" />
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
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1" @click.stop>
              <button
                @click="goToDetail(child)"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 border-0 transition-colors"
              >
                <ion-icon :icon="chevronForwardOutline" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, IonModal, onIonViewWillEnter
} from '@ionic/vue'
import {
  addOutline, peopleOutline, createOutline,
  chevronForwardOutline, searchOutline, manOutline, womanOutline, gridOutline
} from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {useCP, useFunction, useStore} from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"
import MyInput from "@/components/MyInput.vue"

const router = useRouter()
const { t } = useI18n()
const { getData,LFA } = useFunction()

const children = ref([])
const store = useStore()
const CP = useCP()

// Search & Filter State
const searchQuery = ref('')
const activeFilter = ref('all')

// const filterTabs = computed(() => [
//   { label: t('children.filter_all') || 'All', value: 'all', icon: gridOutline },
//   { label: t('children.male') || 'Male', value: 'male', icon: manOutline },
//   { label: t('children.female') || 'Female', value: 'female', icon: womanOutline }
// ])

onIonViewWillEnter(async () => {
  // 1. Load cached data immediately
  const cachedChildren = await CP.get('children');
  if (cachedChildren) {
    children.value = cachedChildren;
  }

  // 2. Then, attempt to fetch fresh data from the server
  await fetchChildren();
})

const fetchChildren = async () => {
  try {
    const res = await getData({ url: 'children', rtn: true })
    if (res) {
      // 3. If server fetch is successful, update children.value and cache
      children.value = res
      await CP.set('children', children.value)
    } else {
      console.error('Failed to fetch children from server:', res.statusText)
      // If server fetch fails, children.value will retain the cached data (or remain empty if no cache)
    }

  } catch (error) {
    console.error('Error fetching children from server:', error)
    // If server fetch fails due to network error, children.value will retain the cached data (or remain empty if no cache)
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
  if (!dob) return '-'

  try {
    const birthDate = new Date(dob + 'T00:00:00')
    const today = new Date()

    if (birthDate > today) {
      return '0d'
    }

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
      const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
      ).getDate()

      days += lastMonth
      months--
    }

    if (months < 0) {
      years--
      months += 12
    }

    if (years > 0) {
      return `${years}y ${months}m`
    }

    if (months > 0) {
      return `${months}m ${days}d`
    }

    return `${days}d`
  } catch (e) {
    console.error(e)
    return '-'
  }
}
</script>

<style scoped>
</style>