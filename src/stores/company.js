// Diese Datei verwaltet die Firmenliste und die Filterung.
import { ref, computed } from 'vue'
import { getCompanies } from '@/services/company'
import { filters } from './filters'
import { DAYS } from '@/constants/days'

const companies = ref([])
const loading = ref(false)

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
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const normalizedLocation = filters.location?.toString().trim()
  const normalizedLocationDigits = normalizedLocation ? normalizedLocation.replace(/\D/g, '') : ''
  const normalizedLocationCity = normalizedLocation
    ? normalizedLocation.replace(/[0-9]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    : ''
  const hasLocationFilter = Boolean(normalizedLocationDigits || normalizedLocationCity)

  const locationLat = Number(filters.locationMeta?.lat)
  const locationLng = Number(filters.locationMeta?.lng)
  const hasLocationCoords = Number.isFinite(locationLat) && Number.isFinite(locationLng)

  function getCompanyCoordinates(company) {
    const lat = Number(
      company?.coordinates?.lat ??
        company?.coordinates?.latitude ??
        company?.latitude ??
        company?.lat
    )
    const lng = Number(
      company?.coordinates?.lng ??
        company?.coordinates?.longitude ??
        company?.longitude ??
        company?.lng
    )
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { lat, lng }
  }

  function getServiceRadius(company) {
    const radius = Number(company?.service_radius_km)
    if (!Number.isFinite(radius) || radius < 0) return null
    return radius
  }

  function toRadians(value) {
    return (value * Math.PI) / 180
  }

  function distanceInKm(a, b) {
    const R = 6371
    const dLat = toRadians(b.lat - a.lat)
    const dLng = toRadians(b.lng - a.lng)
    const lat1 = toRadians(a.lat)
    const lat2 = toRadians(b.lat)

    const sinDLat = Math.sin(dLat / 2)
    const sinDLng = Math.sin(dLng / 2)
    const haversine =
      sinDLat * sinDLat +
      Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng

    const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    return R * c
  }

  return companies.value.filter((company) => {
    const postalCode = company.postal_code != null ? company.postal_code.toString().trim() : ''
    const normalizedPostalCode = postalCode.replace(/\s+/g, '')
    const matchesPLZ = normalizedLocationDigits
      ? normalizedPostalCode.includes(normalizedLocationDigits)
      : false
    const city = company.city != null ? company.city.toString().toLowerCase() : ''
    const matchesCity = normalizedLocationCity
      ? city.includes(normalizedLocationCity)
      : false

    let isOpen = true
    if (filters.openNow) {
      try {
        let dayIndex = now.getDay() - 1
        if (dayIndex < 0) dayIndex = 6
        const today = DAYS[dayIndex]
        const hours = company.opening_hours?.[today]
        if (hours?.open && hours?.close) {
          const [oh, om] = hours.open.split(':').map(Number)
          const [ch, cm] = hours.close.split(':').map(Number)
          const openM = oh * 60 + om
          const closeM = ch * 60 + cm
          isOpen = currentMinutes >= openM && currentMinutes <= closeM
        } else {
          isOpen = false
        }
      } catch (_) {
        isOpen = false
      }
    }

    const price = parseInt(company.price || '0')
    const inPrice = price >= filters.price[0] && price <= filters.price[1]

    const matchesOpen = !filters.openNow || isOpen
    const matchesLock =
      filters.lockTypes.length === 0 ||
      (company.lock_types || []).some((t) => filters.lockTypes.includes(t))

    let matchesLocation = hasLocationFilter ? matchesPLZ || matchesCity : true

    if (hasLocationCoords) {
      const companyCoords = getCompanyCoordinates(company)
      const serviceRadius = getServiceRadius(company)

      if (companyCoords && serviceRadius !== null) {
        const distance = distanceInKm(
          { lat: locationLat, lng: locationLng },
          companyCoords
        )

        const withinRadius = distance <= serviceRadius
        if (withinRadius) {
          matchesLocation = true
        } else if (matchesLocation) {
          matchesLocation = false
        }
      }
    }

    return matchesLocation && matchesOpen && inPrice && matchesLock
  })
})

export function useCompanyStore() {
  return { companies, loading, fetchCompanies, filteredCompanies }
}
