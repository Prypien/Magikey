<template>
  <!-- Startseite mit Filterleiste, Hero-Panel und Firmenliste -->
  <div class="mx-auto max-w-4xl min-h-screen bg-white px-4 py-6 sm:px-6">
    <HeroSection />

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
import { onMounted, defineAsyncComponent } from 'vue'
import SearchResults from '@/components/user/SearchResults.vue'
import Loader from '@/components/common/Loader.vue'
import HeroSection from '@/components/user/HeroSection.vue'
import { getPostalFromCoords } from '@/firebase/functions'
import { filters } from '@/stores/filters'
import { useCompanyStore } from '@/stores/company'

const NotifyForm = defineAsyncComponent(() => import('@/components/user/NotifyForm.vue'))

const { loading, fetchCompanies, filteredCompanies } = useCompanyStore()

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
  await fetchCompanies()
})
</script>
