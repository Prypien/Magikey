<template>
  <div class="min-h-screen bg-white px-4 py-8 sm:px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold text-center mb-6">Finde deinen Schlüsseldienst</h1>

    <input
      v-model="postalCode"
      type="text"
      inputmode="numeric"
      placeholder="PLZ eingeben"
      class="input mb-4"
    />

    <div class="flex justify-end mb-3">
      <button @click="toggleFilter" class="text-sm font-semibold text-gold flex items-center gap-1">
        <i class="fa fa-filter" /> <span>Filter</span>
      </button>
    </div>

    <Filter v-if="showFilter" @apply="applyFilters" />

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

import Filter from '@/components/widgets/user/Filter.vue'
import SearchResults from '@/components/widgets/user/SearchResults.vue'

const postalCode = ref('')
const companies = ref([])
const loading = ref(true)

const showFilter = ref(false)
const filters = ref({
  distance: 25,
  sortBy: 'price_asc',
  onlyOpen: false,
  onlyEmergency: false
})

const toggleFilter = () => (showFilter.value = !showFilter.value)

const applyFilters = (f) => {
  filters.value = f
  showFilter.value = false
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
