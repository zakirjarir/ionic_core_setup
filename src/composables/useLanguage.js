import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, applyLocaleToDocument, isRTL } from '@/i18n'
import { useCP } from './useCP.js'

const STORAGE_KEY = 'app_locale'

export function useLanguage() {
  const { locale } = useI18n()
  const CP = useCP()

  const currentLocale = computed(() => locale.value)

  const currentLocaleInfo = computed(() =>
      SUPPORTED_LOCALES.find((l) => l.code === locale.value) ||
      SUPPORTED_LOCALES[0]
  )

  const isCurrentRTL = computed(() => isRTL(locale.value))

  async function setLanguage(code) {
    if (!SUPPORTED_LOCALES.find((l) => l.code === code)) return

    locale.value = code

    await CP.set(STORAGE_KEY, code)

    applyLocaleToDocument(code)
  }

  async function loadSavedLanguage() {
    const result = await CP.get(STORAGE_KEY)

    const saved = result || 'en'

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