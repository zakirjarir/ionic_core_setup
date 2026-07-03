import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './theme/app.css'
import '@ionic/vue/css/palettes/dark.class.css'

/* Pinia */
const pinia = createPinia()

/* Bootstrap stores that need to run on startup */
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .use(i18n)

router.isReady().then(async () => {
  const themeStore = useThemeStore()
  await themeStore.loadTheme()

  const authStore = useAuthStore()
  await authStore.fetchUser()

  app.mount('#app')
})
