// Diese Datei verwaltet die Firmenliste und die Filterung.
import { ref, computed } from 'vue'
import { getCompanies } from '@/core/services/company'
import { filters, DEFAULT_PRICE_RANGE } from './filters'
import { DAYS } from '@/core/constants/days'
import { parseEuroAmount } from '@/core/utils/price'
import { normaliseLockTypeList } from '@/core/utils/lockTypes'
import { haversineDistance } from '@/core/utils/distance'

const companies = ref([])
const loading = ref(false)

const POSTAL_CODE_KEYS = ['postal_code', 'postalCode', 'zip', 'zip_code', 'zipCode']
const CITY_KEYS = ['city', 'town', 'locality']
const SERVICE_RADIUS_KEYS = ['service_radius_km', 'serviceRadiusKm', 'serviceRadius']

function readCompanyField(company, keys) {
  for (const key of keys) {
    const value = company?.[key]
    if (value != null) {
      const stringValue = value.toString().trim()
      if (stringValue) return stringValue
    }
  }
  return ''
}

function normalisePostalCode(value) {
  return value ? value.replace(/\s+/g, '') : ''
}

function normaliseCity(value) {
  return value ? value.replace(/\s+/g, ' ').trim().toLowerCase() : ''
}

function getCompanyPostalCode(company) {
  return normalisePostalCode(readCompanyField(company, POSTAL_CODE_KEYS))
}

function getCompanyCity(company) {
  return normaliseCity(readCompanyField(company, CITY_KEYS))
}

function pickFirstFinite(values) {
  for (const value of values) {
    const num = Number(value)
    if (Number.isFinite(num)) return num
  }
  return null
}

function getCompanyCoordinates(company) {
  const lat = pickFirstFinite([
    company?.coordinates?.lat,
    company?.coordinates?.latitude,
    company?.location?.lat,
    company?.location?.latitude,
    company?.latitude,
    company?.lat,
  ])
  const lng = pickFirstFinite([
    company?.coordinates?.lng,
    company?.coordinates?.longitude,
    company?.coordinates?.lon,
    company?.location?.lng,
    company?.location?.longitude,
    company?.location?.lon,
    company?.longitude,
    company?.lng,
    company?.lon,
  ])

  if (lat === null || lng === null) return null
  return { lat, lng }
}

function getServiceRadius(company) {
  const radius = pickFirstFinite(SERVICE_RADIUS_KEYS.map((key) => company?.[key]))
  if (radius === null || radius < 0) return null
  return radius
}

function normaliseLocationFilter(value) {
  const label = value?.toString().trim() ?? ''
  if (!label) {
    return { label: '', digits: '', city: '', hasFilter: false }
  }

  const digits = label.replace(/\D/g, '')
  const city = label
    .replace(/[0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  return {
    label,
    digits,
    city,
    hasFilter: Boolean(digits || city),
  }
}

function companyMatchesLocationText(company, locationFilter) {
  if (!locationFilter.hasFilter) return true

  const postalCode = getCompanyPostalCode(company)
  const city = getCompanyCity(company)

  const matchesPostal = locationFilter.digits
    ? postalCode.includes(locationFilter.digits)
    : false
  const matchesCity = locationFilter.city
    ? city.includes(locationFilter.city)
    : false

  return matchesPostal || matchesCity
}

function normalisePriceRange(range) {
  if (!Array.isArray(range) || range.length < 2) {
    return { min: DEFAULT_PRICE_RANGE[0], max: DEFAULT_PRICE_RANGE[1] }
  }

  const rawMin = Number(range[0])
  const rawMax = Number(range[1])
  const fallbackMin = DEFAULT_PRICE_RANGE[0]
  const fallbackMax = DEFAULT_PRICE_RANGE[1]

  const min = Number.isFinite(rawMin) ? rawMin : fallbackMin
  const max = Number.isFinite(rawMax) ? rawMax : fallbackMax

  if (min > max) {
    return { min: max, max: min }
  }

  return { min, max }
}

function getCurrentDayKey(date) {
  let index = date.getDay() - 1
  if (index < 0) index = 6
  return DAYS[index]
}

function parseTimeToMinutes(value) {
  if (typeof value !== 'string') return null
  const [hours, minutes] = value.split(':').map((part) => Number.parseInt(part, 10))
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 60 + minutes
}

function isCompanyOpenAt(company, date) {
  const dayKey = getCurrentDayKey(date)
  const hours = company?.opening_hours?.[dayKey]
  if (!hours) return false

  const openMinutes = parseTimeToMinutes(hours.open)
  const closeMinutes = parseTimeToMinutes(hours.close)
  if (!Number.isFinite(openMinutes) || !Number.isFinite(closeMinutes)) return false

  const currentMinutes = date.getHours() * 60 + date.getMinutes()
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

function matchesLockTypes(companyLockTypes, filterSet) {
  if (filterSet.size === 0) return true
  return companyLockTypes.some((type) => filterSet.has(type))
}

function matchesLocation(company, locationFilter, referenceCoords) {
  const matchesText = companyMatchesLocationText(company, locationFilter)
  if (!referenceCoords) {
    return matchesText
  }

  const companyCoords = getCompanyCoordinates(company)
  const serviceRadius = getServiceRadius(company)
  if (!companyCoords || serviceRadius === null) {
    return matchesText
  }

  const distance = haversineDistance(
    referenceCoords.lat,
    referenceCoords.lng,
    companyCoords.lat,
    companyCoords.lng
  )

  if (!Number.isFinite(distance)) {
    return matchesText
  }

  if (distance <= serviceRadius) {
    return true
  }

  return false
}

export async function fetchCompanies() {
  loading.value = true
  try {
    companies.value = await getCompanies()
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
}

export const filteredCompanies = computed(() => {
  const evaluationDate = new Date()
  const locationFilter = normaliseLocationFilter(filters.location)
  const locationLat = Number(filters.locationMeta?.lat)
  const locationLng = Number(filters.locationMeta?.lng)
  const hasLocationCoords = Number.isFinite(locationLat) && Number.isFinite(locationLng)
  const referenceCoords = hasLocationCoords ? { lat: locationLat, lng: locationLng } : null
  const lockTypeFilter = new Set(normaliseLockTypeList(filters.lockTypes))
  const priceRange = normalisePriceRange(filters.price)
  const priceFilterActive =
    priceRange.min > DEFAULT_PRICE_RANGE[0] || priceRange.max < DEFAULT_PRICE_RANGE[1]

  return companies.value.filter((company) => {
    if (!matchesLocation(company, locationFilter, referenceCoords)) {
      return false
    }

    if (filters.openNow && !isCompanyOpenAt(company, evaluationDate)) {
      return false
    }

    const price = parseEuroAmount(company.price)
    const hasPrice = Number.isFinite(price)
    if (hasPrice) {
      if (price < priceRange.min || price > priceRange.max) {
        return false
      }
    } else if (priceFilterActive) {
      return false
    }

    const companyLockTypes = normaliseLockTypeList(company.lock_types)
    if (!matchesLockTypes(companyLockTypes, lockTypeFilter)) {
      return false
    }

    return true
  })
})

export function useCompanyStore() {
  return { companies, loading, fetchCompanies, filteredCompanies }
}
