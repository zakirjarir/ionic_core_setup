import {defineStore} from 'pinia'
import {ref} from 'vue'
import {Capacitor} from '@capacitor/core'
import {StatusBar, Style} from '@capacitor/status-bar'
import {useCP} from '../composables'
import {App} from '@capacitor/app'

const STORAGE_KEY = 'app_theme'
const VALID_THEMES = ['light', 'dark', 'system']

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = ref('system')
    const CP = useCP()


    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function isDarkTheme(theme) {
        if (theme === 'dark') return true

        if (theme === 'system') {
            return mediaQuery.matches
        }

        return false
    }

    function applyTheme(theme) {
        const root = document.documentElement
        const isDark = isDarkTheme(theme)

        if (isDark) {
            root.classList.add('dark', 'ion-palette-dark')
            root.setAttribute('data-theme', 'dark')
        } else {
            root.classList.remove('dark', 'ion-palette-dark')
            root.setAttribute('data-theme', 'light')
        }
    }

    async function updateStatusBar() {
        // Detect platform; skip on web
        const platform = (Capacitor.getPlatform && Capacitor.getPlatform()) || 'web'
        if (platform === 'web') return

        const isDark = document.documentElement.classList.contains('dark')

        try {
            // Android: control overlays and background color
            if (platform === 'android') {
                await StatusBar.setOverlaysWebView({ overlay: false })

                await StatusBar.setBackgroundColor({
                    color: isDark ? '#121212' : '#ffffff',
                })
            }

            // Set icon/text color for both iOS and Android
            await StatusBar.setStyle({
                style: isDark ? Style.Dark : Style.Light,
            })
        } catch (error) {
            console.error('StatusBar error:', error)
        }
    }

    async function setTheme(theme) {
        if (!VALID_THEMES.includes(theme)) return

        currentTheme.value = theme

        await CP.set(STORAGE_KEY, theme)

        applyTheme(theme)

        await updateStatusBar()
    }

    async function loadTheme() {
        const saved = (await CP.get(STORAGE_KEY)) || 'system'

        currentTheme.value = saved

        applyTheme(saved)

        await updateStatusBar()
    }

    mediaQuery.addEventListener('change', async () => {
        if (currentTheme.value === 'system') {
            applyTheme('system')
            await updateStatusBar()
        }
    })

    // Ensure status bar updates when app becomes active again (native only)
    if (Capacitor.getPlatform && Capacitor.getPlatform() !== 'web') {
        App.addListener('appStateChange', async ({ isActive }) => {
            if (isActive) {
                await updateStatusBar()
            }
        })
    }

    return {
        currentTheme,
        setTheme,
        loadTheme,
        updateStatusBar,
    }


})
