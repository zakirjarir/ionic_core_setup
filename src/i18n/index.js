import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import bn from '@/locales/bn.json'
import ar from '@/locales/ar.json'

const RTL_LOCALES = ['ar']

export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
]

export function isRTL(locale) {
  return RTL_LOCALES.includes(locale)
}

export function applyLocaleToDocument(locale) {
  document.documentElement.lang = locale
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
  document.body.classList.toggle('rtl', isRTL(locale))
}

// Always start with 'en' — actual saved locale is loaded async in App.vue
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, bn, ar },
})

export default i18n
