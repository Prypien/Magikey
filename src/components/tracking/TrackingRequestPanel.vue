<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <i class="fa fa-route text-gold"></i>
      Live-Anfahrt
    </div>

    <p v-if="!hasCoordinates" class="text-sm text-slate-500">
      Für dieses Unternehmen sind keine genauen Standortdaten hinterlegt. Bitte kontaktiere den Dienst telefonisch,
      um eine Ankunftszeit zu erhalten.
    </p>

    <div v-else>
      <div v-if="activeRequest" class="space-y-3">
        <p class="text-sm text-slate-600">
          <span v-if="activeRequest.status === 'arrived'">
            Der Schlüsseldienst sollte jetzt bei dir sein.
          </span>
          <span v-else>
            Der Schlüsseldienst ist unterwegs. Voraussichtliche Ankunft gegen
            <strong>{{ etaLabel }}</strong>.
          </span>
        </p>

        <div class="space-y-2">
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              class="h-full rounded-full bg-gold transition-all"
              :style="{ width: `${activeRequest.progressPercent}%` }"
            ></div>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>{{ distanceLabel }}</span>
            <span>
              {{ remainingLabel }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 text-xs text-slate-500">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1">
            <i class="fa fa-map-marker-alt text-gold"></i>
            {{ activeRequest.userLocation.label || 'Aktueller Standort' }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1">
            <i class="fa fa-clock text-gold"></i>
            Anfrage um {{ requestedLabel }}
          </span>
        </div>

        <button type="button" class="pill-checkbox text-sm" @click="stop">
          <i class="fa fa-stop"></i>
          Tracking beenden
        </button>
      </div>

      <div v-else class="space-y-3">
        <p class="text-sm text-slate-600">
          Starte das Tracking und verfolge, wie lange der Schlüsseldienst noch bis zu dir benötigt – ähnlich wie bei
          Lieferdiensten.
        </p>
        <button type="button" class="btn flex items-center justify-center gap-2 text-sm" :disabled="loading" @click="request">
          <template v-if="loading">
            <Loader :size="18" />
            <span>Standort wird ermittelt…</span>
          </template>
          <template v-else>
            <i class="fa fa-location-arrow"></i>
            Live-Tracking starten
          </template>
        </button>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Loader from '@/components/common/Loader.vue'
import { detectCurrentLocation } from '@/services/location'
import { useTrackingStore } from '@/stores/tracking'
import { formatDuration, formatEta } from '@/utils/time'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const { requests, startTracking, stopTracking } = useTrackingStore()

const loading = ref(false)
const error = ref('')
const companyId = computed(() => props.company?.id || props.company?.uid || null)
const hasCoordinates = computed(() => {
  const coords = props.company?.coordinates || {}
  const lat = coords.lat ?? props.company?.latitude
  const lng = coords.lng ?? props.company?.longitude
  return Number.isFinite(lat) && Number.isFinite(lng)
})

const activeRequest = computed(() => requests.value.find((req) => req.companyId === companyId.value) || null)

const etaLabel = computed(() => (activeRequest.value ? formatEta(activeRequest.value.etaTimestamp) : ''))
const distanceLabel = computed(() => {
  if (!activeRequest.value) return ''
  const distance = Number.parseFloat(activeRequest.value.distanceKm)
  if (!Number.isFinite(distance)) return ''
  return `${distance.toFixed(1)} km Entfernung`
})
const remainingLabel = computed(() => {
  if (!activeRequest.value) return ''
  if (activeRequest.value.status === 'arrived') return 'Ankunft erreicht'
  return `noch ${formatDuration(activeRequest.value.remainingMinutes, { short: true })}`
})
const requestedLabel = computed(() => {
  if (!activeRequest.value) return ''
  return formatEta(activeRequest.value.requestedAt)
})

async function request() {
  error.value = ''
  if (!companyId.value) {
    error.value = 'Unternehmen konnte nicht geladen werden.'
    return
  }
  if (!hasCoordinates.value) {
    error.value = 'Für dieses Unternehmen fehlen Standortdaten.'
    return
  }
  loading.value = true
  try {
    const location = await detectCurrentLocation({ enableHighAccuracy: true, timeout: 10000 })
    await startTracking(props.company, location)
  } catch (err) {
    error.value = err?.message || 'Standort konnte nicht ermittelt werden.'
  } finally {
    loading.value = false
  }
}

async function stop() {
  if (activeRequest.value) {
    try {
      await stopTracking(activeRequest.value.id)
    } catch (err) {
      error.value = err?.message || 'Tracking konnte nicht beendet werden.'
    }
  }
}
</script>
