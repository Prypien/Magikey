<template>
  <div class="min-h-screen bg-white px-4 py-8 sm:px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-center mb-6">Magikey, der Schlüsseldienst in deiner Nähe</h1>

    <div class="relative mb-4">
      <input
        v-model="postalCode"
        type="text"
        inputmode="numeric"
        placeholder="PLZ eingeben"
        class="water-input"
        @blur="onBlur"
        @input="onPostalInput"
      />
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
      <Filter v-if="showFilter" dropdown class="mt-1" @apply="applyFilters" />
    </div>

    <div class="mt-6">
      <p v-if="loading">⏳ Firmen werden geladen...</p>
      <template v-else>
        <p v-if="filteredCompanies.length === 0" class="text-gray-500">Keine passenden Firmen gefunden.</p>
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

const postalCode = ref('')
const companies = ref([])
const loading = ref(true)
const showFilter = ref(false)
const showSuggestions = ref(false)
const filters = ref({
  distance: 25,
  sortBy: 'price_asc',
  onlyOpen: false,
  onlyEmergency: false,
  minRating: 0
})

const applyFilters = (f) => {
  filters.value = f
  showFilter.value = false
}

// Liste aller verfügbaren Postleitzahlen
const allPostalCodes = computed(() => {
  const codes = companies.value.map((c) => c.postal_code).filter(Boolean)
  return [...new Set(codes)].sort()
})

const filteredSuggestions = computed(() =>
  postalCode.value
    ? allPostalCodes.value.filter((c) => c.startsWith(postalCode.value)).slice(0, 5)
    : []
)

function onPostalInput() {
  showSuggestions.value = filteredSuggestions.value.length > 0
  showFilter.value = postalCode.value.length > 0
}

function onBlur() {
  window.setTimeout(() => {
    showSuggestions.value = false
    if (!postalCode.value) showFilter.value = false
  }, 100)
}

function selectSuggestion(code) {
  postalCode.value = code
  showSuggestions.value = false
  showFilter.value = true
}

// 🔄 Firmen laden
onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'companies'))
    companies.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    loading.value = false
  }
})

// 🧠 Filterlogik
const filteredCompanies = computed(() => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return companies.value
    .filter((company) => {
      const matchesPLZ = company.postal_code?.includes(postalCode.value)
      const onlyOpen = filters.value.onlyOpen
      const onlyEmergency = filters.value.onlyEmergency
      const minRating = filters.value.minRating

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
      const matchesRating = (company.rating || 0) >= minRating

      return matchesPLZ && matchesOpen && matchesEmergency && matchesRating
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
