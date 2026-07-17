<template>
  <ion-modal :is-open="isOpen" @did-dismiss="close" :initial-breakpoint="0.40" :breakpoints="[0, 0.50]" class="image-picker-modal env_margin_bottom">
    <div class="px-4 pt-2 pb-6">

      <!-- Title -->
      <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-5 text-center">
        {{ $t('image_picker.title') }}
      </h3>

      <!-- Options -->
      <div class="space-y-3">
        <!-- Take Photo -->
        <ion-button
          expand="block"
          color="primary"
          class="m-3 font-semibold"
          style="--border-radius: 14px; --padding-top: 1rem; --padding-bottom: 1rem;"
          @click="takePhoto"
        >
          <ion-icon class="px-2" :icon="cameraOutline" slot="start" />
          {{ $t('image_picker.take_photo') }}
        </ion-button>

        <!-- Select from Gallery -->
        <ion-button
          expand="block"
          fill="outline"
          color="primary"
          class="m-3 font-semibold"
          style="--border-radius: 14px; --padding-top: 1rem; --padding-bottom: 1rem;"
          @click="selectFromGallery"
        >
          <ion-icon  class="px-2"  :icon="imagesOutline" slot="start" />
          {{ $t('image_picker.select_gallery') }}
        </ion-button>

        <!-- Delete Image (only show if image exists) -->
        <ion-button
          v-if="hasImage"
          expand="block"
          fill="clear"
          color="danger"
          class="m-3 font-semibold"
          style="--border-radius: 14px; --padding-top: 1rem; --padding-bottom: 1rem;"
          @click="deleteImage"
        >
          <ion-icon :icon="trashOutline" slot="start" />
          {{ $t('image_picker.delete_image') }}
        </ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup>
import { ref } from 'vue'
import { IonModal, IonButton, IonIcon, IonSpinner, toastController } from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { cameraOutline, imagesOutline, trashOutline } from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import { useFunction } from '@/composables/useFunction.js'

const { t } = useI18n()
const { uploadImageDataUrl, fileRemove } = useFunction()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  hasImage: {
    type: Boolean,
    default: false
  },
  // বর্তমানে যে image টা আছে তার server path (delete করার জন্য)
  currentImagePath: {
    type: String,
    default: null
  },
  edit:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isOpen', 'image-selected', 'image-deleted'])

const uploading = ref(false)

const close = () => {
  emit('update:isOpen', false)
}

/**
 * Camera / Gallery থেকে dataUrl নিয়ে server এ upload করে
 * আগের image থাকলে আগে সেটা server থেকে মুছে দেয়
 * server response এর file path emit করে
 */
const handleImageCapture = async (dataUrl) => {
  if (!dataUrl) return
  uploading.value = true
  close()
  try {
    // আগের image থাকলে আগে server থেকে remove করো
    if (props.currentImagePath) {
      await fileRemove(null, null, props.currentImagePath)
    }
    const serverPath = await uploadImageDataUrl(dataUrl)
    if (serverPath) {
      // server path + local dataUrl দুটো পাঠাই
      emit('image-selected', { serverPath, dataUrl })
    }
  } finally {
    uploading.value = false
  }
}

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      width: 1024,
      height: 1024,
      allowEditing: props.edit ? true : false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })
    console.log("handleImageCapture : "+image?.dataUrl.substring(0, 50) + "...")

    await handleImageCapture(image.dataUrl)
  } catch (err) {
    if (err.message !== 'User cancelled photos app') {
      const toast = await toastController.create({
        message: t('image_picker.error'),
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
      await toast.present()
    }
  }
}

const selectFromGallery = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      width: 1024,
      height: 1024,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    })
    console.log("handleImageCapture : "+image?.dataUrl.substring(0, 50) + "...")
    await handleImageCapture(image.dataUrl)
  } catch (err) {
    if (err.message !== 'User cancelled photos app') {
      const toast = await toastController.create({
        message: t('image_picker.error'),
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
      await toast.present()
    }
  }
}

const deleteImage = async () => {
  // যদি server এ আগের image থাকে সেটা delete করো
  if (props.currentImagePath) {
    await fileRemove(null, null, props.currentImagePath)
  }
  emit('image-deleted')
  close()
}
</script>

<style scoped>
.image-picker-modal {
  --border-radius: 24px 24px 0 0;
  --backdrop-opacity: 0.4;
}
</style>
