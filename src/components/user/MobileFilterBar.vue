<template>
  <div ref="root" class="sm:hidden flex justify-center px-2 sticky top-2 z-30">
    <div class="relative">
      <button
        @click="expanded = !expanded"
        class="p-3 bg-gold rounded-full text-white shadow-lg focus:outline-none"
        aria-label="Suchen"
      >
        <Search class="w-5 h-5" />
      </button>
      <div
        v-if="expanded"
        class="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 space-y-4 z-40"
      >
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-gold" />
          <input
            v-model="filters.location"
            placeholder="PLZ"
            class="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
          />
          <button
            v-if="filters.location"
            @click="clear('location')"
            class="text-gray-400 hover:text-black"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-gold" />
            <span class="text-sm">Jetzt geöffnet</span>
          </div>
          <input
            type="checkbox"
            v-model="filters.openNow"
            class="form-checkbox h-4 w-4 text-gold"
          />
        </div>
        <div>
          <button
            @click="openPrice"
            class="w-full flex items-center justify-between border rounded px-2 py-1 text-sm"
          >
            <div class="flex items-center gap-2">
              <Euro class="w-5 h-5 text-gold" />
              <span v-if="!priceActive">Preisauswahl</span>
              <span v-else>{{ filters.price[0] }}€ - {{ filters.price[1] }}€</span>
            </div>
            <ChevronDown v-if="!priceActive" class="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
    <FilterPriceSheet
      v-model="filters.price"
      :visible="showPrice"
      @close="closePrice"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Search, MapPin, Clock, Euro, ChevronDown, X } from '@/components/icons'
import FilterPriceSheet from './FilterPriceSheet.vue'
import { filters } from '@/stores/filters'

const expanded = ref(false)
const showPrice = ref(false)
const root = ref(null)

const priceActive = computed(() => filters.price[0] !== 0 || filters.price[1] !== 1000)

function handleClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    expanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function clear(key) {
  if (key === 'location') {
    filters.location = ''
  }
}

function openPrice() {
  showPrice.value = true
}

function closePrice() {
  showPrice.value = false
}
</script>

<style scoped>
</style>
