<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <img
        :src="previewUrl || initialImageUrl || '/logo.png'"
        class="w-24 h-24 rounded-full object-cover border"
        alt="Logo"
      />
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

defineProps({
  initialImageUrl: String
})
const emit = defineEmits(['selected'])

const previewUrl = ref('')

function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    window.alert('Bitte ein Bild unter 3 MB auswählen.')
    return
  }

  previewUrl.value = window.URL.createObjectURL(file)
  emit('selected', file)
}
</script>
