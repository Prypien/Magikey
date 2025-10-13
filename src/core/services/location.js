// Dienstfunktionen für Standort- und Ortssuche.
import { getPostalFromCoords } from '@/core/firebase/functions'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

function normaliseCity(address = {}) {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.county ||
    ''
  )
}

function buildLabel({ postalCode, city }) {
  const trimmedPostal = postalCode?.toString().trim() || ''
  const trimmedCity = city?.toString().trim() || ''
  if (trimmedPostal && trimmedCity) return `${trimmedPostal} ${trimmedCity}`
  if (trimmedPostal) return trimmedPostal
  if (trimmedCity) return trimmedCity
  return ''
}

export async function searchLocations(query, { limit = 6, signal } = {}) {
  const cleanQuery = query?.toString().trim()
  if (!cleanQuery) return []

  const params = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: limit.toString(),
    countrycodes: 'de,at,ch',
    q: cleanQuery,
    email: 'kontakt@magikey.app'
  })

  const res = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  })

  if (!res.ok) {
    throw new Error('Ortssuche fehlgeschlagen')
  }

  const data = await res.json()
  return data.map((item) => {
    const address = item.address || {}
    const postalCode = address.postcode || ''
    const city = normaliseCity(address)
    const label = buildLabel({ postalCode, city }) || (item.display_name || '').split(',')[0]?.trim() || ''
    return {
      id: item.place_id,
      label,
      postalCode,
      city,
      lat: Number.parseFloat(item.lat),
      lng: Number.parseFloat(item.lon),
      source: 'search'
    }
  })
}

export async function reverseGeocode(lat, lng, { signal } = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error('Ungültige Koordinaten')
  }

  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    addressdetails: '1',
    zoom: '18',
    email: 'kontakt@magikey.app'
  })

  const res = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  })

  if (!res.ok) {
    throw new Error('Reverse Geocoding fehlgeschlagen')
  }

  const data = await res.json()
  const address = data.address || {}
  const postalCode = address.postcode || ''
  const city = normaliseCity(address)

  return {
    postalCode,
    city,
    label: buildLabel({ postalCode, city }),
    lat,
    lng,
    source: 'reverse'
  }
}

function isAbortError(error, signal) {
  if (signal?.aborted) {
    return true
  }

  if (!error) {
    return false
  }

  if (error.name === 'AbortError' || error.code === 'ABORT_ERR') {
    return true
  }

  if (typeof error.code === 'number' && typeof DOMException !== 'undefined') {
    return error.code === DOMException.ABORT_ERR
  }

  return false
}

async function getGeolocationPosition(options) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocation wird nicht unterstützt')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export async function detectCurrentLocation(options) {
  const normalizedOptions = options ?? {}

  let signal
  let geolocationOptions

  if (typeof normalizedOptions === 'object' && normalizedOptions !== null) {
    const { geolocation: explicitGeolocationOptions, signal: providedSignal, ...legacyGeolocationOptions } =
      normalizedOptions

    signal = providedSignal

    const hasLegacyOptions = Object.keys(legacyGeolocationOptions).length > 0
    geolocationOptions =
      explicitGeolocationOptions !== undefined
        ? explicitGeolocationOptions
        : hasLegacyOptions
          ? legacyGeolocationOptions
          : undefined
  } else {
    geolocationOptions = normalizedOptions
  }

  const position = await getGeolocationPosition(geolocationOptions)
  const { latitude, longitude } = position.coords || {}

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Koordinaten nicht verfügbar')
  }

  let postalCode = ''
  try {
    const result = await getPostalFromCoords(latitude, longitude)
    if (result?.postalCode) postalCode = result.postalCode.toString()
  } catch (error) {
    console.warn('Firebase Reverse Geocoding fehlgeschlagen:', error)
  }

  let reverse
  try {
    reverse = await reverseGeocode(latitude, longitude, { signal })
  } catch (error) {
    if (isAbortError(error, signal)) {
      throw error
    }

    if (!postalCode) throw error
    reverse = {
      postalCode,
      city: '',
      label: postalCode,
      lat: latitude,
      lng: longitude,
      source: 'postal'
    }
  }

  const label = buildLabel({ postalCode: reverse.postalCode || postalCode, city: reverse.city })

  return {
    postalCode: reverse.postalCode || postalCode,
    city: reverse.city,
    label,
    lat: latitude,
    lng: longitude,
    source: reverse.source || 'geo'
  }
}
