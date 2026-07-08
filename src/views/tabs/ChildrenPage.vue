<template>
  <ion-page>
    <z-header :title="$t('children.title')">
      <template #end>
        <ion-button fill="clear" @click="router.push('/children-register')" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="addOutline" />
        </ion-button>
      </template>
    </z-header>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <!-- Empty State -->
      <div v-if="children.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
        <ion-icon :icon="peopleOutline" class="text-6xl text-zinc-300 dark:text-zinc-700" />
        <div>
          <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-50">{{ $t('children.no_children') }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{{ $t('children.no_children_sub') }}</p>
        </div>
        <ion-button
            style="--background: #4f46e5; --border-radius: 12px; --color: #fff;"
            class="h-12 font-semibold text-sm px-6 mt-2"
            @click="showAddModal = true"
        >
          {{ $t('children.add_child') }}
        </ion-button>
      </div>

      <!-- Children List -->
      <div v-else class="p-4 flex flex-col gap-3">
        <div
            v-for="child in children"
            :key="child.id"
            class="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
        >
          <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              :class="child.gender === 'male' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400'"
          >
            <ion-icon :icon="maleFemaleOutline" />
          </div>
          <div class="flex-1">
            <p class="text-base font-bold text-zinc-900 dark:text-zinc-50">{{ child.name }}</p>
            <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {{ child.age }} · {{ child.gender === 'male' ? $t('children.male') : $t('children.female') }}
            </p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {{ $t('children.date_of_birth') }}: {{ child.dob }}
            </p>
          </div>
          <div>
            <button class="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-none cursor-pointer">
              <ion-icon :icon="createOutline" class="text-base" />
            </button>
          </div>
        </div>
      </div>

      <!-- ================================= -->
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonMenuButton, IonIcon,
} from '@ionic/vue'
import { addOutline, peopleOutline, maleFemaleOutline, createOutline } from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";
import router from "@/router/index.js";

const showAddModal = ref(false)
const children = ref([
  { id: 1, name: 'Ayaan Rahman', gender: 'male', dob: '2021-03-15', age: '2y 4m' },
  { id: 2, name: 'Zara Khan', gender: 'female', dob: '2022-07-20', age: '1y 1m' },
])
</script>
