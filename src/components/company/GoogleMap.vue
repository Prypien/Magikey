<template>
  <div ref="mapEl" class="map-container w-full h-64 rounded" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  lat: Number,
  lng: Number
})

const mapEl = ref(null)
let map
let marker

function initMap() {
  if (!window.google || !window.google.maps) return
  const center = { lat: props.lat, lng: props.lng }
  map = new window.google.maps.Map(mapEl.value, {
    center,
    zoom: 15
  })
  marker = new window.google.maps.Marker({
    position: center,
    map
  })
}

function load() {
  if (window.google && window.google.maps) {
    initMap()
  } else {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = initMap
    document.head.appendChild(script)
  }
}

onMounted(load)

watch(() => [props.lat, props.lng], ([lat, lng]) => {
  if (!map || !marker) return
  const pos = { lat, lng }
  map.setCenter(pos)
  marker.setPosition(pos)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 250px;
}
</style>
