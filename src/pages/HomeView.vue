<template>
  <!-- Startseite mit Filterleiste und Firmenliste -->
  <div class="min-h-screen bg-white px-4 py-8 sm:px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-center mb-6">Magikey, der Schlüsseldienst in deiner Nähe</h1>

    <FilterBar v-model="filters" class="mb-6" />

    <div class="mt-6">
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

import FilterBar from '@/components/user/FilterBar.vue'
import SearchResults from '@/components/user/SearchResults.vue'
import NotifyForm from '@/components/user/NotifyForm.vue'
import Loader from '@/components/common/Loader.vue'
import { getPostalFromCoords } from '@/firebase/functions'

// Firmenliste und Ladezustand
const companies = ref([])
const loading = ref(true)

const filters = ref({
  openNow: false,
  price: [0, 1000],
  location: ''
})

// Versucht, die Postleitzahl über Geolocation zu ermitteln
async function useLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { postalCode } = await getPostalFromCoords(pos.coords.latitude, pos.coords.longitude)
      if (postalCode) filters.value.location = postalCode
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

// Filterlogik für die Ergebnissliste
const filteredCompanies = computed(() => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return companies.value.filter((company) => {
    const matchesPLZ = company.postal_code?.includes(filters.value.location)

    let isOpen = true
    if (filters.value.openNow) {
      try {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        const today = days[now.getDay() - 1]
        const hours = company.opening_hours?.[today]
        if (hours?.open && hours?.close) {
          const openM = parseInt(hours.open.split(':')[0]) * 60 + parseInt(hours.open.split(':')[1])
          const closeM = parseInt(hours.close.split(':')[0]) * 60 + parseInt(hours.close.split(':')[1])
          isOpen = currentMinutes >= openM && currentMinutes <= closeM
        } else {
          isOpen = false
        }
      } catch (_) {
        isOpen = false
      }
    }

    const price = parseInt(company.price || '0')
    const inPrice = price >= filters.value.price[0] && price <= filters.value.price[1]

    const matchesOpen = !filters.value.openNow || isOpen

    return matchesPLZ && matchesOpen && inPrice
  })
})
</script>
