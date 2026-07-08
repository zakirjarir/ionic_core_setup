<template>
  <div class="mb-6">
    <div class="relative">
      <!-- Search Input with ion-searchbar -->
      <template v-if="type === 'search'">
        <div class="relative flex items-center" :class="{
          'has-prefix-icon': icon,
          'has-error': hasError,
          'touched': isTouched,
          'has-store-error': hasStoreError,
          'disabled': disabled || loading,
          'has-suffix-button': suffixButton
        }">
          <div v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 pointer-events-none">
            <ion-icon :icon="icon" class="text-xl" />
          </div>

          <ion-searchbar
              ref="inputRef"
              :model-value="modelValue"
              @ionInput="onSearchInput"
              @ionChange="onSearchChange"
              @ionBlur="onBlur"
              @ionFocus="onFocus"
              @ionClear="onSearchClear"
              :placeholder="placeholder || 'Search...'"
              :disabled="disabled || loading"
              :readonly="readonly"
              :debounce="debounceMs"
              :show-cancel-button="showCancelButton"
              :cancel-button-text="cancelButtonText"
              :show-clear-button="showClearButton"
              :autocomplete="autocomplete"
              :class="{
                'has-error': hasError,
                'touched': isTouched,
                'has-store-error': hasStoreError,
                'custom-searchbar': true
              }"
              :name="name"
              :enterkeyhint="enterkeyhint"
              :animated="animated"
          />

          <div v-if="suffixIcon || suffixButton || validationLoading" class="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <div v-if="validationLoading" class="flex items-center justify-center text-primary-500 dark:text-primary-400">
              <ion-spinner name="crescent" class="w-5 h-5" />
            </div>
            <button
                v-else-if="suffixButton"
                @click="onSuffixClick"
                :disabled="suffixDisabled || disabled || suffixLoading"
                class="px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 min-h-[32px] hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                :class="[
                suffixColorClass,
                {
                  'opacity-70 cursor-wait': suffixLoading,
                  'px-3': suffixLabel,
                }
              ]"
                type="button"
            >
              <ion-spinner
                  v-if="suffixLoading"
                  name="crescent"
                  class="w-4 h-4"
              />
              <template v-else>
                <ion-icon
                    v-if="suffixIcon"
                    :icon="suffixIcon"
                    class="text-lg"
                />
                <span v-if="suffixLabel" class="whitespace-nowrap">{{ suffixLabel }}</span>
              </template>
            </button>
            <div
                v-else-if="suffixIcon"
                class="text-gray-500 dark:text-gray-400 flex items-center cursor-pointer hover:text-primary-500 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': suffixButton, 'opacity-50 cursor-not-allowed': suffixDisabled || disabled }"
                @click="!suffixDisabled && !disabled ? onSuffixIconClick($event) : null"
            >
              <ion-icon :icon="suffixIcon" class="text-xl" />
            </div>
          </div>
        </div>

        <!-- Search suggestions dropdown -->
        <div v-if="searchSuggestions.length > 0 && isFocused && !loading" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-[300px] overflow-y-auto z-[1000] animate-slideDown">
          <div
              v-for="(suggestion, index) in searchSuggestions"
              :key="`suggestion-${index}`"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 last:border-b-0"
              @click="selectSuggestion(suggestion)"
          >
            <ion-icon :icon="searchOutline" class="text-lg text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span class="flex-1 text-sm text-gray-900 dark:text-gray-100">{{ getSuggestionLabel(suggestion) }}</span>
          </div>
        </div>

        <!-- Search result info -->
        <div v-if="searchResultCount !== null && !loading && isTouched" class="mt-2 text-sm">
          <span v-if="searchResultCount === 0" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <ion-icon :icon="alertCircleOutline" />
            No results found
          </span>
          <span v-else-if="searchResultCount > 0" class="text-success-500 dark:text-success-400 font-medium">
            Found {{ searchResultCount }} result{{ searchResultCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </template>

      <!-- Text Input / Textarea -->
      <template v-else-if="type === 'textarea'">
        <div class="relative flex items-center" :class="{
          'has-prefix-icon': icon,
          'has-suffix': suffixIcon || suffixButton
        }">
          <div v-if="icon" class="absolute left-4 top-6 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 pointer-events-none">
            <ion-icon :icon="icon" class="text-xl" />
          </div>

          <ion-textarea
              ref="inputRef"
              class="custom-input w-full"
              :model-value="modelValue"
              @ionInput="onInput"
              @ionBlur="onBlur"
              @ionFocus="onFocus"
              :label="required ? `${label} *` : label"
              label-placement="floating"
              fill="outline"
              :placeholder="placeholder"
              :disabled="disabled || loading"
              :enterkeyhint="enterkeyhint"
              :readonly="readonly"
              :rows="rows"
              :auto-grow="autoGrow"
              :maxlength="maxlength"
              :class="{
              'has-error': hasError,
              'touched': isTouched,
              'has-store-error': hasStoreError,
              'has-suffix-button': suffixButton
            }"
              :name="name"
              :autocomplete="autocomplete"
          />

          <div v-if="suffixIcon || suffixButton || validationLoading" class="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <div v-if="validationLoading" class="flex items-center justify-center text-primary-500 dark:text-primary-400">
              <ion-spinner name="crescent" class="w-5 h-5" />
            </div>
            <button
                v-else-if="suffixButton"
                @click="onSuffixClick"
                :disabled="suffixDisabled || disabled || suffixLoading"
                class="px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 min-h-[32px] hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                :class="[
                suffixColorClass,
                {
                  'opacity-70 cursor-wait': suffixLoading,
                  'px-3': suffixLabel,
                }
              ]"
                type="button"
            >
              <ion-spinner
                  v-if="suffixLoading"
                  name="crescent"
                  class="w-4 h-4"
              />
              <template v-else>
                <ion-icon
                    v-if="suffixIcon"
                    :icon="suffixIcon"
                    class="text-lg"
                />
                <span v-if="suffixLabel" class="whitespace-nowrap">{{ suffixLabel }}</span>
              </template>
            </button>
            <div
                v-else-if="suffixIcon"
                class="text-gray-500 dark:text-gray-400 flex items-center cursor-pointer hover:text-primary-500 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': suffixButton, 'opacity-50 cursor-not-allowed': suffixDisabled || disabled }"
                @click="!suffixDisabled && !disabled ? onSuffixIconClick($event) : null"
            >
              <ion-icon :icon="suffixIcon" class="text-xl" />
            </div>
          </div>
        </div>
      </template>

      <!-- Select Dropdown -->
      <template v-else-if="type === 'select'">
        <div class="relative" :class="{
          'has-prefix-icon': icon,
          'has-error': hasError,
          'touched': isTouched,
          'has-store-error': hasStoreError,
          'disabled': disabled || loading
        }">
          <div v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 pointer-events-none">
            <ion-icon :icon="icon" class="text-xl" />
          </div>

          <ion-select
              class="custom-input w-full"
              ref="inputRef"
              :model-value="modelValue"
              @ionChange="onSelectChange"
              @ionBlur="onBlur"
              @ionFocus="onFocus"
              :label="required ? `${label} *` : label"
              label-placement="floating"
              fill="outline"
              :placeholder="placeholder"
              :disabled="disabled || loading"
              :interface="selectInterface"
              :multiple="multiple"
              :compare-with="compareWith"
              :name="name"
              :ok-text="okText"
              :cancel-text="cancelText"
              :class="{
              'has-error': hasError,
              'has-store-error': hasStoreError
            }"
          >
            <slot name="select-options">
              <ion-select-option
                  v-for="(option, index) in options"
                  :key="`opt-${index}-${getOptionValue(option)}`"
                  :value="getOptionValue(option)"
                  :disabled="option.disabled"
              >
                {{ getOptionLabel(option) }}
              </ion-select-option>
            </slot>
          </ion-select>


          <div v-if="loading" class="absolute right-10 top-1/2 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400">
            <ion-spinner name="crescent" class="w-5 h-5" />
          </div>
        </div>

        <!-- Selected items display for multiple select -->
        <div v-if="multiple && selectedItems.length > 0" class="flex flex-wrap gap-2 mt-2">
          <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300" v-for="item in selectedItems" :key="getOptionValue(item)">
            <span>{{ getOptionLabel(item) }}</span>
            <button
                type="button"
                class="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="removeSelectItem(getOptionValue(item))"
                :disabled="disabled"
            >
              <ion-icon :icon="closeCircle" class="text-sm" />
            </button>
          </div>
        </div>
      </template>

      <!-- Checkbox -->
      <template v-else-if="type === 'checkbox'">
        <div class="py-3">
          <ion-checkbox
              ref="inputRef"
              :model-value="modelValue"
              @ionChange="onCheckboxChange"
              @ionBlur="onBlur"
              @ionFocus="onFocus"
              :disabled="disabled || loading"
              :indeterminate="indeterminate"
              :class="{
              'has-error': hasError,
              'touched': isTouched,
              'has-store-error': hasStoreError
            }"
              :name="name"
          >
            <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">
              {{ label }}
              <span v-if="required" class="text-danger-500 dark:text-danger-400 ml-0.5">*</span>
            </span>
          </ion-checkbox>
        </div>
      </template>

      <!-- Radio Group -->
      <template v-else-if="type === 'radio'">
        <div class="py-2">
          <div class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {{ label }}
            <span v-if="required" class="text-danger-500 dark:text-danger-400 ml-0.5">*</span>
          </div>
          <ion-radio-group
              ref="inputRef"
              :model-value="modelValue"
              @ionChange="onRadioChange"
              :name="name"
          >
            <div class="flex flex-col gap-1">
              <ion-item
                  v-for="(option, index) in options"
                  :key="`radio-${index}-${getOptionValue(option)}`"
                  lines="none"
                  class="!pl-0 !pr-0 !min-h-[40px]"
              >
                <ion-radio
                    :value="getOptionValue(option)"
                    :disabled="disabled || loading || option.disabled"
                >
                  {{ getOptionLabel(option) }}
                </ion-radio>
              </ion-item>
            </div>
          </ion-radio-group>
        </div>
      </template>

      <!-- Toggle Switch -->
      <template v-else-if="type === 'toggle'">
        <div class="py-2">
          <ion-item lines="none" class="!pl-0 !pr-0">
            <ion-label class="text-sm text-gray-900 dark:text-gray-100">
              {{ label }}
              <span v-if="required" class="text-danger-500 dark:text-danger-400 ml-0.5">*</span>
            </ion-label>
            <ion-toggle
                ref="inputRef"
                :model-value="modelValue"
                @ionChange="onToggleChange"
                :disabled="disabled || loading"
                :name="name"
                :color="color"
                :class="{
                'has-error': hasError,
                'touched': isTouched,
                'has-store-error': hasStoreError
              }"
            />
          </ion-item>
        </div>
      </template>

      <!-- Range Slider -->
      <template v-else-if="type === 'range'">
        <div class="py-2">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ label }}
              <span v-if="required" class="text-danger-500 dark:text-danger-400 ml-0.5">*</span>
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ modelValue || min }}</span>
          </div>
          <ion-range
              ref="inputRef"
              :model-value="modelValue"
              @ionChange="onRangeChange"
              :min="min"
              :max="max"
              :step="step"
              :disabled="disabled || loading"
              :ticks="ticks"
              :snaps="snaps"
              :name="name"
              :class="{
              'has-error': hasError,
              'touched': isTouched,
              'has-store-error': hasStoreError
            }"
          />
        </div>
      </template>

      <!-- Regular Input (default) -->
      <template v-else>
        <div class="relative flex items-center" :class="{
          'has-prefix-icon': icon,
          'has-suffix': suffixIcon || suffixButton
        }">
          <div v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 pointer-events-none">
            <ion-icon :icon="icon" class="text-xl" />
          </div>

          <ion-input
              ref="inputRef"
              :model-value="modelValue"
              @ionInput="onInput"
              @ionBlur="onBlur"
              @ionFocus="onFocus"
              :label="required ? `${label} *` : label"
              :type="inputType"
              label-placement="floating"
              fill="outline"
              :placeholder="placeholder"
              :disabled="disabled || loading"
              :enterkeyhint="enterkeyhint"
              :clear-input="clearable"
              :readonly="readonly"
              :maxlength="maxlength"
              :min="min"
              :max="max"
              :step="step"
              :class="{
              'has-error': hasError,
              'touched': isTouched,
              'has-store-error': hasStoreError,
              'has-suffix-button': suffixButton
            }"
              :name="name"
              :autocomplete="autocomplete"
          />

          <div v-if="suffixIcon || suffixButton || validationLoading" class="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <div v-if="validationLoading" class="flex items-center justify-center text-primary-500 dark:text-primary-400">
              <ion-spinner name="crescent" class="w-5 h-5" />
            </div>
            <button
                v-else-if="suffixButton"
                @click="onSuffixClick"
                :disabled="suffixDisabled || disabled || suffixLoading"
                class="px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 min-h-[32px] hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                :class="[
                suffixColorClass,
                {
                  'opacity-70 cursor-wait': suffixLoading,
                  'px-3': suffixLabel,
                }
              ]"
                type="button"
            >
              <ion-spinner
                  v-if="suffixLoading"
                  name="crescent"
                  class="w-4 h-4"
              />
              <template v-else>
                <ion-icon
                    v-if="suffixIcon"
                    :icon="suffixIcon"
                    class="text-lg"
                />
                <span v-if="suffixLabel" class="whitespace-nowrap">{{ suffixLabel }}</span>
              </template>
            </button>
            <div
                v-else-if="suffixIcon"
                class="text-gray-500 dark:text-gray-400 flex items-center cursor-pointer hover:text-primary-500 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': suffixButton, 'opacity-50 cursor-not-allowed': suffixDisabled || disabled }"
                @click="!suffixDisabled && !disabled ? onSuffixIconClick($event) : null"
            >
              <ion-icon :icon="suffixIcon" class="text-xl" />
            </div>
          </div>
        </div>
      </template>

      <!-- Error Message -->
      <div v-if="showError" class="flex items-center gap-1.5 mt-1.5 text-danger-500 dark:text-danger-400 text-sm animate-slideDown">
        <ion-icon :icon="alertCircleOutline" />
        <span>{{ displayError }}</span>
      </div>

      <!-- Helper Text -->
      <div v-if="helperText && !hasError" class="text-gray-500 dark:text-gray-400 text-xs mt-1">
        {{ helperText }}
      </div>

      <!-- Character Counter -->
      <div v-if="showCounter && maxlength && type !== 'select' && type !== 'search'" class="text-gray-500 dark:text-gray-400 text-xs mt-1 text-right">
        {{ String(modelValue || '').length }} / {{ maxlength }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  IonToggle,
  IonRange,
  IonIcon,
  IonSpinner,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/vue'
import { alertCircleOutline, chevronDownOutline, closeCircle, searchOutline } from 'ionicons/icons'
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import type { Ref } from 'vue'
import type { SelectInterface } from '@ionic/core'
import { useFunction, useStore } from '@/composables/index.js'
import i18n from '@/i18n'

const { checkDuplicate } = useFunction()
const store = useStore()

const t = i18n.global.t

const validationLoading = ref(false)

interface SelectOption {
  value?: any
  label?: string
  name?: string
  name_bn?: string
  title?: string
  disabled?: boolean
  [key: string]: any
}

interface Props {
  modelValue?: any
  label?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'number' | 'url' | 'search' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'toggle' | 'range' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file'
  error?: string
  validate?: string
  loading?: boolean
  disabled?: boolean
  enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  validateOn?: 'input' | 'blur' | 'submit' | 'store' | 'change'
  debounceMs?: number
  clearable?: boolean
  helperText?: string
  name?: string
  autocomplete?: string
  storeErrorKey?: string
  icon?: any
  readonly?: boolean
  color?:string

  // Input specific
  maxlength?: number
  min?: number
  max?: number
  step?: number
  showCounter?: boolean

  // Textarea specific
  rows?: number
  autoGrow?: boolean

  // Select specific
  options?: SelectOption[]
  valueKey?: string
  labelKey?: string
  returnObject?: boolean
  multiple?: boolean
  selectInterface?: SelectInterface
  selectInterfaceOptions?: any
  compareWith?: (currentValue: any, compareValue: any) => boolean
  okText?: string
  cancelText?: string

  // Checkbox specific
  indeterminate?: boolean

  // Range specific
  ticks?: boolean
  snaps?: boolean

  // Suffix section props
  suffixIcon?: any
  suffixButton?: boolean
  suffixLabel?: string
  suffixColor?: string
  suffixDisabled?: boolean
  suffixLoading?: boolean

  // Search specific props
  showCancelButton?: 'never' | 'focus' | 'always'
  cancelButtonText?: string
  showClearButton?: 'focus' | 'always' | 'never'
  animated?: boolean
  searchSuggestions?: any[]
  suggestionKey?: string
  searchFunction?: (term: string) => Promise<any[]>
  onSearch?: (term: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  error: '',
  validate: '',
  loading: false,
  disabled: false,
  enterkeyhint: 'next',
  validateOn: 'blur',
  debounceMs: 300,
  clearable: false,
  autocomplete: 'off',
  icon: null,
  suffixIcon: null,
  suffixButton: false,
  suffixLabel: '',
  suffixColor: 'primary',
  suffixDisabled: false,
  suffixLoading: false,
  rows: 3,
  autoGrow: true,
  options: () => [],
  valueKey: 'id',
  labelKey: 'label',
  returnObject: false,
  multiple: false,
  selectInterface: 'popover',
  min: 0,
  max: 100,
  step: 1,
  indeterminate: false,
  showCounter: false,
  ticks: false,
  snaps: false,
  okText: 'OK',
  cancelText: 'Cancel',
  showCancelButton: 'never',
  cancelButtonText: 'Cancel',
  showClearButton: 'focus',
  animated: true,
  searchSuggestions: () => [],
  suggestionKey: 'label'
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any]
  'selected-data': [data: any]
  'blur': []
  'focus': []
  'valid': [isValid: boolean]
  'error': [error: string]
  'clear-store-error': [fieldName: string]
  'suffix-click': []
  'search': [term: string]
  'search-results': [results: any[]]
}>()

// Refs
const inputRef: Ref<any> = ref(null)
const internalError = ref('')
const isTouched = ref(false)
const internalValue = ref(props.modelValue)
const isFocused = ref(false)
const searchSuggestions = ref<any[]>([])
const searchResultCount = ref<number | null>(null)

// Select helpers
const getOptionValue = (option: any) => {
  if (typeof option !== 'object' || option === null) return option
  return props.returnObject ? option : option[props.valueKey]
}

const getOptionLabel = (option: any) => {
  if (typeof option !== 'object' || option === null) return String(option)
  return option[props.labelKey] || option.name || option.title || option.name_bn || option.label || 'Unknown'
}

const getSuggestionLabel = (suggestion: any) => {
  if (typeof suggestion !== 'object' || suggestion === null) return String(suggestion)
  return suggestion[props.suggestionKey] || suggestion.label || suggestion.name || suggestion.title || String(suggestion)
}

// Selected items for multiple select display
const selectedItems = computed(() => {
  if (!props.modelValue || props.options.length === 0) return []

  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.options.filter(opt => {
      const val = getOptionValue(opt)
      return props.modelValue.includes(val)
    })
  } else if (!props.multiple) {
    const found = props.options.find(opt => {
      const val = getOptionValue(opt)
      if (props.compareWith) return props.compareWith(val, props.modelValue)
      return val === props.modelValue
    })
    return found ? [found] : []
  }
  return []
})

