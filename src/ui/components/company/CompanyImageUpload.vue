<!-- Diese Datei kümmert sich um das Hochladen eines Firmenlogos. -->
<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <div class="relative">
      <div
        class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner"
      >
        <img
          :src="previewUrl || initialImageUrl || '/logo.png'"
          class="h-full w-full object-cover"
          alt="Logo"
        />
      </div>
      <div
        v-if="isUploading"
        class="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/70 backdrop-blur"
      >
        <i class="fa fa-spinner fa-spin text-gold"></i>
      </div>
    </div>
    <label class="pill-checkbox cursor-pointer px-5 py-2">
      <i class="fa fa-upload text-gold"></i>
      <span>Logo hochladen</span>
      <input
        type="file"
        accept="image/*"
        class="sr-only"
        @change="uploadImage"
      />
    </label>
    <p class="text-xs text-slate-500">PNG oder JPG bis 3&nbsp;MB empfohlen.</p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { uploadCompanyLogo } from '@/core/services/storage'

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png'])

defineProps({
  initialImageUrl: String
})
const emit = defineEmits(['uploaded', 'upload-start', 'upload-end'])

const previewUrl = ref('')
const isUploading = ref(false)
const objectUrl = ref('')

function resetInput(eventTarget) {
  if (eventTarget && 'value' in eventTarget) {
    eventTarget.value = ''
  }
}

function revokeObjectUrl() {
  if (objectUrl.value && typeof URL?.revokeObjectURL === 'function') {
    URL.revokeObjectURL(objectUrl.value)
  }
  objectUrl.value = ''
}

function createObjectUrl(file) {
  if (typeof URL?.createObjectURL === 'function') {
    return URL.createObjectURL(file)
  }
  return ''
}

async function uploadImage(event) {
  const input = event.target
  const file = input?.files?.[0]
  resetInput(input)

  if (!file) return

  if (file.size > MAX_FILE_SIZE_BYTES) {
    window.alert('Bitte ein Bild unter 3 MB auswählen.')
    return
  }

  const fileType = file.type?.toLowerCase?.() || ''
  if (!ACCEPTED_TYPES.has(fileType)) {
    window.alert('Nur JPEG oder PNG Bilder sind erlaubt.')
    return
  }

  revokeObjectUrl()
  const temporaryUrl = createObjectUrl(file)
  objectUrl.value = temporaryUrl
  previewUrl.value = temporaryUrl

  isUploading.value = true
  emit('upload-start')

  try {
    const url = await uploadCompanyLogo(file)
    previewUrl.value = url
    emit('uploaded', url)
  } catch (error) {
    console.error('Fehler beim Hochladen des Logos', error)
    window.alert('Fehler beim Hochladen des Bildes.')
    previewUrl.value = ''
  } finally {
    revokeObjectUrl()
    isUploading.value = false
    emit('upload-end')
  }
}

onBeforeUnmount(revokeObjectUrl)
</script>
