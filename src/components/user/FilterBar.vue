<!-- Diese Datei baut die große Filterleiste für die Desktop-Ansicht auf. -->
<template>
  <div ref="root" class="sticky top-2 z-30 flex min-w-0 justify-center px-2" @click.self="activeField = null">
    <div
      class="group/search relative flex w-full max-w-5xl items-center overflow-hidden rounded-full border border-white/70 bg-gradient-to-r from-white/95 via-white/85 to-white/70 px-3 py-3 text-base text-slate-700 shadow-xl backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm"
      :class="{
        'scale-[1.02] ring-2 ring-gold/40 shadow-2xl': expanded || hasFocus,
      }"
    >
      <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/search:opacity-100">
        <div class="absolute inset-0 bg-white/30"></div>
        <div class="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-gold/20 via-transparent to-gold/20"></div>
      </div>
      <div
        class="group/location relative z-10 flex min-w-0 flex-1 items-center gap-3 rounded-full py-3 pl-4 pr-5 transition-all duration-200 sm:py-2"
        :class="{
          'bg-white shadow-inner ring-1 ring-gold/30': activeField === 'location' || filters.location,
          'hover:bg-white/80': !filters.location,
        }"
        @click.stop="activeField = 'location'"
      >
        <MapPin class="h-5 w-5 text-gold" />
        <input
          v-model="locationQuery"
          placeholder="Wo?"
          class="flex-1 min-w-0 border-none bg-transparent text-base placeholder:text-slate-400 focus:ring-0 sm:text-sm"
          autocomplete="postal-code"
          @focus="activeField = 'location'"
          @keydown.enter.prevent="locationSuggestions.length ? selectLocation(locationSuggestions[0]) : (activeField = null)"
        />
        <button
          v-if="filters.location"
          @click.stop="clearFilter('location')"
          class="text-gray-400 hover:text-black"
        >
          <X class="h-3 w-3" />
        </button>
        <div
          v-if="activeField === 'location' && (locationSuggestions.length || locationSuggestionsError || locationSuggestionsLoading || filters.location)"
          class="absolute left-0 right-0 top-full z-40 mt-3"
        >
          <div class="overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-xl backdrop-blur">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-gold/10"
              @click.stop="useGeoLocation"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                <i v-if="!geolocationPending" class="fa fa-location-crosshairs"></i>
                <span v-else class="h-4 w-4 animate-spin rounded-full border-2 border-gold/40 border-t-gold"></span>
              </span>
              <span>
                Aktuellen Standort verwenden
                <span class="block text-xs font-normal text-slate-400">Standardmäßig wird dein aktueller Standort genutzt.</span>
              </span>
            </button>
            <div v-if="locationSuggestionsLoading" class="px-4 py-3 text-sm text-slate-500">
              Vorschläge werden geladen…
            </div>
            <ul v-else-if="locationSuggestions.length" class="max-h-64 overflow-y-auto py-2">
              <li v-for="suggestion in locationSuggestions" :key="suggestion.id">
                <button
                  type="button"
                  class="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-gold/10"
                  @click.stop="selectLocation(suggestion)"
                >
                  <span class="font-medium text-slate-700">{{ suggestion.label }}</span>
                  <span v-if="suggestion.city && suggestion.postalCode" class="text-xs text-slate-400">
                    {{ suggestion.city }}
                  </span>
                </button>
              </li>
            </ul>
            <div v-else-if="locationSuggestionsError" class="px-4 py-3 text-sm text-rose-500">
              {{ locationSuggestionsError }}
            </div>
            <div v-else class="px-4 py-3 text-sm text-slate-500">
              Gib mindestens zwei Zeichen ein, um Orte zu finden.
            </div>
          </div>
        </div>
      </div>
      <div class="hidden h-9 w-px bg-white/60 sm:block"></div>

      <button
        class="relative z-10 flex items-center gap-2 rounded-full py-3 px-4 text-base transition-all duration-200 hover:bg-white/70 hover:text-slate-900 sm:py-2 sm:text-sm"
        :class="{ 'bg-white text-gold shadow-inner ring-1 ring-gold/30': activeField === 'openNow' || filters.openNow }"
        @click.stop="toggleFilter('openNow'); activeField = 'openNow'"
      >
        <Clock class="h-5 w-5" />
        <span class="hidden lg:inline">Jetzt geöffnet</span>
        <span v-if="filters.openNow" @click.stop="clearFilter('openNow')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
      </button>

      <button
        class="relative z-10 flex items-center gap-2 rounded-full py-3 px-4 text-base transition-all duration-200 hover:bg-white/70 hover:text-slate-900 sm:py-2 sm:text-sm"
        :class="{ 'bg-white text-gold shadow-inner ring-1 ring-gold/30': activeField === 'price' || priceActive }"
        @click.stop="openPrice"
      >
        <Euro class="h-5 w-5" />
        <span class="hidden lg:inline" v-if="!priceActive">Preis</span>
        <span class="hidden lg:inline" v-else>{{ filters.price[0] }}€ - {{ filters.price[1] }}€</span>
        <span v-if="priceActive" @click.stop="clearFilter('price')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
        <ChevronDown v-else class="h-4 w-4" />
      </button>

      <button
        class="relative z-10 flex items-center gap-2 rounded-full py-3 px-4 text-base transition-all duration-200 hover:bg-white/70 hover:text-slate-900 sm:py-2 sm:text-sm"
        :class="{ 'bg-white text-gold shadow-inner ring-1 ring-gold/30': activeField === 'lockTypes' || filters.lockTypes.length }"
        @click.stop="openLockTypes"
      >
        <Lock class="h-5 w-5" />
        <span class="hidden lg:inline" v-if="!filters.lockTypes.length">Schlösser</span>
        <span class="hidden lg:inline" v-else>{{ filters.lockTypes.length }} ausgewählt</span>
        <span v-if="filters.lockTypes.length" @click.stop="clearFilter('lockTypes')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
        <ChevronDown v-else class="h-4 w-4" />
      </button>
      <div class="flex flex-shrink-0 items-center justify-end py-3 pl-4 pr-2 sm:py-0">
        <button
          class="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold to-amber-500 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <span class="relative z-10">
            <Search class="h-4 w-4" />
          </span>
          <span class="relative z-10 hidden sm:inline">Suchen</span>
          <span class="absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-500 ease-out group-hover:scale-125 group-active:scale-150"></span>
        </button>
      </div>
    </div>
    <FilterPriceSheet v-model="filters.price" :visible="showPrice" @close="closePrice" />
    <FilterLockTypeSheet v-model="filters.lockTypes" :visible="showLockTypes" @close="closeLockTypes" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { MapPin, Clock, Euro, ChevronDown, Search, X, Lock } from '@/components/icons'
