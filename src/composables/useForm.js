import { ref, provide } from 'vue'
import {useStore} from "@/composables/useStore.js";

export function useForm() {
    const formInputs = ref(new Set())
    const store = useStore()

    const registerInput = (input) => {
        formInputs.value.add(input)
    }

    const unregisterInput = (input) => {
        formInputs.value.delete(input)
    }

    const validate = async () => {
        try {
            for (const input of formInputs.value) {
                const result = await input.validate?.()

                if (!result) {
                    input.focus?.()
                    return false
                }
            }
            return true
        }catch(err) {
            console.error(err)
        }
        finally {
            store.loading = false
        }
    }

    const reset = () => {
        for (const input of formInputs.value) {
            input.reset?.()
        }
    }

    //  provide here (correct place)
    provide('registerInput', registerInput)
    provide('unregisterInput', unregisterInput)

    return {
        validate,
        reset,
        formInputs
    }
}