const removeSelectItem = (value: any) => {
  if (props.disabled || !props.multiple || !Array.isArray(props.modelValue)) return
  const newValue = props.modelValue.filter((v: any) => v !== value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
  if (props.validateOn === 'change') runValidation(newValue)
}

// Computed
const inputType = computed(() => {
  const inputTypes = ['text', 'password', 'email', 'tel', 'number', 'url', 'search', 'date', 'time', 'datetime-local', 'month', 'week', 'color']
  return inputTypes.includes(props.type) ? props.type : 'text'
})

const storeErrorKey = computed(() => props.storeErrorKey || props.name)

const storeError = computed(() => {
  if (!storeErrorKey.value || !store.errors) return ''
  const keys = storeErrorKey.value.split('.')
  let errorObj: any = store.errors
  for (const key of keys) {
    if (errorObj && typeof errorObj === 'object' && key in errorObj) {
      errorObj = errorObj[key]
    } else {
      return ''
    }
  }
  if (Array.isArray(errorObj)) {
    return errorObj[0] || ''
  }
  return errorObj || ''
})

const hasStoreError = computed(() => !!storeError.value)
const required = computed(() => props.validate.includes('required'))
const hasError = computed(() => !!props.error || !!internalError.value || hasStoreError.value)

const displayError = computed(() => {
  if (props.error) return props.error
  if (storeError.value) return storeError.value
  return internalError.value
})

const showError = computed(() => {
  return hasError.value && (isTouched.value || hasStoreError.value || props.validateOn === 'store')
})

const suffixColorClass = computed(() => {
  if (!props.suffixButton) return ''
  const colorMap: Record<string, string> = {
    primary: 'text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    secondary: 'text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20',
    success: 'text-success-500 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/20',
    warning: 'text-warning-500 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20',
    danger: 'text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20',
    medium: 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
    dark: 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50',
    light: 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
  }
  return colorMap[props.suffixColor] || colorMap.primary
})

// Validators
type Validator = (value: any, param?: any) => boolean | string | Promise<boolean | string>
type Validators = Record<string, Validator>

const validators: Validators = {
  required: (v: any) => {
    if (props.type === 'select' && props.multiple) {
      return (Array.isArray(v) && v.length > 0) || t('validation.required')
    }
    return (v !== undefined && v !== null && v !== '' && v !== false) || t('validation.required')
  },

  email: (v: any) =>
      !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('validation.email'),

  min: (v: any, n: number) =>
      !v || (String(v).length >= n) || t('validation.min', { n }),

  max: (v: any, n: number) =>
      !v || (String(v).length <= n) || t('validation.max', { n }),

  max_number: (v: any, n: number) =>
      !v || Number(v) <= n || t('validation.max_number', { n }),
  min_number: (v: any, n: number) =>
      !v || Number(v) >= n || t('validation.min_number', { n }),

  percent: (v: any) => {
    if (!v && v !== 0) return true;

    const num = Number(v);

    return (!isNaN(num) && num >= 0 && num <= 100)
        || t('validation.percent');
  },

  numeric: (v: any) =>
      !v || /^[0-9]+$/.test(String(v)) || t('validation.numeric'),

  decimal: (v: any) =>
      !v || /^-?\d*(\.\d+)?$/.test(String(v)) || t('validation.decimal'),

  integer: (v: any) =>
      !v || /^-?\d+$/.test(String(v)) || t('validation.integer'),

  alpha: (v: any) =>
      !v || /^[A-Za-z]+$/.test(String(v)) || t('validation.alpha'),

  alpha_num: (v: any) =>
      !v || /^[A-Za-z0-9]+$/.test(String(v)) || t('validation.alpha_num'),

  username: (v: any) =>
      !v || /^[a-zA-Z0-9._-]+$/.test(String(v)) || t('validation.username'),

  phone: (v: any) => {
    if (!v) return true
    const digits = String(v).replace(/\D/g, '')
    if (digits.length >= 8 && digits.length <= 15) {
      if (digits.startsWith('0')) {
        return /^0[1-9]\d{7,13}$/.test(digits) || t('validation.phone')
      }
      return /^[1-9]\d{7,14}$/.test(digits) || t('validation.phone')
    }
    return t('validation.phone')
  },

  url: (v: any) =>
      !v ||
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/.test(String(v)) ||
      t('validation.url'),
  password: (v: any) =>
      !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(String(v)) || t('validation.password'),

  match: (v: any, param: string) =>
      !v || v === param || t('validation.match'),

  regex: (v: any, pattern: string) => {
    try {
      const regex = new RegExp(pattern)
      return !v || regex.test(String(v)) || t('validation.regex')
    } catch {
      return true
    }
  },

  unique: async (v: any, param: string) => {
    if (!v) return true

    const [tableName, field] = param.split(':')
    if (!tableName || !field) return true

    return new Promise((resolve) => {
      checkUniqueDebounced(v, param, resolve)
    })
  }
}

// Validation method
const runValidation = async (value: any): Promise<boolean> => {
  internalError.value = ''

  if (!props.validate) {
    emit('valid', true)
    return true
  }

  validationLoading.value = true

  try {
    const rules = props.validate.split('|').filter(Boolean)

    for (const rule of rules) {
      let validatorName = rule
      let param: any = undefined

      if (rule.includes(':')) {
        const parts = rule.split(':')
        validatorName = parts[0]
        param = parts.slice(1).join(':')
      }

      const validator = validators[validatorName]
      if (!validator) continue

      const result = await validator(value, param)

      if (result !== true) {
        internalError.value = result as string
        emit('error', internalError.value)
        emit('valid', false)
        return false
      }
    }

    emit('valid', true)
    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  } finally {
    validationLoading.value = false
  }
}

// Clear store error
const clearStoreError = () => {
  if (storeErrorKey.value && store.clearError) {
    store.clearError(storeErrorKey.value)
    emit('clear-store-error', storeErrorKey.value)
  }
}

// Debounced validation
const debouncedValidation = debounce((value: any) => {
  if (props.validateOn === 'input') {
    runValidation(value)
  }
}, props.debounceMs)

// Search specific functions
const performSearch = debounce(async (searchTerm: string) => {
  if (props.searchFunction) {
    try {
      const results = await props.searchFunction(searchTerm)
      searchSuggestions.value = results
      searchResultCount.value = results.length
      emit('search-results', results)
    } catch (error) {
      console.error('Search error:', error)
      searchSuggestions.value = []
      searchResultCount.value = 0
    }
  } else if (props.searchSuggestions && props.searchSuggestions.length > 0) {
    // Filter local suggestions
    const filtered = props.searchSuggestions.filter(suggestion => {
      const label = getSuggestionLabel(suggestion).toLowerCase()
      return label.includes(searchTerm.toLowerCase())
    })
    searchSuggestions.value = filtered
    searchResultCount.value = filtered.length
  } else {
    // Use options as suggestions if available
    if (props.options && props.options.length > 0) {
      const filtered = props.options.filter(option => {
        const label = getOptionLabel(option).toLowerCase()
        return label.includes(searchTerm.toLowerCase())
      })
      searchSuggestions.value = filtered
      searchResultCount.value = filtered.length
    }
  }

  emit('search', searchTerm)
}, props.debounceMs)

const onSearchInput = (event: any) => {
  const value = event.target.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)

  if (props.validateOn === 'input') {
    debouncedValidation(value)
  }

  // Perform search
  if (value && value.trim().length > 0) {
    performSearch(value)
  } else {
    searchSuggestions.value = []
    searchResultCount.value = null
  }
}

