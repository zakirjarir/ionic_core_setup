<template>
  <ion-page>
   <z-header title="$t('support.title')"/>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <div class="p-4 flex flex-col gap-6">
        <!-- Hero -->
        <div class="flex flex-col items-center gap-3 text-center py-6">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-3xl text-white shadow-md shadow-indigo-500/10">
            <ion-icon :icon="helpCircleOutline" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-50">{{ $t('support.title') }}</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ $t('common.app_name') }} Support Team</p>
          </div>
        </div>

        <!-- Contact Options -->
        <div class="grid grid-cols-2 gap-3">
          <button @click="openEmail" class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
              <ion-icon :icon="mailOutline" />
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-zinc-50">{{ $t('support.email_support') }}</p>
          </button>

          <button @click="openWhatsApp" class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <ion-icon :icon="logoWhatsapp" />
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-zinc-50">{{ $t('support.whatsapp') }}</p>
          </button>

          <button @click="openBug" class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
              <ion-icon :icon="bugOutline" />
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-zinc-50">{{ $t('support.report_bug') }}</p>
          </button>

          <button @click="openFeedback" class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
              <ion-icon :icon="chatbubbleOutline" />
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-zinc-50">{{ $t('support.feedback') }}</p>
          </button>
        </div>

        <!-- FAQ -->
        <div>
          <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 ml-1">{{ $t('support.faq') }}</p>
          <div class="flex flex-col gap-2.5">
            <div v-for="faq in faqs" :key="faq.id" class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
              <button @click="faq.open = !faq.open" class="flex items-center justify-between w-full bg-transparent border-none cursor-pointer p-0 gap-3 text-left">
                <span class="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">{{ faq.question }}</span>
                <ion-icon :icon="faq.open ? chevronUpOutline : chevronDownOutline" class="text-base text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
              </button>
              <div v-if="faq.open" class="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 mt-0.5">
                <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { reactive } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonIcon,
} from '@ionic/vue'
import {
  helpCircleOutline, mailOutline, logoWhatsapp, bugOutline, chatbubbleOutline,
  chevronDownOutline, chevronUpOutline,
} from 'ionicons/icons'
import ZHeader from "@/components/ZHeader.vue";

const faqs = reactive([
  { id: 1, question: 'How do I add a child?', answer: 'Go to the Children tab and tap the + icon at the top right to add a new child.', open: false },
  { id: 2, question: 'How does the vaccination reminder work?', answer: 'You will receive push notifications when a vaccine is due within 3 days or is overdue.', open: false },
  { id: 3, question: 'Can I use the app in multiple languages?', answer: 'Yes! Go to Settings → Language to switch between English, Bangla and Arabic.', open: false },
  { id: 4, question: 'Is my data secure?', answer: 'All data is encrypted and stored securely. We never share your personal information.', open: false },
])

function openEmail() { window.open('mailto:support@biveec.app') }
function openWhatsApp() { window.open('https://wa.me/+8801700000000') }
function openBug() { window.open('mailto:bugs@biveec.app?subject=Bug Report') }
function openFeedback() { window.open('mailto:feedback@biveec.app?subject=Feedback') }
</script>
