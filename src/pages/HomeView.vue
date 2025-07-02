<template>
  <div class="min-h-screen bg-white px-4 py-8 sm:px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-center mb-6">Magikey, der Schlüsseldienst in deiner Nähe</h1>

    <div class="relative mb-4">
      <input
        v-model="postalCode"
        type="text"
        inputmode="numeric"
        maxlength="5"
        placeholder="Wo brauchst du Hilfe gebe hier eine Postleitzahl ein !"
        class="water-input pr-12 rounded-full"
        @focus="onFocus"
        @blur="onBlur"
        @input="onPostalInput"
      />
      <span
        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
        :class="{ 'opacity-0 scale-75': searchFocused }"
      >
        <i class="fa fa-search text-gold"></i>
      </span>
      <ul v-if="showSuggestions" class="dropdown">
        <li
          v-for="code in filteredSuggestions"
          :key="code"
          class="dropdown-item"
          @mousedown.prevent="selectSuggestion(code)"
        >
          {{ code }}
        </li>
      </ul>
      <transition name="water-drop">
        <Filter v-if="showFilter" dropdown class="mt-1" @apply="applyFilters" />
      </transition>
    </div>

    <div class="mt-6">
      <div v-if="loading" class="flex flex-col items-center py-10 text-gray-500">
        <Loader size="80" />
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
import { db } from '@/firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'

import Filter from '@/components/user/Filter.vue'
import SearchResults from '@/components/user/SearchResults.vue'
import NotifyForm from '@/components/user/NotifyForm.vue'
import Loader from '@/components/common/Loader.vue'
import { getPostalFromCoords } from '@/firebase/functions'

const postalCode = ref('')
const companies = ref([])
const loading = ref(true)
const showFilter = ref(false)
const showSuggestions = ref(false)
const searchFocused = ref(false)
const filters = ref({
  distance: 25,
  sortBy: 'price_asc',
  onlyOpen: false,
  onlyEmergency: false
})

const applyFilters = (f) => {
  filters.value = f
  showFilter.value = false
}

const allPostalCodes = computed(() => {
  const codes = companies.value.map((c) => c.postal_code).filter(Boolean)
  return [...new Set(codes)].sort()
})

const filteredSuggestions = computed(() =>
  postalCode.value
    ? allPostalCodes.value.filter((c) => c.startsWith(postalCode.value)).slice(0, 5)
    : []
)

function onPostalInput(e) {
  const digits = e.target.value.replace(/\D/g, '')
  postalCode.value = digits
  showSuggestions.value = filteredSuggestions.value.length > 0
  showFilter.value = true
}

function onBlur() {
  window.setTimeout(() => {
    showSuggestions.value = false
    searchFocused.value = false
    if (!postalCode.value) showFilter.value = false
  }, 100)
}

function onFocus() {
  searchFocused.value = true
  showFilter.value = true
}

function selectSuggestion(code) {
  postalCode.value = code
  showSuggestions.value = false
  showFilter.value = true
}

async function useLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { postalCode: code } = await getPostalFromCoords(pos.coords.latitude, pos.coords.longitude)
      if (code) {
        postalCode.value = code
        showFilter.value = true
      }
    } catch (err) {
      console.error('Geolocation fehlgeschlagen', err)
    }
  })
}

onMounted(async () => {
  useLocation()
  try {
    const snapshot = await getDocs(collection(db, 'companies'))
    companies.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
})

const filteredCompanies = computed(() => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return companies.value
    .filter((company) => {
      const matchesPLZ = company.postal_code?.includes(postalCode.value)
      const onlyOpen = filters.value.onlyOpen
      const onlyEmergency = filters.value.onlyEmergency

      let isOpen = true
      if (onlyOpen) {
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

      const matchesOpen = !onlyOpen || isOpen
      const matchesEmergency = !onlyEmergency || company.is_247

      return matchesPLZ && matchesOpen && matchesEmergency
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price || '0')
      const priceB = parseInt(b.price || '0')
      return filters.value.sortBy === 'price_asc'
        ? priceA - priceB
        : priceB - priceA
    })
})
</script>