const onSearchChange = (event: any) => {
  const value = event.target.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)
  isTouched.value = true

  if (props.validateOn === 'change') {
    runValidation(value)
  }
}

const onSearchClear = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  searchSuggestions.value = []
  searchResultCount.value = null

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation('')
  }
}

const selectSuggestion = (suggestion: any) => {
  const value = getOptionValue(suggestion)
  internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  emit('selected-data', suggestion)
  searchSuggestions.value = []

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(value)
  }
}

// Event handlers
const onInput = (event: any) => {
  const value = event.target.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)

  if (props.validateOn === 'input') {
    debouncedValidation(value)
  }
}

const onSelectChange = (event: any) => {
  const value = event.target.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)
  isTouched.value = true

  // Emit full data object
  const fullData = props.options.find((opt: any) => getOptionValue(opt) === value)
  emit('selected-data', fullData)

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(value)
  }
}


const checkUniqueDebounced = debounce(async (v, param, resolve) => {
  const [tableName, field, ignoreUid] = param.split(':')

  try {
    const existing = await checkDuplicate({
      tableName,
      field,
      value: v,
      ignoreUid
    })

    if (!existing) return resolve(true)

    store.existingField = field
    store.existingData = existing

    resolve('This data already exists')

  } catch (err) {
    console.error(err)
    resolve(true)
  }
}, 500)

