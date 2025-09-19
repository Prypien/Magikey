<!-- Diese Datei steuert die kompakte Filteransicht für Smartphones. -->
<template>
  <div ref="root" class="sticky top-2 z-30 flex justify-center px-2 sm:hidden">
    <div class="relative">
      <button
        @click="expanded = !expanded"
        class="rounded-full bg-gold p-3 text-white shadow-lg focus:outline-none"
        aria-label="Suchen"
      >
        <Search class="h-5 w-5" />
      </button>
      <transition
        enter-active-class="origin-top transition-transform duration-300 ease-out"
        enter-from-class="scale-y-0 opacity-0"
        enter-to-class="scale-y-100 opacity-100"
        leave-active-class="origin-top transition-transform duration-200 ease-in"
        leave-from-class="scale-y-100 opacity-100"
        leave-to-class="scale-y-0 opacity-0"
      >
        <div
          v-if="expanded"
          class="absolute left-1/2 z-40 mt-2 w-[90vw] max-w-sm -translate-x-1/2 space-y-4 rounded-xl border bg-white p-4 shadow-lg"
        >
          <div class="flex items-center gap-2">
            <MapPin class="h-5 w-5 text-gold" />
            <input
              v-model="filters.location"
              placeholder="PLZ"
              class="flex-1 rounded border px-2 py-1 text-sm focus:outline-none"
            />
            <button
              v-if="filters.location"
              @click="clearFilter('location')"
              class="text-gray-400 hover:text-black"
            >
              <X class="h-3 w-3" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Clock class="h-5 w-5 text-gold" />
              <span class="text-sm">Jetzt geöffnet</span>
            </div>
            <input type="checkbox" v-model="filters.openNow" class="h-4 w-4 form-checkbox text-gold" />
          </div>
          <div>
            <button
              @click="openPrice"
              class="flex w-full items-center justify-between rounded border px-2 py-1 text-sm"
            >
              <div class="flex items-center gap-2">
                <Euro class="h-5 w-5 text-gold" />
                <span v-if="!priceActive">Preisauswahl</span>
                <span v-else>{{ filters.price[0] }}€ - {{ filters.price[1] }}€</span>
              </div>
              <ChevronDown v-if="!priceActive" class="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div>
            <button
              @click="openLockTypes"
              class="flex w-full items-center justify-between rounded border px-2 py-1 text-sm mt-2"
            >
              <div class="flex items-center gap-2">
                <Lock class="h-5 w-5 text-gold" />
                <span v-if="!filters.lockTypes.length">Schlösser</span>
                <span v-else>{{ filters.lockTypes.length }} ausgewählt</span>
              </div>
              <ChevronDown v-if="!filters.lockTypes.length" class="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </transition>
    </div>
    <FilterPriceSheet v-model="filters.price" :visible="showPrice" @close="closePrice" />
    <FilterLockTypeSheet v-model="filters.lockTypes" :visible="showLockTypes" @close="closeLockTypes" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, defineAsyncComponent } from 'vue'
import { Search, MapPin, Clock, Euro, ChevronDown, X, Lock } from '@/components/icons'
import { filters, clearFilter } from '@/stores/filters'

const FilterPriceSheet = defineAsyncComponent(() => import('./FilterPriceSheet.vue'))
const FilterLockTypeSheet = defineAsyncComponent(() => import('./FilterLockTypeSheet.vue'))

const expanded = ref(false)
const showPrice = ref(false)
const showLockTypes = ref(false)
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

function openPrice() {
  showPrice.value = true
}

function closePrice() {
  showPrice.value = false
}

function openLockTypes() {
  showLockTypes.value = true
}

function closeLockTypes() {
  showLockTypes.value = false
}
</script>

<style scoped>
</style>
