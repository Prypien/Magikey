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

  return companies.value.filter((company) => {
    const matchesPLZ = company.postal_code?.includes(filters.location)

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

    return matchesPLZ && matchesOpen && inPrice && matchesLock
  })
})

export function useCompanyStore() {
  return { companies, loading, fetchCompanies, filteredCompanies }
}