const onCheckboxChange = (event: any) => {
  const checked = event.detail.checked
  internalValue.value = checked

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', checked)
  emit('change', checked)
  isTouched.value = true

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(checked)
  }
}

const onRadioChange = (event: any) => {
  const value = event.detail.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)
  isTouched.value = true

  // Emit full data object
  const fullData = props.options.find((opt: any) => getOptionValue(opt) === value)
  emit('selected-data', fullData)

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(value)
  }
}

const onToggleChange = (event: any) => {
  const checked = event.detail.checked
  internalValue.value = checked

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', checked)
  emit('change', checked)
  isTouched.value = true

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(checked)
  }
}

const onRangeChange = (event: any) => {
  const value = event.detail.value
  internalValue.value = value

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('update:modelValue', value)
  emit('change', value)
  isTouched.value = true

  if (props.validateOn === 'change' || props.validateOn === 'input') {
    runValidation(value)
  }
}

const onBlur = () => {
  isTouched.value = true
  isFocused.value = false

  if (props.validateOn === 'blur' && !validationLoading.value) {
    runValidation(internalValue.value)
  }

  // Clear suggestions on blur after a short delay
  setTimeout(() => {
    if (!isFocused.value) {
      searchSuggestions.value = []
    }
  }, 200)

  emit('blur')
}

