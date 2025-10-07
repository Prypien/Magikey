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
          <div class="flex items-start gap-2 text-slate-600">
            <i class="fa fa-location-dot mt-0.5 text-gold"></i>
            <div>
              <p class="font-medium text-slate-700">Dein bestätigter Standort</p>
              <p>{{ userLocationLabel }}</p>
              <p v-if="userLocationCoordinatesLabel" class="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                Koordinaten: {{ userLocationCoordinatesLabel }}
              </p>
            </div>
          </div>

          <div v-if="userLocationMapUrl" class="mt-3 overflow-hidden rounded-xl border border-white/60 bg-white/60">
            <iframe
              :src="userLocationMapUrl"
              class="h-40 w-full"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Bestätigter Standort auf Google Maps"
            ></iframe>
          </div>

          <div class="mt-3 flex items-center gap-2">
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
          <strong>{{ userLocationLabel }}</strong>. Bitte bestätige, dass dies korrekt ist, um die
          voraussichtliche Ankunft zu berechnen.
        </p>
        <p v-if="userLocationCoordinatesLabel" class="text-xs uppercase tracking-wide text-slate-400">
          Koordinaten: {{ userLocationCoordinatesLabel }}
        </p>
        <div v-if="userLocationMapUrl" class="overflow-hidden rounded-xl border border-white/60 bg-white/60">
          <iframe
            :src="userLocationMapUrl"
            class="h-40 w-full"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Gefundener Standort auf Google Maps"
          ></iframe>
        </div>
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

const userLocationLabel = computed(() => {
  const current = userLocation.value
  if (!current) return 'Aktueller Standort'
  const candidate = current.label || `${current.postalCode || ''} ${current.city || ''}`.trim()
  if (candidate) return candidate
  if (Number.isFinite(current.lat) && Number.isFinite(current.lng)) {
    return `Lat ${current.lat.toFixed(5)}, Lng ${current.lng.toFixed(5)}`
  }
  return 'Aktueller Standort'
})

const userLocationCoordinatesLabel = computed(() => {
  const current = userLocation.value
  if (!current) return ''
  if (!Number.isFinite(current.lat) || !Number.isFinite(current.lng)) return ''
  return `${current.lat.toFixed(5)}°, ${current.lng.toFixed(5)}°`
})

const userLocationMapUrl = computed(() => {
  const current = userLocation.value
  if (!current) return ''
  const { lat, lng } = current
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return ''

  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: '15',
    hl: 'de',
    output: 'embed',
  })

  return `https://www.google.com/maps?${params.toString()}`
})
</script>
