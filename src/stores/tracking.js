// Zustand und Hilfsfunktionen für Live-Anfahrts-Tracking.
import { computed, ref } from 'vue'
import { haversineDistance } from '@/utils/distance'

const STORAGE_KEY = 'magikey-tracking-requests'
const AVERAGE_SPEED_KMH = 35
const MIN_DURATION_MINUTES = 3
const CLEANUP_AFTER_MIN = 30
const UPDATE_INTERVAL_MS = 15000

function loadFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (error) {
    console.warn('Konnte Tracking-Daten nicht laden:', error)
    return []
  }
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Konnte Tracking-Daten nicht speichern:', error)
  }
}

const requestsState = ref(loadFromStorage())
const nowTick = ref(Date.now())

function cleanupRequests() {
  const now = Date.now()
  const keepUntil = CLEANUP_AFTER_MIN * 60 * 1000
  const filtered = requestsState.value.filter((request) => request.eta + keepUntil > now)
  if (filtered.length !== requestsState.value.length) {
    requestsState.value = filtered
    saveToStorage(filtered)
  }
}

if (typeof window !== 'undefined') {
  window.setInterval(() => {
    nowTick.value = Date.now()
    cleanupRequests()
  }, UPDATE_INTERVAL_MS)
}

function estimateDurationMinutes(distanceKm) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return MIN_DURATION_MINUTES
  }
  const duration = (distanceKm / AVERAGE_SPEED_KMH) * 60
  return Math.max(Math.round(duration), MIN_DURATION_MINUTES)
}

function normaliseCompany(company) {
  return {
    id: company?.id || company?.uid || null,
    name: company?.company_name || company?.name || 'Unbekannter Dienst',
    lat: company?.coordinates?.lat ?? company?.latitude,
    lng: company?.coordinates?.lng ?? company?.longitude,
  }
}

function normaliseLocation(location) {
  return {
    lat: location?.lat,
    lng: location?.lng,
    label: location?.label || location?.city || 'Aktueller Standort',
    postalCode: location?.postalCode || '',
  }
}

const requests = computed(() => {
  const now = nowTick.value
  return requestsState.value.map((request) => {
    const totalMs = request.eta - request.requestedAt
    const remainingMs = Math.max(request.eta - now, 0)
    const elapsedMs = Math.min(Math.max(now - request.requestedAt, 0), totalMs)
    const totalMinutes = totalMs / 60000
    const remainingMinutes = remainingMs / 60000
    const progress = totalMs > 0 ? elapsedMs / totalMs : 1
    const status = remainingMs <= 0 ? 'arrived' : 'en_route'

    return {
      ...request,
      totalMinutes,
      remainingMinutes,
      progressPercent: Math.min(Math.max(Math.round(progress * 100), 0), 100),
      status,
      etaTimestamp: request.eta,
    }
  })
})

function persist() {
  saveToStorage(requestsState.value)
}

function stopTracking(requestId) {
  const filtered = requestsState.value.filter((request) => request.id !== requestId)
  if (filtered.length !== requestsState.value.length) {
    requestsState.value = filtered
    persist()
  }
}

function startTracking(companyInput, userLocationInput) {
  const company = normaliseCompany(companyInput)
  const location = normaliseLocation(userLocationInput)

  if (!company.id) {
    throw new Error('Es konnte keine Firmen-ID ermittelt werden.')
  }
  if (!Number.isFinite(company.lat) || !Number.isFinite(company.lng)) {
    throw new Error('Für diese Firma sind keine Standortkoordinaten hinterlegt.')
  }
  if (!Number.isFinite(location.lat) || !Number.isFinite(location.lng)) {
    throw new Error('Der Benutzerstandort konnte nicht bestimmt werden.')
  }

  const distanceKm = haversineDistance(company.lat, company.lng, location.lat, location.lng)
  const durationMinutes = estimateDurationMinutes(distanceKm)
  const now = Date.now()

  const existingIndex = requestsState.value.findIndex((request) => request.companyId === company.id)
  const request = {
    id: `trk-${now}`,
    companyId: company.id,
    companyName: company.name,
    companyLocation: { lat: company.lat, lng: company.lng },
    userLocation: location,
    distanceKm,
    durationMinutes,
    requestedAt: now,
    eta: now + durationMinutes * 60000,
  }

  if (existingIndex >= 0) {
    requestsState.value.splice(existingIndex, 1, request)
  } else {
    requestsState.value = [...requestsState.value, request]
  }

  persist()
  return request
}

export function useTrackingStore() {
  return {
    requests,
    startTracking,
    stopTracking,
  }
}