const onFocus = () => {
  isFocused.value = true

  if (hasStoreError.value) {
    clearStoreError()
  }

  emit('focus')
}

const onSuffixClick = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  if (!props.suffixDisabled && !props.disabled && !props.suffixLoading && !validationLoading.value) {
    emit('suffix-click')
  }
}

const onSuffixIconClick = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  if (!props.suffixDisabled && !props.disabled && !validationLoading.value) {
    emit('suffix-click')
  }
}

// Public methods
const focus = () => {
  inputRef.value?.$el?.setFocus?.()
}

const reset = () => {
  internalError.value = ''
  isTouched.value = false
  isFocused.value = false
  validationLoading.value = false
  searchSuggestions.value = []
  searchResultCount.value = null
  emit('update:modelValue', props.type === 'checkbox' || props.type === 'toggle' ? false : (props.multiple ? [] : ''))
  emit('valid', true)
  clearStoreError()
}

const validate = async (): Promise<boolean> => {
  isTouched.value = true
  return await runValidation(internalValue.value)
}

const open = () => {
  if (props.type === 'select') {
    inputRef.value?.$el?.open?.()
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue

  if (isTouched.value && props.validateOn !== 'store') {
    runValidation(newValue)
  }
}, { immediate: true })

// Watch for store errors
watch(storeError, (newError) => {
  if (newError && props.validateOn === 'store') {
    isTouched.value = true
    emit('error', newError)
    emit('valid', false)
  }
})

