import { Preferences } from '@capacitor/preferences'

export const useCP = () => {

    // Save any value
    const set = async (key, value) => {
        await Preferences.set({
            key,
            value: JSON.stringify(value),
        })
    }

    // Get value
    const get = async (key) => {
        const { value } = await Preferences.get({ key })
        return value ? JSON.parse(value) : null
    }

    // Update = same as set (overwrite)
    const update = async (key, value) => {
        await set(key, value)
    }

    // Remove single key
    const remove = async (key) => {
        await Preferences.remove({ key })
    }

    // Clear all
    const clear = async () => {
        await Preferences.clear()
    }

    // Check exists
    const has = async (key) => {
        const { value } = await Preferences.get({ key })
        return value !== null
    }

    // Return all methods
    return {
        set,
        get,
        update,
        remove,
        clear,
        has
    }
}
