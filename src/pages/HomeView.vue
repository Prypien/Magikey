<template>
  <!-- Startseite mit Filterleiste und Firmenliste -->
  <div class="min-h-screen bg-white px-4 py-6 sm:px-6 max-w-4xl mx-auto">

    <h1 class="text-2xl font-semibold text-center mb-4">Schlüsseldienste in deiner Nähe</h1>

    <div>
      <div v-if="loading" class="flex flex-col items-center py-10 text-gray-500">
        <Loader :size="80" />
        <p class="mt-2">Firmen werden geladen...</p>
      </div>
      <template v-else>
        <div v-if="filteredCompanies.length === 0" class="text-gray-500">
          <p>Leider kein Anbieter gefunden. Trag dich ein, wir benachrichtigen dich!</p>
          <NotifyForm />
        </div>
        <SearchResults v-else :companies="filteredCompanies" />
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// Service zum Abrufen der Firmen
import { getCompanies } from '@/services/company'

import SearchResults from '@/components/user/SearchResults.vue'
import NotifyForm from '@/components/user/NotifyForm.vue'
import Loader from '@/components/common/Loader.vue'
import { getPostalFromCoords } from '@/firebase/functions'
import { filters } from '@/stores/filters'

// Firmenliste und Ladezustand
const companies = ref([])
const loading = ref(true)


// Versucht, die Postleitzahl über Geolocation zu ermitteln
async function useLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { postalCode } = await getPostalFromCoords(pos.coords.latitude, pos.coords.longitude)
      if (postalCode) filters.location = postalCode
    } catch (err) {
      console.error('Geolocation fehlgeschlagen', err)
    }
  })
}

// Daten initial laden
onMounted(async () => {
  useLocation()
  try {
    companies.value = await getCompanies()
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
})

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// Filterlogik für die Ergebnissliste
const filteredCompanies = computed(() => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return companies.value.filter((company) => {
    const matchesPLZ = company.postal_code?.includes(filters.location)

    let isOpen = true
    if (filters.openNow) {
      try {
        let dayIndex = now.getDay() - 1
        if (dayIndex < 0) dayIndex = 6
        const today = days[dayIndex]
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

    return matchesPLZ && matchesOpen && inPrice
  })
})
</script>
