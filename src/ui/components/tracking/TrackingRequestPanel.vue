<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <i class="fa fa-clock text-gold"></i>
      Voraussichtliche Ankunftszeit
    </div>

    <p v-if="!hasCoordinates" class="text-sm text-slate-500">
      Für dieses Unternehmen sind keine genauen Standortdaten hinterlegt. Bitte kontaktiere den Dienst telefonisch,
      um eine Ankunftszeit zu erhalten.
    </p>

    <div v-else class="space-y-3">
      <div v-if="hasEstimate" class="space-y-3">
        <p class="text-sm text-slate-600">
          Basierend auf deinem bestätigten Standort und der Entfernung von
          <strong>{{ distanceLabel }}</strong> rechnen wir mit einer Ankunft gegen
          <strong>{{ etaLabel }}</strong>.
        </p>

        <div class="rounded-2xl border border-white/70 bg-white/80 p-4 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <i class="fa fa-road text-gold"></i>
            <span>Entfernung: {{ distanceLabel }}</span>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <i class="fa fa-hourglass-half text-gold"></i>
            <span>Fahrtzeit: {{ durationLabel }}</span>
          </div>
          <p class="mt-3 text-[11px] leading-relaxed">
            Hinweis: Dies ist eine grobe Schätzung auf Basis einer durchschnittlichen Fahrgeschwindigkeit.
            Die tatsächliche Ankunft kann abweichen.
          </p>
        </div>

        <button type="button" class="pill-checkbox text-sm" @click="changeLocation">
          <i class="fa fa-map-marker-alt"></i>
          Standort ändern
        </button>
      </div>

      <div v-else-if="userLocation" class="space-y-3">
        <p class="text-sm text-slate-600">
          Wir haben folgenden Standort gefunden:
          <strong>{{ userLocation.label || 'Aktueller Standort' }}</strong>. Bitte bestätige, dass dies korrekt ist,
          um die voraussichtliche Ankunft zu berechnen.
        </p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn flex items-center justify-center gap-2 text-sm" @click="confirmLocation">
            <i class="fa fa-check"></i>
            Standort bestätigen
          </button>
          <button type="button" class="pill-checkbox text-sm" @click="resetLocation">
            <i class="fa fa-sync-alt"></i>
            Erneut ermitteln
          </button>
        </div>
      </div>

      <div v-else class="space-y-3">
        <p class="text-sm text-slate-600">
          Um eine ungefähre Ankunftszeit zu erhalten, ermittel bitte deinen aktuellen Standort.
        </p>
        <button
          type="button"
          class="btn flex items-center justify-center gap-2 text-sm"
          :disabled="loading"
          @click="request"
        >
          <template v-if="loading">
            <Loader :size="18" />
            <span>Standort wird ermittelt…</span>
          </template>
          <template v-else>
            <i class="fa fa-location-arrow"></i>
            Standort ermitteln
          </template>
        </button>
      </div>

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Loader from '@/ui/components/common/Loader.vue'
import { detectCurrentLocation } from '@/core/services/location'
import { haversineDistance } from '@/core/utils/distance'
import { formatDuration, formatEta } from '@/core/utils/time'

const AVERAGE_SPEED_KMH = 35
const MIN_DURATION_MINUTES = 3

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const loading = ref(false)
const error = ref('')
const userLocation = ref(null)
const userLocationConfirmed = ref(false)
const hasCoordinates = computed(() => {
  const coords = props.company?.coordinates || {}
  const lat = coords.lat ?? props.company?.latitude
  const lng = coords.lng ?? props.company?.longitude
  return Number.isFinite(lat) && Number.isFinite(lng)
})

async function request() {
  error.value = ''
  if (!hasCoordinates.value) {
    error.value = 'Für dieses Unternehmen fehlen Standortdaten.'
    return
  }
  loading.value = true
  try {
    const location = await detectCurrentLocation({ enableHighAccuracy: true, timeout: 10000 })
    userLocation.value = location
    userLocationConfirmed.value = false
  } catch (err) {
    error.value = err?.message || 'Standort konnte nicht ermittelt werden.'
  } finally {
    loading.value = false
  }
}

function confirmLocation() {
  if (!userLocation.value) return
  userLocationConfirmed.value = true
}

function resetLocation() {
  userLocation.value = null
  userLocationConfirmed.value = false
  error.value = ''
}

function changeLocation() {
  userLocationConfirmed.value = false
}

const distanceKm = computed(() => {
  if (!userLocation.value || !hasCoordinates.value) return NaN
  const coords = props.company?.coordinates || {}
  const companyLat = coords.lat ?? props.company?.latitude
  const companyLng = coords.lng ?? props.company?.longitude
  return haversineDistance(companyLat, companyLng, userLocation.value.lat, userLocation.value.lng)
})

const estimatedMinutes = computed(() => {
  if (!Number.isFinite(distanceKm.value)) return NaN
  const duration = (distanceKm.value / AVERAGE_SPEED_KMH) * 60
  return Math.max(Math.round(duration), MIN_DURATION_MINUTES)
})

const etaLabel = computed(() => {
  if (!Number.isFinite(estimatedMinutes.value)) return ''
  const eta = Date.now() + estimatedMinutes.value * 60000
  return formatEta(eta)
})

const durationLabel = computed(() =>
  Number.isFinite(estimatedMinutes.value) ? formatDuration(estimatedMinutes.value) : ''
)

const distanceLabel = computed(() =>
  Number.isFinite(distanceKm.value) ? `${distanceKm.value.toFixed(1)} km` : ''
)

const hasEstimate = computed(() => userLocationConfirmed.value && Number.isFinite(estimatedMinutes.value))
</script>
