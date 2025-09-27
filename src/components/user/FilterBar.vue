<!-- Diese Datei baut die große Filterleiste für die Desktop-Ansicht auf. -->
<template>
  <div ref="root" class="sticky top-2 z-30 flex min-w-0 justify-center px-2" @click.self="activeField = null">
    <div
      class="relative flex w-full max-w-5xl items-center overflow-hidden rounded-[40px] border border-white/70 bg-white/80 text-slate-700 shadow-xl backdrop-blur-xl transition-all duration-300"
      :class="{
        'scale-[1.02] border-gold/50 shadow-2xl ring-2 ring-gold/20': expanded || hasFocus,
      }"
    >
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-white/40 to-white/30"></div>
      <div class="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

      <div class="relative z-10 flex flex-1 items-stretch divide-x divide-white/60">
        <div
          class="group/location relative flex min-w-0 flex-1 cursor-text items-center gap-4 px-6 py-4 transition"
          :class="{
            'bg-white/80 shadow-inner ring-1 ring-gold/30': activeField === 'location' || filters.location,
            'hover:bg-white/70': !filters.location,
          }"
          @click.stop="activeField = 'location'"
        >
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <MapPin class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Standort</p>
            <div class="flex items-center gap-2">
              <input
                v-model="locationQuery"
                placeholder="Stadt, Adresse oder PLZ"
                class="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0"
                autocomplete="postal-code"
                @focus="activeField = 'location'"
                @keydown.enter.prevent="locationSuggestions.length ? selectLocation(locationSuggestions[0]) : (activeField = null)"
              />
              <button
                v-if="filters.location"
                type="button"
                class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                @click.stop="clearFilter('location')"
              >
                <X class="h-3 w-3" />
              </button>
            </div>
          </div>

          <div
            v-if="activeField === 'location' && (locationSuggestions.length || locationSuggestionsError || locationSuggestionsLoading || filters.location)"
            class="absolute left-0 right-0 top-full z-40 mt-3"
          >
            <div class="overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur">
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

        <button
          class="relative flex min-w-[160px] flex-col justify-center gap-1 px-6 py-4 text-left transition"
          :class="{
            'bg-white/80 text-gold shadow-inner ring-1 ring-gold/30': activeField === 'openNow' || filters.openNow,
            'hover:bg-white/70': !filters.openNow,
          }"
          type="button"
          aria-pressed="filters.openNow"
          @click.stop="toggleFilter('openNow'); activeField = 'openNow'"
        >
          <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Clock class="h-4 w-4" /> Jetzt geöffnet
          </span>
          <span class="text-sm font-medium text-slate-700">
            {{ filters.openNow ? 'Aktiviert' : 'Optional' }}
          </span>
          <span
            v-if="filters.openNow"
            class="absolute top-3 right-3 cursor-pointer text-slate-400 transition hover:text-slate-600"
            @click.stop="clearFilter('openNow')"
          >
            <X class="h-3 w-3" />
          </span>
        </button>

        <button
          class="relative flex min-w-[180px] flex-col justify-center gap-1 px-6 py-4 text-left transition"
          :class="{
            'bg-white/80 text-gold shadow-inner ring-1 ring-gold/30': activeField === 'price' || priceActive,
            'hover:bg-white/70': !priceActive,
          }"
          type="button"
          @click.stop="openPrice"
        >
          <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Euro class="h-4 w-4" /> Preisrahmen
          </span>
          <span class="text-sm font-medium text-slate-700">
            <template v-if="!priceActive">Beliebig</template>
            <template v-else>{{ filters.price[0] }}€ – {{ filters.price[1] }}€</template>
          </span>
          <span
            v-if="priceActive"
            class="absolute top-3 right-3 cursor-pointer text-slate-400 transition hover:text-slate-600"
            @click.stop="clearFilter('price')"
          >
            <X class="h-3 w-3" />
          </span>
          <ChevronDown v-else class="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </button>

        <button
          class="relative flex min-w-[180px] flex-col justify-center gap-1 px-6 py-4 text-left transition"
          :class="{
            'bg-white/80 text-gold shadow-inner ring-1 ring-gold/30': activeField === 'lockTypes' || filters.lockTypes.length,
            'hover:bg-white/70': !filters.lockTypes.length,
          }"
          type="button"
          @click.stop="openLockTypes"
        >
          <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Lock class="h-4 w-4" /> Schlösser
          </span>
          <span class="text-sm font-medium text-slate-700">
            <template v-if="!filters.lockTypes.length">Beliebig</template>
            <template v-else>{{ filters.lockTypes.length }} ausgewählt</template>
          </span>
          <span
            v-if="filters.lockTypes.length"
            class="absolute top-3 right-3 cursor-pointer text-slate-400 transition hover:text-slate-600"
            @click.stop="clearFilter('lockTypes')"
          >
            <X class="h-3 w-3" />
          </span>
          <ChevronDown v-else class="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </button>
      </div>

      <div class="relative z-10 flex flex-shrink-0 items-center justify-center px-4 pr-5">
        <button
          class="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-gold to-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <span class="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
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