import { filters, toggleFilter, clearFilter } from '@/stores/filters'
import { useLocationSearch } from '@/composables/useLocationSearch'

const FilterPriceSheet = defineAsyncComponent(() => import('./FilterPriceSheet.vue'))
const FilterLockTypeSheet = defineAsyncComponent(() => import('./FilterLockTypeSheet.vue'))

defineProps({
  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['focus', 'blur'])

const root = ref(null)
const showPrice = ref(false)
const showLockTypes = ref(false)
const activeField = ref(null)
const priceActive = computed(() => filters.price[0] !== 0 || filters.price[1] !== 1000)
const hasFocus = computed(() => {
  if (activeField.value) return true
  if (filters.location) return true
  if (filters.openNow) return true
  if (priceActive.value) return true
  if (filters.lockTypes.length) return true
  return false
})

const {
  query: locationQuery,
  suggestions: locationSuggestions,
  loadingSuggestions: locationSuggestionsLoading,
  suggestionsError: locationSuggestionsError,
  geolocationPending,
  applyLocation,
  useCurrentLocation,
  clearSuggestions: resetLocationSuggestions
} = useLocationSearch()

watch(activeField, (val) => {
  if (val) {
    emit('focus')
  } else {
    emit('blur')
  }
})

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    activeField.value = null
    resetLocationSuggestions()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

function openPrice() {
  showPrice.value = true
  activeField.value = 'price'
}

function closePrice() {
  showPrice.value = false
  activeField.value = null
}

function openLockTypes() {
  showLockTypes.value = true
  activeField.value = 'lockTypes'
}

function closeLockTypes() {
  showLockTypes.value = false
  activeField.value = null
}

defineExpose({ openPrice })

function selectLocation(option) {
  applyLocation(option)
  activeField.value = null
}

async function useGeoLocation() {
  const location = await useCurrentLocation()
  if (location?.label) {
    activeField.value = null
  }
}

watch(activeField, (val) => {
  if (val !== 'location') {
    resetLocationSuggestions()
  }
})
</script>
