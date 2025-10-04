// Zustand und Hilfsfunktionen für Live-Anfahrts-Tracking.
import { computed, ref } from 'vue'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/firebase'
import { haversineDistance } from '@/utils/distance'

const COLLECTION_NAME = 'tracking_requests'
const AVERAGE_SPEED_KMH = 35
const MIN_DURATION_MINUTES = 3
const CLEANUP_AFTER_MIN = 30
const UPDATE_INTERVAL_MS = 15000

const requestsState = ref([])
const nowTick = ref(Date.now())
const companyStream = ref({ companyId: null, loading: false, error: '' })

let unsubscribeCompany = null

function toMillis(value) {
  if (!value) return null
  if (typeof value === 'number') return value
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value.toMillis === 'function') return value.toMillis()
  return null
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

function clampPercent(value) {
  return Math.min(Math.max(Math.round(value * 100), 0), 100)
}

function upsertRequest(request) {
  const index = requestsState.value.findIndex((item) => item.id === request.id)
  if (index >= 0) {
    const existing = requestsState.value[index]
    requestsState.value.splice(index, 1, {
      ...existing,
      ...request,
      clientSecret: request.clientSecret ?? existing.clientSecret ?? null,
      _source: request._source || existing._source || 'local',
    })
  } else {
    requestsState.value = [...requestsState.value, request]
  }
}

function removeRequest(id, predicate = () => true) {
  const filtered = requestsState.value.filter((request) => !(request.id === id && predicate(request)))
  if (filtered.length !== requestsState.value.length) {
    requestsState.value = filtered
  }
}

function removeRemoteRequests() {
  const filtered = requestsState.value.filter((request) => request._source !== 'remote')
  if (filtered.length !== requestsState.value.length) {
    requestsState.value = filtered
  }
}

function cleanupRequests() {
  const now = Date.now()
  const keepUntil = CLEANUP_AFTER_MIN * 60 * 1000
  const filtered = requestsState.value.filter((request) => {
    if (request.status === 'cancelled') {
      return false
    }
    if (request._source === 'remote') {
      return true
    }
    const eta = Number.isFinite(request.eta) ? request.eta : now
    return eta + keepUntil > now
  })
  if (filtered.length !== requestsState.value.length) {
    requestsState.value = filtered
  }
}

if (typeof window !== 'undefined') {
  window.setInterval(() => {
    nowTick.value = Date.now()
    cleanupRequests()
  }, UPDATE_INTERVAL_MS)
}

function resolveCrypto() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto
  }
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto
  }
  return null
}

