import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import bn from '@/locales/bn.json'
import ar from '@/locales/ar.json'
import {useCP} from "../composables/index.js";

const RTL_LOCALES = ['ar']
const STORAGE_KEY = 'app_locale'


const CP = useCP()
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
]

function getSavedLocale() {
  return CP.get(STORAGE_KEY) || 'en'
}

export function isRTL(locale) {
  return RTL_LOCALES.includes(locale)
}

export function applyLocaleToDocument(locale) {
  document.documentElement.lang = locale
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
  document.body.classList.toggle('rtl', isRTL(locale))
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: { en, bn, ar },
})

// Apply on initial load
applyLocaleToDocument(getSavedLocale())

export default i18n
