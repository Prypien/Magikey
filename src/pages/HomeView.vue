<!-- Diese Datei stellt die Startseite mit Firmenliste und Intro dar. -->
<template>
  <!-- Startseite mit Filterleiste und Firmenliste -->
  <div class="mx-auto max-w-5xl min-h-[70vh] rounded-3xl bg-white/80 px-4 py-10 shadow-xl backdrop-blur-sm sm:px-8">
    <h1 class="mb-8 text-3xl font-semibold text-gray-900 sm:text-4xl">{{ title }}</h1>

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
      @click.self="closeIntro"
    >
      <IntroPopup @close="closeIntro" />
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
import { auth, isFirebaseConfigured } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { LOCK_TYPE_LABELS } from '@/constants/lockTypes'

const NotifyForm = defineAsyncComponent(() => import('@/components/user/NotifyForm.vue'))

const { loading, fetchCompanies, filteredCompanies } = useCompanyStore()
const showIntro = ref(false)
const INTRO_KEY = 'introShown'
const title = computed(() => {
  let text = 'Schlüsseldienste'
  if (filters.location) text += ` in ${filters.location}`
  if (filters.openNow) text += ' die jetzt geöffnet sind'
  if (filters.lockTypes.length) {
    const labels = filters.lockTypes.map((t) => LOCK_TYPE_LABELS[t]).join(', ')
    text += ` für ${labels}`
  }
  if (filters.price[1] < 1000) text += ` bis ${filters.price[1]}€`
  return text
})

// Versucht, die Postleitzahl über Geolocation zu ermitteln
async function useLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords || {}
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        console.warn('Ungültige Geokoordinaten erhalten')
        return
      }
      const { postalCode } = await getPostalFromCoords(latitude, longitude)
      if (postalCode) filters.location = postalCode
    } catch (err) {
      console.error('Geolocation fehlgeschlagen', err)
    }
  })
}

// Daten initial laden
onMounted(async () => {
  if (isFirebaseConfigured) {
    try {
      onAuthStateChanged(
        auth,
        (user) => {
          if (!user && !window.sessionStorage.getItem(INTRO_KEY)) showIntro.value = true
        },
        (error) => {
          console.warn('Auth konnte nicht initialisiert werden:', error)
        }
      )
    } catch (error) {
      console.warn('Registrieren des Auth-Listeners fehlgeschlagen:', error)
    }
  } else if (!window.sessionStorage.getItem(INTRO_KEY)) {
    showIntro.value = true
  }
  useLocation()
  await fetchCompanies()
})

function closeIntro() {
  showIntro.value = false
  window.sessionStorage.setItem(INTRO_KEY, '1')
}
</script>
