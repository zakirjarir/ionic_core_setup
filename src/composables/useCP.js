import { Preferences } from '@capacitor/preferences'

export const useCP = () => {

    const set = async (key, value) => {
        try {
            await Preferences.set({
                key,
                value: JSON.stringify(value)
            })
            return true
        } catch (error) {
            console.error(`CP SET ERROR [${key}]`, error)
            return false
        }
    }

    const get = async (key, defaultValue = null) => {
        try {
            const { value } = await Preferences.get({ key })

            if (
                value === null ||
                value === undefined ||
                value === '' ||
                value === 'undefined'
            ) {
                return defaultValue
            }

            return JSON.parse(value)
        } catch (error) {
            console.error(`CP GET ERROR [${key}]`, error)
            return defaultValue
        }
    }

    const update = async (key, value) => {
        return await set(key, value)
    }

    const remove = async (key) => {
        try {
            await Preferences.remove({ key })
            return true
        } catch (error) {
            console.error(`CP REMOVE ERROR [${key}]`, error)
            return false
        }
    }

    const clear = async () => {
        try {
            await Preferences.clear()
            return true
        } catch (error) {
            console.error('CP CLEAR ERROR', error)
            return false
        }
    }

    const has = async (key) => {
        const { value } = await Preferences.get({ key })

        return (
            value !== null &&
            value !== undefined &&
            value !== '' &&
            value !== 'undefined'
        )
    }

    const keys = async () => {
        const { keys } = await Preferences.keys()
        return keys
    }

    /**
     * একটা CP key এ save করা draft photo মুছে দেয়
     * @param {string} draftKey - CP এর key (যেমন 'child_register_draft_photo')
     */
    const removeDraftPhoto = async (draftKey) => {
        return await remove(draftKey)
    }

    return {
        set,
        get,
        update,
        remove,
        clear,
        has,
        keys,
        removeDraftPhoto,
    }
}