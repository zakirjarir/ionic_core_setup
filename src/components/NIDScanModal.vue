<template>

  <ion-modal :is-open="isOpen" @did-dismiss="close" class="nid-scan-modal">

    <ion-header class="ion-no-border">

      <ion-toolbar class="bg-zinc-950">

        <ion-buttons slot="start">

          <ion-button fill="clear" color="light" @click="close">

            <ion-icon :icon="closeOutline" />

          </ion-button>

        </ion-buttons>

        <ion-title class="text-white text-base font-bold">{{ $t('nid_scan.title') }}</ion-title>

      </ion-toolbar>

    </ion-header>



    <ion-content class="bg-zinc-950">

      <!-- Camera Viewfinder -->

      <div class="flex flex-col items-center justify-center min-h-screen relative px-6 pb-32">



        <!-- Side Selection for Dual Capture Mode -->

        <div v-if="!scannedData && props.scanMode === 'dual'" class="w-full max-w-sm mb-4">

          <div class="flex gap-2 bg-zinc-900 rounded-xl p-1 border border-zinc-800">

            <button

                class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"

                :class="capturePhase === 'front' ? 'bg-indigo-600 text-white' : 'text-zinc-400'"

                @click="switchSide('front')"

            >

              {{ $t('nid_scan.front_side') }}

            </button>

            <button

                class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"

                :class="capturePhase === 'back' ? 'bg-indigo-600 text-white' : 'text-zinc-400'"

                @click="switchSide('back')"

            >

              {{ $t('nid_scan.back_side') }}

            </button>

          </div>

        </div>



        <!-- Viewfinder Box -->

        <div class="relative w-full max-w-sm aspect-[1.586/1] mb-8">

          <!-- Corner markers -->

          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>

          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>

          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>

          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>



          <!-- Scan line animation -->

          <div v-if="isScanning" class="absolute left-2 right-2 h-0.5 bg-indigo-400 opacity-80 scan-line"></div>



          <!-- Camera icon placeholder (replaces actual camera view in web) -->

          <video v-if="isPreviewing" ref="videoEl" class="absolute inset-0 w-full h-full object-cover" autoplay playsinline muted></video>



          <!-- Side badge when previewing in fast/dual mode -->

          <div v-if="isPreviewing && (props.scanMode === 'fast' || props.scanMode === 'dual')" class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1.5">

            <ion-icon :icon="capturePhase === 'front' ? cardOutline : documentTextOutline" class="text-xs" />

            {{ capturePhase === 'front' ? 'Front' : 'Back' }}

          </div>



          <!-- Captured image preview for dual mode -->

          <div v-if="frontData && capturePhase === 'back' && !isPreviewing" class="absolute inset-0 bg-zinc-900 flex items-center justify-center">

            <div class="text-center">

              <ion-icon :icon="checkmarkCircleOutline" class="text-5xl text-green-500 mb-2" />

              <p class="text-green-400 text-sm font-medium">{{ $t('nid_scan.front_captured') }}</p>

              <p class="text-zinc-500 text-xs mt-1">{{ $t('nid_scan.capture_back') }}</p>

            </div>

          </div>



          <div v-if="!isPreviewing && !frontData" class="absolute inset-0 flex items-center justify-center">

            <div class="text-center">

              <ion-icon :icon="isScanning ? hourglassOutline : cardOutline" class="text-7xl text-zinc-600" :class="{ 'animate-spin': isScanning }" />

              <p class="text-zinc-500 text-xs mt-2 max-w-[200px] leading-relaxed text-center">

                {{ isScanning ? $t('nid_scan.scanning') : $t('nid_scan.instruction') }}

              </p>

            </div>

          </div>

        </div>



        <!-- Result preview (after scan) -->

        <div v-if="scannedData" class="w-full max-w-sm bg-zinc-900 rounded-2xl p-4 border border-indigo-900/40 mb-6">

          <div class="flex items-center gap-2 mb-3">

            <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">

              <ion-icon :icon="checkmarkOutline" class="text-white text-sm" />

            </div>

            <span class="text-green-400 text-sm font-semibold">{{ $t('nid_scan.scan_success') }}</span>

          </div>

          <div class="space-y-2 text-sm">

            <div class="flex justify-between">

              <span class="text-zinc-400">{{ $t('nid_scan.nid_name') }}</span>

              <span class="text-zinc-200 font-medium">{{ scannedData.name || scannedData.front?.name }}</span>

            </div>

            <div class="flex justify-between">

              <span class="text-zinc-400">{{ $t('nid_scan.nid_number') }}</span>

              <span class="text-zinc-200 font-medium font-mono">{{ scannedData.nidNumber || scannedData.front?.nidNumber }}</span>

            </div>

            <div class="flex justify-between" v-if="scannedData.dob || scannedData.front?.dob">

              <span class="text-zinc-400">{{ $t('nid_scan.nid_dob') }}</span>

              <span class="text-zinc-200 font-medium">{{ scannedData.dob || scannedData.front?.dob }}</span>

            </div>

            <!-- Show back side data if available -->

            <div v-if="scannedData.back" class="pt-2 border-t border-zinc-800 mt-2">

              <div class="flex justify-between">

                <span class="text-zinc-400">{{ $t('nid_scan.back_side_data') }}</span>

                <span class="text-zinc-200 font-medium">{{ $t('nid_scan.captured') }}</span>

              </div>

            </div>

          </div>

        </div>



        <!-- Instructions -->

        <p v-if="!scannedData && !isScanning" class="text-zinc-500 text-xs text-center max-w-xs leading-relaxed mb-8">

          {{ props.scanMode === 'dual' ? $t('nid_scan.dual_instruction') : $t('nid_scan.instruction') }}

        </p>



        <!-- Progress indicator for dual mode -->

        <div v-if="props.scanMode === 'dual' && !scannedData && !isScanning" class="w-full max-w-sm mb-4">

          <div class="flex items-center gap-3">

            <div class="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">

              <div class="h-full bg-indigo-500 rounded-full transition-all duration-500" :style="{ width: dualProgress + '%' }"></div>

            </div>

            <span class="text-zinc-400 text-xs font-mono">{{ dualProgress }}%</span>

          </div>

          <p class="text-zinc-500 text-xs text-center mt-1.5">

            {{ capturePhase === 'front' ? $t('nid_scan.place_front') : $t('nid_scan.place_back') }}

          </p>

        </div>



        <!-- Action Buttons -->

        <div class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 to-transparent env_margin_bottom">

          <div class="max-w-sm mx-auto space-y-3">

            <!-- Main Action Button -->

            <ion-button

                v-if="!scannedData"

                expand="block"

                color="primary"

                :disabled="isScanning"

                @click="performScan"

                style="--border-radius: 14px; --padding-top: 1rem; --padding-bottom: 1rem;"

            >

              <ion-icon v-if="!isScanning" :icon="scanOutline" slot="start" />

              <ion-spinner v-else name="dots" slot="start" />

              {{ getButtonText }}

            </ion-button>



            <!-- Skip Button for dual mode -->

            <ion-button

                v-if="!scannedData && props.scanMode === 'dual' && frontData && capturePhase === 'back'"

                expand="block"

                fill="outline"

                color="warning"

                @click="skipBackCapture"

                style="--border-radius: 14px; --padding-top: 0.75rem; --padding-bottom: 0.75rem;"

            >

              <ion-icon :icon="arrowForwardOutline" slot="start" />

              {{ $t('nid_scan.skip_back') }}

            </ion-button>



            <!-- Confirm Button -->

            <ion-button

                v-if="scannedData"

                expand="block"

                color="success"

                @click="confirmData"

                style="--border-radius: 14px; --padding-top: 1rem; --padding-bottom: 1rem;"

            >

              <ion-icon :icon="checkmarkOutline" slot="start" />

              {{ $t('common.confirm') }}

            </ion-button>



            <!-- Retry Button -->

            <ion-button

                v-if="scannedData"

                expand="block"

                fill="outline"

                color="light"

                @click="retryScan"

                style="--border-radius: 14px; --padding-top: 0.75rem; --padding-bottom: 0.75rem;"

            >

              <ion-icon :icon="refreshOutline" slot="start" />

              {{ $t('common.retry') }}

            </ion-button>

          </div>

        </div>

      </div>

    </ion-content>

  </ion-modal>

