import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { useFunction } from '@/composables/useFunction'
import { useStore } from '@/composables/useStore'
import { useCP } from '@/composables/useCP'

export const usePushNotifications = () => {
  const { updateDeviceToken } = useFunction()
  const store = useStore()
  const CP = useCP()

  const isSupported = Capacitor.isPluginAvailable('PushNotifications') && Capacitor.isNativePlatform()

  const registerPush = async () => {
    if (!isSupported) return false

    try {
      let { receive } = await PushNotifications.checkPermissions()

      if (receive === 'prompt') {
        ({ receive } = await PushNotifications.requestPermissions())
      }

      if (receive !== 'granted') throw new Error('Permission denied')

      await PushNotifications.register()
      return true
    } catch (e) {
      console.error('Push register error:', e)
      return false
    }
  }

  const addListeners = () => {
    if (!isSupported) return

    PushNotifications.addListener('registration', async ({ value }) => {
      console.log('FCM registration success, token:', value)
      // Cache token locally in preferences
      await CP.set('device_token', value)

      if (store.user) {
        await updateDeviceToken({ device_token: value, push_enabled: true })
      }
    })

    PushNotifications.addListener('registrationError', (err) => console.error('Reg error:', err))
    PushNotifications.addListener('pushNotificationReceived', (msg) => console.log('Push received:', msg))
    PushNotifications.addListener('pushNotificationActionPerformed', (act) => console.log('Action performed:', act))
  }

  const unregisterPush = async () => {
    if (!isSupported) return

    if (store.user) {
      await updateDeviceToken({ device_token: null, push_enabled: false })
    }
    await CP.remove('device_token')
    await PushNotifications.removeAllListeners()
  }

  const syncTokenWithBackend = async () => {
    if (!isSupported || !store.user) return false

    try {
      const cachedToken = await CP.get('device_token')
      if (cachedToken) {
        console.log('Syncing cached token with backend:', cachedToken)
        await updateDeviceToken({ device_token: cachedToken, push_enabled: true })
        return true
      }
    } catch (err) {
      console.error('Push token sync error:', err)
    }
    return false
  }

  return { isSupported, registerPush, addListeners, unregisterPush, syncTokenWithBackend }
}