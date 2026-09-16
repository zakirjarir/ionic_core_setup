<template>
  <ion-page>
    <z-header :title="t('chatbot.title', 'BIVEEC AI Chatbot')">
      <template #end>
        <ion-buttons>
          <ion-button @click="showHistory = !showHistory" :aria-label="t('chatbot.history')">
            <ion-icon :icon="showHistory ? closeOutline : menuOutline" />
          </ion-button>
        </ion-buttons>
      </template>
    </z-header>

    <div class="chat-layout">
      <aside class="chat-sidebar" :class="{ 'chat-sidebar-open': showHistory }">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2 min-w-0">
            <div class="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg">✦</div>
            <div class="min-w-0">
              <p class="text-xs font-black text-zinc-900 dark:text-white truncate">{{ t('chatbot.assistant_name') }}</p>
              <p class="text-[9px] text-emerald-600 dark:text-emerald-400">{{ t('chatbot.online_status') }}</p>
            </div>
          </div>
          <button class="sidebar-close" @click="showHistory = false" :aria-label="t('common.close')">×</button>
        </div>

        <button @click="createNewChat" class="new-chat-button">
          <span class="text-lg leading-none">+</span>
          {{ t('chatbot.new_chat') }}
        </button>

        <p class="sidebar-label">{{ t('chatbot.history') }}</p>
        <div class="space-y-2 overflow-y-auto flex-1">
          <button
            v-for="session in sessions"
            :key="session.id"
            @click="openSession(session.id)"
            class="session-button"
            :class="{ 'session-button-active': session.id === sessionId }"
          >
            <span class="session-title">{{ session.title }}</span>
            <span
              class="session-delete"
              @click.stop="deleteSession(session.id)"
              :aria-label="t('chatbot.delete_chat')"
            >×</span>
          </button>
          <p v-if="!sessions.length" class="text-xs text-zinc-500 dark:text-zinc-400">{{ t('chatbot.no_history') }}</p>
        </div>
      </aside>

      <div v-if="showHistory" class="sidebar-backdrop" @click="showHistory = false"></div>

      <main class="chat-main">

        <ion-content ref="contentRef">
          <ion-refresher slot="fixed" @ionRefresh="refreshChat">
            <ion-refresher-content
              pulling-icon="chevron-down-outline"
              :pulling-text="t('common.refresh', 'Pull to refresh')"
              :refreshing-text="t('common.loading', 'Loading...')"
            />
          </ion-refresher>

          <div class="bg-zinc-50 dark:bg-zinc-950 min-h-full pb-4">
            <div class="p-4 space-y-4">
          <!-- Welcome Message -->
          <div class="flex gap-3 max-w-[90%]">
            <div class="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl rounded-tl-none p-4 shadow-sm">
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
              <div
                v-if="msg.sender === 'bot'"
                class="chat-markdown text-xs leading-relaxed"
                v-html="renderMarkdown(msg.text)"
              ></div>
              <p v-else class="text-xs leading-relaxed whitespace-pre-line">{{ msg.text }}</p>
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

        <ion-footer class="ion-no-border">
          <div class="chat-composer">
            <input
              type="text"
              v-model="inputMsg"
              @keydown.enter="sendMessage"
              :placeholder="t('chatbot.placeholder', 'Type your query...')"
              class="chat-input"
            />
            <button
              @click="sendMessage"
              :disabled="!inputMsg.trim()"
              class="chat-send-button"
              :aria-label="t('chatbot.send', 'Send message')"
            >
              <ion-icon :icon="paperPlaneOutline" />
            </button>
          </div>
        </ion-footer>
      </main>
    </div>
  </ion-page>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { onMounted } from 'vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonFooter,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue'
import { closeOutline, menuOutline, paperPlaneOutline } from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import { useFunction } from '@/composables/index.js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import ZHeader from '@/components/ZHeader.vue'

const { t } = useI18n()
const { getData, submitData } = useFunction()

const contentRef = ref(null)
const inputMsg = ref('')
const isTyping = ref(false)
const messages = ref([])
const sessions = ref([])
const sessionId = ref(null)
const showHistory = ref(false)

marked.setOptions({
  gfm: true,
  breaks: true,
})

const renderMarkdown = (text) => DOMPurify.sanitize(marked.parse(text || ''))