// Form registration
const registerInput = inject('registerInput', null)
const unregisterInput = inject('unregisterInput', null)

const api = {
  validate,
  reset,
  focus,
  open,
  clearSearch: () => {
    searchSuggestions.value = []
    searchResultCount.value = null
  }
}

onMounted(() => {
  registerInput?.(api)
})

onUnmounted(() => {
  debouncedValidation.cancel()
  performSearch.cancel()
  unregisterInput?.(api)
})

// Expose methods
defineExpose({
  focus,
  reset,
  validate,
  open,
  clearStoreError,
  getStoreError: () => storeError.value,
  hasStoreError: () => hasStoreError.value,
  isLoading: () => validationLoading.value,
  clearSearch: () => {
    searchSuggestions.value = []
    searchResultCount.value = null
  }
})
</script>

<style scoped>
  /* Input */
  :deep(ion-input) {
    --border-radius: 10px !important;
  }

  :deep(ion-textarea) {
    --border-radius: 10px !important;
  }

  :deep(ion-select) {
    --border-radius: 10px !important;
  }

/* Searchbar */
:deep(ion-searchbar.custom-searchbar) {
  --background: #ffffff;
  --box-shadow: none;
  --border-radius: 12px;
  --cancel-button-color: var(--ion-color-primary);
  --clear-button-color: #6b7280;
  --color: #111827;
  --icon-color: #6b7280;
  --placeholder-color: #9ca3af;
  --placeholder-font-style: normal;
  --placeholder-font-weight: 400;
  padding: 0;
  margin: 0;
  transition: all 0.3s ease;
}