</template>



<script setup>

import { ref, nextTick, computed } from 'vue'

import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSpinner, toastController } from '@ionic/vue'

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

import {

  closeOutline,

  cardOutline,

  scanOutline,

  checkmarkOutline,

  refreshOutline,

  hourglassOutline,

  documentTextOutline,

  checkmarkCircleOutline,

  arrowForwardOutline

} from 'ionicons/icons'

import { useI18n } from 'vue-i18n'



const { t } = useI18n()



const props = defineProps({

  isOpen: { type: Boolean, default: false },

  parentType: { type: String, default: 'father' }, // 'father' | 'mother'

  scanMode: { type: String, default: 'single' } // 'single' | 'fast' | 'dual'

})



const emit = defineEmits(['update:isOpen', 'nid-scanned'])



const isScanning = ref(false)

const scannedData = ref(null)



const videoEl = ref(null)

const stream = ref(null)

const isPreviewing = ref(false)

const capturePhase = ref('front') // 'front' | 'back' used in fast/dual mode

const frontData = ref(null)

const backData = ref(null)



// Computed progress for dual mode

const dualProgress = computed(() => {

  if (frontData.value && backData.value) return 100

  if (frontData.value) return 50

  return 0

})



// Dynamic button text

const getButtonText = computed(() => {

  if (isScanning.value) return t('nid_scan.scanning')

  if (isPreviewing.value) {

    if (props.scanMode === 'dual') {

      return capturePhase.value === 'front' ? t('nid_scan.capture_front') : t('nid_scan.capture_back')

    }

    return t('nid_scan.capture_button')

  }

  return t('nid_scan.scan_button')

})