const loadSessions = async () => {
  const response = await getData({ url: 'chatbot/sessions', rtn: true })
  sessions.value = Array.isArray(response) ? response : []
}

const refreshChat = async (event) => {
  try {
    await loadSessions()
    if (sessionId.value) {
      await openSession(sessionId.value)
    }
  } finally {
    event.target.complete()
  }
}

const createNewChat = async () => {
  const response = await submitData({
    url: 'chatbot/sessions',
    data: {},
    rtn: true,
  })
  if (response?.id) {
    sessionId.value = response.id
    messages.value = []
    showHistory.value = false
    await loadSessions()
  }
}

const openSession = async (id) => {
  const response = await getData({ url: `chatbot/sessions/${id}`, rtn: true })
  if (!response) return

  sessionId.value = response.id
  messages.value = (response.messages || []).map((message) => ({
    sender: message.role === 'assistant' ? 'bot' : 'user',
    text: message.message,
    time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))
  showHistory.value = false
  scrollToBottom()
}

const deleteSession = async (id) => {
  if (!window.confirm(t('chatbot.delete_confirm'))) return

  const response = await submitData({
    url: 'chatbot/sessions',
    id,
    method: 'delete',
    rtnFullResp: true,
  })

  if (response?.status && Number(response.status) !== 2000) return

  await loadSessions()
  if (sessionId.value === id) {
    if (sessions.value.length) {
      await openSession(sessions.value[0].id)
    } else {
      await createNewChat()
    }
  }
}

const suggestionKeys = [
  'polio',
  'side_effects',
  'add_child',
  'bcg',
]
const suggestions = computed(() => suggestionKeys.map((key) => t(`chatbot.suggestions.${key}`)))

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

const sendMessage = async () => {
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
  
  isTyping.value = true
  scrollToBottom()

  try {
    const response = await submitData({
      url: 'chatbot',
      data: {
        question: text,
        session_id: sessionId.value,
      },
      rtnFullResp: true,
    })

    isTyping.value = false
    const reply = response?.result?.answer
      || response?.data?.answer
      || 'Sorry, I could not generate an answer right now.'

    messages.value.push({
      sender: 'bot',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    if (response?.result?.session_id) {
      sessionId.value = response.result.session_id
    }
    await loadSessions()
    
    scrollToBottom()
  } catch (error) {
    isTyping.value = false
    messages.value.push({
      sender: 'bot',
      text: 'Sorry, the AI service is temporarily unavailable. Please try again.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    console.error('Chatbot request failed:', error)
    scrollToBottom()
  }
}

onMounted(async () => {
  await loadSessions()
  if (sessions.value.length) {
    await openSession(sessions.value[0].id)
  } else {
    await createNewChat()
  }
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: calc(100% - var(--ion-safe-area-top, 0px));
  min-height: 0;
  background: #fafafa;
}

.dark .chat-layout {
  background: #09090b;
}

.chat-sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  flex-shrink: 0;
  padding: 1rem;
  background: #fff;
  border-right: 1px solid rgb(228 228 231);
  z-index: 1000;
  visibility: hidden;
}

.dark .chat-sidebar {
  background: #18181b;
  border-color: rgb(63 63 70);
}

.chat-sidebar-open {
  transform: translateX(0) !important;
  visibility: visible;
  z-index: 1000;
}

.sidebar-close {
  display: none;
  color: #71717a;
  font-size: 1.5rem;
  line-height: 1;
}

.new-chat-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.7rem 0.8rem;
  border-radius: 0.8rem;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.72rem;
  font-weight: 800;
  text-align: left;
}

.dark .new-chat-button {
  background: rgb(49 46 129 / 0.35);
  color: #c7d2fe;
}

.sidebar-label {
  margin: 1.2rem 0 0.55rem;
  color: #a1a1aa;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.session-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;
  padding: 0.65rem 0.75rem;
  border-radius: 0.7rem;
  color: #52525b;
  font-size: 0.7rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-delete {
  flex-shrink: 0;
  color: #a1a1aa;
  font-size: 1rem;
  line-height: 1;
}

.session-delete:hover {
  color: #ef4444;
}

.dark .session-button {
  color: #d4d4d8;
}

.session-button:hover,
.session-button-active {
  background: #f4f4f5;
  color: #4f46e5;
  font-weight: 700;
}

.dark .session-button:hover,
.dark .session-button-active {
  background: #27272a;
  color: #a5b4fc;
}

.chat-main {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

.chat-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.4rem;
  padding: 0.6rem 1rem;
  background: #fff;
  border-bottom: 1px solid rgb(228 228 231);
}

.dark .chat-toolbar {
  background: #18181b;
  border-color: rgb(63 63 70);
}

.sidebar-toggle {
  color: #4f46e5;
  font-size: 1.2rem;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 767px) {
  .chat-sidebar {
    position: fixed;
    top: env(safe-area-inset-top, 0px);
    right: auto;
    bottom: 0;
    left: 0;
    width: min(82vw, 290px);
    transform: translateX(-105%);
    box-shadow: 12px 0 30px rgb(0 0 0 / 0.12);
    transition: transform 220ms ease;
  }

  .sidebar-close {
    display: block;
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 900;
    background: rgb(0 0 0 / 0.4);
  }
}

.chat-markdown :deep(p) {
  margin: 0 0 0.55rem;
}

.chat-markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.chat-markdown :deep(h1),
.chat-markdown :deep(h2),
.chat-markdown :deep(h3) {
  margin: 0.2rem 0 0.55rem;
  font-weight: 800;
  line-height: 1.3;
}

.chat-markdown :deep(h1) {
  font-size: 1.05rem;
}

.chat-markdown :deep(h2) {
  font-size: 0.95rem;
}

.chat-markdown :deep(h3) {
  font-size: 0.85rem;
}

.chat-markdown :deep(ul),
.chat-markdown :deep(ol) {
  margin: 0.35rem 0 0.65rem;
  padding-left: 1.15rem;
}

.chat-markdown :deep(li) {
  margin: 0.2rem 0;
}

.chat-markdown :deep(strong) {
  font-weight: 800;
}

.chat-markdown :deep(code) {
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  background: rgb(99 102 241 / 0.1);
  color: #4f46e5;
  font-size: 0.9em;
}

.chat-markdown :deep(pre) {
  overflow-x: auto;
  margin: 0.55rem 0;
  padding: 0.65rem;
  border-radius: 0.55rem;
  background: #18181b;
  color: #f4f4f5;
}

.chat-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.chat-markdown :deep(table) {
  display: block;
  width: 100%;
  overflow-x: auto;
  margin: 0.6rem 0;
  border-collapse: collapse;
  font-size: 0.9em;
}

.chat-markdown :deep(th),
.chat-markdown :deep(td) {
  padding: 0.4rem 0.5rem;
  border: 1px solid rgb(161 161 170 / 0.35);
  text-align: left;
  white-space: nowrap;
}

.chat-markdown :deep(th) {
  background: rgb(99 102 241 / 0.1);
  font-weight: 800;
}

.chat-markdown :deep(blockquote) {
  margin: 0.55rem 0;
  padding-left: 0.7rem;
  border-left: 3px solid #6366f1;
  color: rgb(113 113 122);
}

.chat-markdown :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}

.chat-composer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.85rem calc(0.7rem + env(safe-area-inset-bottom, 0px));
  background: transparent;
}

.dark .chat-composer {
  background: transparent;
}

.chat-input {
  min-width: 0;
  flex: 1;
  height: 2.75rem;
  padding: 0 1rem;
  border: 1px solid rgb(228 228 231);
  border-radius: 0.85rem;
  outline: none;
  background: #f4f4f5;
  color: #27272a;
  font-size: 0.75rem;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.chat-input::placeholder {
  color: #a1a1aa;
}

.chat-input:focus {
  border-color: #818cf8;
  background: #fff;
  box-shadow: 0 0 0 4px rgb(99 102 241 / 0.12);
}

.dark .chat-input {
  border-color: #3f3f46;
  background: #09090b;
  color: #f4f4f5;
}

.dark .chat-input:focus {
  border-color: #818cf8;
  background: #18181b;
}

.chat-send-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 6px 14px rgb(79 70 229 / 0.28);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.chat-send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgb(79 70 229 / 0.36);
}

.chat-send-button:active:not(:disabled) {
  transform: scale(0.94);
}

.chat-send-button:disabled {
  background: #e4e4e7;
  color: #a1a1aa;
  box-shadow: none;
  cursor: not-allowed;
}

.dark .chat-send-button:disabled {
  background: #27272a;
  color: #71717a;
}
</style>