function generateClientSecret() {
  const cryptoImpl = resolveCrypto()
  if (cryptoImpl?.randomUUID) {
    return cryptoImpl.randomUUID()
  }

  if (cryptoImpl?.getRandomValues) {
    const buffer = new Uint8Array(16)
    cryptoImpl.getRandomValues(buffer)
    const hex = Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('')
    return `sec-${hex}`
  }

  return `sec-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}

function buildLocalRequest({
  id,
  company,
  location,
  distanceKm,
  durationMinutes,
  now,
  clientSecret,
}) {
  const eta = now + durationMinutes * 60000
  return {
    id,
    companyId: company.id,
    companyName: company.name,
    companyLocation: { lat: company.lat, lng: company.lng },
    userLocation: location,
    distanceKm,
    durationMinutes,
    requestedAt: now,
    eta,
    status: 'en_route',
    clientSecret,
    createdAt: now,
    updatedAt: now,
    endedAt: null,
    _source: 'local',
  }
}

function normaliseSnapshot(docSnap) {
  const data = docSnap.data() || {}
  const requestedAt = toMillis(data.requestedAt) ?? Date.now()
  const eta = toMillis(data.eta) ?? requestedAt
  return {
    id: docSnap.id,
    companyId: data.companyId || null,
    companyName: data.companyName || 'Unbekannter Dienst',
    companyLocation: data.companyLocation || {},
    userLocation: data.userLocation || {},
    distanceKm: Number.isFinite(data.distanceKm) ? data.distanceKm : 0,
    durationMinutes: Number.isFinite(data.durationMinutes) ? data.durationMinutes : MIN_DURATION_MINUTES,
    requestedAt,
    eta,
    status: data.status || 'en_route',
    clientSecret: null,
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    endedAt: toMillis(data.endedAt),
    _source: 'remote',
  }
}

const requests = computed(() => {
  const now = nowTick.value
  return requestsState.value
    .filter((request) => request.status !== 'cancelled')
    .map((request) => {
      const requestedAt = request.requestedAt
      const eta = request.eta
      const totalMs = Math.max(eta - requestedAt, 0)
      const remainingMs = Math.max(eta - now, 0)
      const elapsedMs = Math.min(Math.max(now - requestedAt, 0), totalMs)
      const totalMinutes = totalMs / 60000
      const remainingMinutes = remainingMs / 60000
      const status = request.status === 'cancelled' ? 'cancelled' : remainingMs <= 0 ? 'arrived' : request.status || 'en_route'
      return {
        ...request,
        totalMinutes,
        remainingMinutes,
        progressPercent: clampPercent(totalMs > 0 ? elapsedMs / totalMs : 1),
        status,
        etaTimestamp: eta,
      }
    })
})

async function startTracking(companyInput, userLocationInput) {
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
  const clientSecret = generateClientSecret()

  const docRef = db && isFirebaseConfigured ? doc(collection(db, COLLECTION_NAME)) : null
  const requestId = docRef ? docRef.id : `trk-${now}`

  const request = buildLocalRequest({
    id: requestId,
    company,
    location,
    distanceKm,
    durationMinutes,
    now,
    clientSecret,
  })

  // Remove previous local request for the same company
  requestsState.value = requestsState.value.filter(
    (item) => item.companyId !== company.id || item.id === requestId || item._source === 'remote'
  )

  upsertRequest(request)

  if (!docRef) {
    console.warn('Firestore ist nicht konfiguriert. Tracking-Anfrage wird nur lokal gehalten.')
    return request
  }

  try {
    await setDoc(docRef, {
      companyId: request.companyId,
      companyName: request.companyName,
      companyLocation: request.companyLocation,
      userLocation: request.userLocation,
      distanceKm: request.distanceKm,
      durationMinutes: request.durationMinutes,
      requestedAt: Timestamp.fromMillis(request.requestedAt),
      eta: Timestamp.fromMillis(request.eta),
      status: request.status,
      clientSecret: request.clientSecret,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return request
  } catch (error) {
    console.error('Konnte Tracking-Anfrage nicht speichern:', error)
    removeRequest(request.id)
    throw new Error('Tracking-Anfrage konnte nicht übermittelt werden. Bitte versuche es erneut.')
  }
}

async function stopTracking(requestId) {
  const index = requestsState.value.findIndex((request) => request.id === requestId)
  if (index < 0) {
    return
  }

  const existing = requestsState.value[index]
  const endedAt = Date.now()
  const optimistic = {
    ...existing,
    status: 'cancelled',
    endedAt,
    updatedAt: endedAt,
  }
  requestsState.value.splice(index, 1, optimistic)

  if (!db || !isFirebaseConfigured) {
    cleanupRequests()
    return
  }

  try {
    await updateDoc(doc(db, COLLECTION_NAME, requestId), {
      status: 'cancelled',
      endedAt: Timestamp.fromMillis(endedAt),
      updatedAt: serverTimestamp(),
    })
    cleanupRequests()
  } catch (error) {
    console.error('Konnte Tracking nicht stoppen:', error)
    requestsState.value.splice(index, 1, existing)
    throw new Error('Tracking konnte nicht beendet werden. Bitte versuche es erneut.')
  }
}

function subscribeToCompanyRequests(companyId) {
  if (companyId === companyStream.value.companyId && typeof unsubscribeCompany === 'function') {
    return
  }

  unsubscribeFromCompanyRequests()

  if (!companyId) {
    return
  }

  if (!db || !isFirebaseConfigured) {
    companyStream.value = {
      companyId,
      loading: false,
      error: 'Firebase ist nicht konfiguriert. Live-Tracking ist deaktiviert.',
    }
    return
  }

  companyStream.value = { companyId, loading: true, error: '' }

  try {
    const trackingCollection = collection(db, COLLECTION_NAME)
    const q = query(trackingCollection, where('companyId', '==', companyId), orderBy('requestedAt', 'desc'))
    unsubscribeCompany = onSnapshot(
      q,
      (snapshot) => {
        companyStream.value = { companyId, loading: false, error: '' }
        const nextIds = new Set()
        snapshot.forEach((docSnap) => {
          const normalised = normaliseSnapshot(docSnap)
          nextIds.add(normalised.id)
          upsertRequest(normalised)
        })
        requestsState.value = requestsState.value.filter((request) => {
          if (request._source !== 'remote') {
            return true
          }
          return nextIds.has(request.id)
        })
      },
      (error) => {
        console.error('Fehler beim Beobachten der Tracking-Anfragen:', error)
        companyStream.value = {
          companyId,
          loading: false,
          error: 'Tracking-Anfragen konnten nicht geladen werden.',
        }
      }
    )
  } catch (error) {
    console.error('Konnte Tracking-Stream nicht initialisieren:', error)
    companyStream.value = {
      companyId,
      loading: false,
      error: 'Tracking-Anfragen konnten nicht geladen werden.',
    }
  }
}

function unsubscribeFromCompanyRequests() {
  if (typeof unsubscribeCompany === 'function') {
    unsubscribeCompany()
  }
  unsubscribeCompany = null
  companyStream.value = { companyId: null, loading: false, error: '' }
  removeRemoteRequests()
}

export function useTrackingStore() {
  return {
    requests,
    startTracking,
    stopTracking,
    subscribeToCompanyRequests,
    unsubscribeFromCompanyRequests,
    companyStream,
  }
}