const close = () => {

  // stop camera if active

  if (stream.value) {

    stream.value.getTracks().forEach(t => t.stop())

    stream.value = null

  }

  if (videoEl.value) videoEl.value.srcObject = null

  isPreviewing.value = false



  // reset scanning state

  scannedData.value = null

  isScanning.value = false

  frontData.value = null

  backData.value = null

  capturePhase.value = 'front'



  emit('update:isOpen', false)

}



/**

 * Switch between front and back sides in dual mode

 */

const switchSide = async (side) => {

  if (side === capturePhase.value) return



  // Stop current preview

  stopPreview()



  // Update phase

  capturePhase.value = side



  // Start preview for the new side

  if (props.scanMode === 'dual') {

    await startPreview()

  }

}



/**

 * Start camera preview

 */

const startPreview = async () => {

  try {

    if (!navigator?.mediaDevices?.getUserMedia) {

      throw new Error('Camera preview not supported')

    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })

    stream.value = mediaStream

    // ensure video element is mounted before assigning srcObject

    isPreviewing.value = true

    await nextTick()

    if (videoEl.value) {

      videoEl.value.srcObject = mediaStream

      // autoplay may be blocked; ensure muted and playsinline in template

      await videoEl.value.play().catch(() => {})

    }

  } catch (err) {

    const toast = await toastController.create({

      message: t('nid_scan.preview_failed') || 'Unable to open camera preview.',

      duration: 3000,

      color: 'danger',

      position: 'top'

    })

    await toast.present()

    console.error('startPreview error', err)

  }

}



const stopPreview = () => {

  if (stream.value) {

    stream.value.getTracks().forEach(t => t.stop())

    stream.value = null

  }

  if (videoEl.value) videoEl.value.srcObject = null

  isPreviewing.value = false

}



/**

 * Capture frame and extract data

 */

