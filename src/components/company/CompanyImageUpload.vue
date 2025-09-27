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
import { ref } from 'vue'
import { uploadCompanyLogo } from '@/services/storage'

defineProps({
  initialImageUrl: String
})
const emit = defineEmits(['uploaded', 'upload-start', 'upload-end'])

const previewUrl = ref('')
const isUploading = ref(false)

function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    window.alert('Bitte ein Bild unter 3 MB auswählen.')
    return
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    window.alert('Nur JPEG oder PNG Bilder sind erlaubt.')
    return
  }
  previewUrl.value = window.URL.createObjectURL(file)
  isUploading.value = true
  emit('upload-start')
  uploadCompanyLogo(file)
    .then(url => {
      previewUrl.value = url
      emit('uploaded', url)
    })
    .catch(err => {
      console.error(err)
      window.alert('Fehler beim Hochladen des Bildes.')
    })
    .finally(() => {
      isUploading.value = false
      emit('upload-end')
    })
}
</script>
