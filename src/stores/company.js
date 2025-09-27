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
  const normalizedLocationDigits = normalizedLocation?.replace(/\s+/g, '')
  const normalizedLocationLower = normalizedLocation?.toLowerCase()

  return companies.value.filter((company) => {
    const postalCode = company.postal_code != null ? company.postal_code.toString().trim() : ''
    const normalizedPostalCode = postalCode.replace(/\s+/g, '')
    const matchesPLZ =
      !normalizedLocationDigits ||
      normalizedPostalCode.includes(normalizedLocationDigits)
    const city = company.city != null ? company.city.toString().toLowerCase() : ''
    const matchesCity = normalizedLocationLower
      ? city.includes(normalizedLocationLower)
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

    return (matchesPLZ || matchesCity) && matchesOpen && inPrice && matchesLock
  })
})

export function useCompanyStore() {
  return { companies, loading, fetchCompanies, filteredCompanies }
}
