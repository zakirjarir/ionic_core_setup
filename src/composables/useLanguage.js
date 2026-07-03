import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, applyLocaleToDocument, isRTL } from '@/i18n'

const STORAGE_KEY = 'app_locale'

export function useLanguage() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value)

  const currentLocaleInfo = computed(() =>
    SUPPORTED_LOCALES.find((l) => l.code === locale.value) || SUPPORTED_LOCALES[0]
  )

  const isCurrentRTL = computed(() => isRTL(locale.value))

  function setLanguage(code) {
    if (!SUPPORTED_LOCALES.find((l) => l.code === code)) return
    locale.value = code
    localStorage.setItem(STORAGE_KEY, code)
    applyLocaleToDocument(code)
  }

  function loadSavedLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'en'
    locale.value = saved
    applyLocaleToDocument(saved)
  }

  return {
    currentLocale,
    currentLocaleInfo,
    isCurrentRTL,
    supportedLocales: SUPPORTED_LOCALES,
    setLanguage,
    loadSavedLanguage,
  }
}
