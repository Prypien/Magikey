<template>
  <!-- Startseite mit Filterleiste und Firmenliste -->
  <div class="mx-auto max-w-4xl min-h-screen bg-white px-4 py-6 sm:px-6">
    <h1 class="mb-6 text-2xl font-semibold">{{ title }}</h1>

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
  <transition name="modal">
    <div
      v-if="showIntro"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showIntro = false"
    >
      <div class="w-full max-w-md">
        <IntroPopup />
        <button
          class="mt-4 w-full rounded bg-black py-2 text-white"
          @click="showIntro = false"
        >
          Schließen
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, defineAsyncComponent, ref, computed } from 'vue'
import SearchResults from '@/components/user/SearchResults.vue'
import Loader from '@/components/common/Loader.vue'
import IntroPopup from '@/components/user/IntroPopup.vue'
import { getPostalFromCoords } from '@/firebase/functions'
import { filters } from '@/stores/filters'
import { useCompanyStore } from '@/stores/company'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const NotifyForm = defineAsyncComponent(() => import('@/components/user/NotifyForm.vue'))

const { loading, fetchCompanies, filteredCompanies } = useCompanyStore()
const showIntro = ref(false)
const title = computed(() => {
  let text = 'Schlüsseldienste'
  if (filters.location) text += ` in ${filters.location}`
  if (filters.price[1] < 1000) text += ` bis ${filters.price[1]}€`
  return text
})

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
  onAuthStateChanged(auth, (user) => {
    if (!user) showIntro.value = true
  })
  useLocation()
  await fetchCompanies()
})
</script>