const captureFrame = async () => {

  if (!videoEl.value) return

  isScanning.value = true

  try {

    const video = videoEl.value

    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth || video.clientWidth || 1280

    canvas.height = video.videoHeight || video.clientHeight || 720

    const ctx = canvas.getContext('2d')

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)



    // stop preview to reduce CPU

    stopPreview()



    // simulate OCR processing

    await new Promise(resolve => setTimeout(resolve, 800))



    // simulated extracted data based on parent type and side

    const extracted = {

      name: props.parentType === 'father' ? 'MD. RASHIDUL ISLAM' : 'FATEMA BEGUM',

      nidNumber: props.parentType === 'father' ? '1992034567891' : '1995078934562',

      dob: props.parentType === 'father' ? '1992-03-15' : '1995-08-22',

      photo: dataUrl,

      side: capturePhase.value

    }



    // Handle different scan modes

    if (props.scanMode === 'dual') {

      if (capturePhase.value === 'front') {

        frontData.value = extracted

        // Show success toast and switch to back

        const toast = await toastController.create({

          message: t('nid_scan.front_captured') || '✅ Front side captured! Now capture the back side.',

          duration: 1500,

          color: 'success',

          position: 'top'

        })

        await toast.present()



        capturePhase.value = 'back'

        // Wait a moment then restart preview for back

        await new Promise(r => setTimeout(r, 500))

        isScanning.value = false

        await startPreview()

        return

      } else {

        backData.value = extracted

        // Combine front and back data

        scannedData.value = {

          front: frontData.value,

          back: backData.value

        }

        const toast = await toastController.create({

          message: t('nid_scan.both_sides_captured') || '✅ Both sides captured successfully!',

          duration: 1500,

          color: 'success',

          position: 'top'

        })

        await toast.present()

        isScanning.value = false

        return

      }

    } else if (props.scanMode === 'fast') {

      if (capturePhase.value === 'front') {

        frontData.value = extracted

        const toast = await toastController.create({

          message: t('nid_scan.front_captured') || 'Front captured — please flip to capture back side',

          duration: 1800,

          position: 'top'

        })

        await toast.present()

        capturePhase.value = 'back'

        await new Promise(r => setTimeout(r, 700))

        isScanning.value = false

        await startPreview()

        return

      } else {

        backData.value = extracted

        scannedData.value = { front: frontData.value, back: backData.value }

        capturePhase.value = 'front'

        frontData.value = null

        backData.value = null

        isScanning.value = false

        return

      }

    }



    // single mode: set scannedData directly

    scannedData.value = extracted

  } catch (err) {

    const toast = await toastController.create({

      message: t('nid_scan.scan_failed'),

      duration: 3000,

      color: 'danger',

      position: 'top'

    })

    await toast.present()

    console.error('captureFrame error', err)

  } finally {

    isScanning.value = false

  }

}



/**

 * Perform scan - opens camera or captures frame

 */

const performScan = async () => {

  // In dual mode, if front is already captured and we're in back phase, capture back

  if (props.scanMode === 'dual' && frontData.value && capturePhase.value === 'back' && !isPreviewing.value) {

    await startPreview()

    return

  }



  if (!isPreviewing.value) {

    await startPreview()

  } else {

    await captureFrame()

  }

}



/**

 * Skip back side capture in dual mode

 */

const skipBackCapture = async () => {

  if (frontData.value) {

    scannedData.value = { front: frontData.value, back: null }

    const toast = await toastController.create({

      message: t('nid_scan.using_front_only') || 'Using only front side data',

      duration: 1500,

      color: 'warning',

      position: 'top'

    })

    await toast.present()

  }

}



/**

 * Confirm and emit data

 */

const confirmData = () => {

  if (!scannedData.value) return



  // For dual mode, combine front and back data

  let dataToEmit = scannedData.value

  if (props.scanMode === 'dual' && scannedData.value.front) {

    dataToEmit = {

      ...scannedData.value.front,

      backData: scannedData.value.back,

      bothSides: true

    }

  }



  emit('nid-scanned', {

    parentType: props.parentType,

    data: dataToEmit,

    mode: props.scanMode

  })

  close()

}



/**

 * Retry scan

 */

const retryScan = () => {

  scannedData.value = null

  frontData.value = null

  backData.value = null

  capturePhase.value = 'front'

  isPreviewing.value = false

  stopPreview()

}



</script>



<style scoped>

.nid-scan-modal {

  --width: 100%;

  --height: 100%;

}



@keyframes scanMove {

  0% { top: 8px; }

  50% { top: calc(100% - 10px); }

  100% { top: 8px; }

}



.scan-line {

  animation: scanMove 2s linear infinite;

}

</style>