/* Dark Theme */
html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar) {
  --background: #111827;
  --color: #f3f4f6;
  --icon-color: #9ca3af;
  --placeholder-color: #6b7280;
}

/* Search Container */
:deep(ion-searchbar.custom-searchbar .searchbar-input-container) {
  border-radius: 12px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  transition: all 0.3s ease;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar .searchbar-input-container) {
  background: #111827;
  border-color: #374151;
}

:deep(ion-searchbar.custom-searchbar .searchbar-input-container.sc-ion-searchbar-ios) {
  background: #ffffff;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar .searchbar-input-container.sc-ion-searchbar-ios) {
  background: #111827;
}

/* Search Input */
:deep(ion-searchbar.custom-searchbar .searchbar-input) {
  font-size: 16px;
  padding-left: 44px;
  padding-right: 44px;
}

/* Search Icon */
:deep(ion-searchbar.custom-searchbar .searchbar-search-icon) {
  left: 16px;
  color: #6b7280;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar .searchbar-search-icon) {
  color: #9ca3af;
}

/* Clear Button */
:deep(ion-searchbar.custom-searchbar .searchbar-clear-button) {
  right: 16px;
  color: #6b7280;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar .searchbar-clear-button) {
  color: #9ca3af;
}

/* Cancel Button */
:deep(ion-searchbar.custom-searchbar .searchbar-cancel-button) {
  margin-left: 8px;
  font-weight: 500;
}

