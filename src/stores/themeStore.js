import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'app_theme'
const VALID_THEMES = ['light', 'dark', 'system']

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('system')

  function applyTheme(theme) {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    let isDark = false
    if (theme === 'dark') isDark = true
    else if (theme === 'system') isDark = prefersDark

    if (isDark) {
      root.classList.add('dark', 'ion-palette-dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark', 'ion-palette-dark')
      root.setAttribute('data-theme', 'light')
    }
  }

  function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) return
    currentTheme.value = theme
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
  }

  function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'system'
    currentTheme.value = saved
    applyTheme(saved)

    // Listen for system preference changes when "system" is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme.value === 'system') applyTheme('system')
    })
  }

  return {
    currentTheme,
    setTheme,
    loadTheme,
  }
})
