<template>
  <ion-page>
    <z-header :title="t('chatbot.title', 'BIVEEC AI Chatbot')">
    </z-header>

    <ion-content ref="contentRef">
      <div class="bg-zinc-50 dark:bg-zinc-950 min-h-full pb-4">
        <!-- Messages Area -->
        <div class="p-4 space-y-4">
          <!-- Welcome Message -->
          <div class="flex gap-3 max-w-[85%]">
            <div class="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl rounded-tl-none p-3 shadow-sm">
              <p class="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {{ t('chatbot.welcome_msg', 'Hello! I am your BIVEEC Assistant. How can I help you with child vaccination schedules and health tips today?') }}
              </p>
              <!-- Suggested Topics -->
              <div class="mt-3 flex flex-wrap gap-1.5">
                <button 
                  v-for="tip in suggestions" 
                  :key="tip" 
                  @click="askSuggestion(tip)"
                  class="text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {{ tip }}
                </button>
              </div>
            </div>
          </div>

          <!-- Message History -->
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="w-full flex transition-all duration-300"
            :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Bubble only -->
            <div
              class="max-w-[80%] p-3 shadow-sm border"
              :class="msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm border-indigo-500'
                : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-tl-sm border-zinc-200 dark:border-zinc-800/80'"
            >
              <p class="text-xs leading-relaxed whitespace-pre-line">{{ msg.text }}</p>
              <span
                class="text-[8px] mt-1.5 block font-medium"
                :class="msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-zinc-400 dark:text-zinc-500 text-left'"
              >
                {{ msg.time }}
              </span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex gap-3 max-w-[85%]">
            <div class="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Input Bar (Sticky at bottom, wrapped in ion-footer) -->
    <ion-footer class="ion-no-border">
      <div class="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
        <input 
          type="text" 
          v-model="inputMsg" 
          @keydown.enter="sendMessage"
          :placeholder="t('chatbot.placeholder', 'Type your query...')"
          class="flex-1 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          @click="sendMessage"
          :disabled="!inputMsg.trim()"
          class="h-9 w-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-100 disabled:dark:bg-zinc-800 text-white disabled:text-zinc-400 dark:disabled:text-zinc-600 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <ion-icon :icon="paperPlaneOutline" class="text-sm" />
        </button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon, IonFooter } from '@ionic/vue'
import { paperPlaneOutline } from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import ZHeader from '@/components/ZHeader.vue'

const { t } = useI18n()

const contentRef = ref(null)
const inputMsg = ref('')
const isTyping = ref(false)
const messages = ref([])

const suggestions = [
  'Polio schedule?',
  'Vaccine side effects?',
  'How to add child?',
  'BCG vaccine?'
]

const scrollToBottom = async () => {
  await nextTick()
  try {
    if (contentRef.value) {
      await contentRef.value.$el.scrollToBottom(300)
    }
  } catch (e) {
    // fallback silently
  }
}

const askSuggestion = (val) => {
  inputMsg.value = val
  sendMessage()
}

const clearChat = () => {
  messages.value = []
}

const sendMessage = () => {
  const text = inputMsg.value.trim()
  if (!text) return

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
  // Push user message
  messages.value.push({
    sender: 'user',
    text,
    time
  })
  
  inputMsg.value = ''
  scrollToBottom()
  
  // Simulate Bot typing and response
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    isTyping.value = false
    let reply = ''

    const normalized = text.toLowerCase()

    if (normalized.includes('polio')) {
      reply = 'Polio vaccination is given in multiple doses: \n1. OPV-0: At birth\n2. OPV-1 & IPV-1: At 6 weeks\n3. OPV-2: At 10 weeks\n4. OPV-3 & IPV-2: At 14 weeks.\n\nPlease check the "Vaccination" tab to see your child\'s schedule.'
    } else if (normalized.includes('side effect') || normalized.includes('fever') || normalized.includes('jwor')) {
      reply = 'Mild side effects like low-grade fever, soreness or redness at the injection site are normal. They usually disappear within 24-48 hours. Ensure the child gets plenty of rest and fluids. Consult a doctor before giving any medicine.'
    } else if (normalized.includes('add child') || normalized.includes('register') || normalized.includes('bacha')) {
      reply = 'To add or register a child: \n1. Go to the "Children" tab from the bottom menu.\n2. Click the "+" button at the top-right corner.\n3. Fill in the child\'s registration form and submit.'
    } else if (normalized.includes('bcg')) {
      reply = 'BCG vaccine protects against Tuberculosis. It is administered as a single dose, usually at birth or as soon as possible after birth. It is injected into the upper left arm.'
    } else {
      reply = 'Thank you for reaching out! For specific medical advice, please contact your community health worker or visit the nearest healthcare center. You can also view schedules in the "Vaccination" tab.'
    }

    messages.value.push({
      sender: 'bot',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    
    scrollToBottom()
  }, 1000)
}
</script>
