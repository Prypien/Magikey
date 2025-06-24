<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <img
        :src="previewUrl || initialImageUrl || '/logo.png'"
        class="w-24 h-24 rounded-full object-cover border"
        alt="Logo"
      />
      <div v-if="uploading" class="absolute inset-0 flex items-center justify-center">
        <div class="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    <input
      type="file"
      accept="image/*"
      class="mt-2 text-sm"
      @change="uploadImage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadCompanyLogo } from '@/services/storage'

const props = defineProps({
  initialImageUrl: String
})
const emit = defineEmits(['uploaded'])

const uploading = ref(false)
const previewUrl = ref('')

const uploadImage = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    alert('Bitte ein Bild unter 3 MB auswählen.')
    return
  }

  uploading.value = true
  try {
    const url = await uploadCompanyLogo(file)
    previewUrl.value = url
    emit('uploaded', url)
  } catch (err) {
    alert(err.message)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
</style>