/* Focus */
:deep(ion-searchbar.custom-searchbar.searchbar-has-focus .searchbar-input-container) {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.1);
}

/* Error */
:deep(ion-searchbar.custom-searchbar.has-error .searchbar-input-container) {
  border-color: #ef4444;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar.has-error .searchbar-input-container) {
  border-color: #f87171;
}

/* Warning */
:deep(ion-searchbar.custom-searchbar.has-store-error .searchbar-input-container) {
  border-color: #f59e0b;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar.has-store-error .searchbar-input-container) {
  border-color: #fbbf24;
}

/* Disabled */
:deep(ion-searchbar.custom-searchbar.disabled .searchbar-input-container) {
  background: #f3f4f6;
  opacity: 0.7;
  cursor: not-allowed;
}

html[data-theme="dark"] :deep(ion-searchbar.custom-searchbar.disabled .searchbar-input-container) {
  background: #1f2937;
}

/* Global Error States */
:deep(.has-error) {
  --border-color: #ef4444 !important;
}

:deep(.has-store-error) {
  --border-color: #f59e0b !important;
}

/* Suffix */
.has-suffix :deep(ion-input),
.has-suffix :deep(ion-textarea) {
  --padding-end: 40px !important;
}

.has-suffix :deep(ion-input.has-suffix-button),
.has-suffix :deep(ion-textarea.has-suffix-button) {
  --padding-end: 70px !important;
}

/* Animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease;
}



</style>