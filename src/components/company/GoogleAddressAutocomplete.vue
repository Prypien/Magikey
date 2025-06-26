<template>
  <div>
    <input
      ref="input"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-gold transition"
      placeholder="Adresse"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue', 'placeChanged'])

const input = ref(null)
let autocomplete

function init() {
  if (!window.google || !window.google.maps) return
  autocomplete = new window.google.maps.places.Autocomplete(input.value)
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    emit('update:modelValue', input.value.value)
    emit('placeChanged', {
      formatted: place.formatted_address,
      components: place.address_components,
      lat: place.geometry?.location.lat() || null,
      lng: place.geometry?.location.lng() || null,
      placeId: place.place_id || ''
    })
  })
}

onMounted(() => {
  if (window.google && window.google.maps) {
    init()
  } else {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = init
    document.head.appendChild(script)
  }
})
</script>
