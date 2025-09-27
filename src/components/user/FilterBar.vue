<!-- Diese Datei baut die große Filterleiste für die Desktop-Ansicht auf. -->
<template>
  <div ref="root" class="sticky top-2 z-30 flex min-w-0 justify-center px-3" @click.self="activeField = null">
    <div class="w-full max-w-4xl">
      <div
        class="relative flex w-full flex-col gap-2 rounded-3xl border border-slate-200/70 bg-white/85 p-3 text-slate-700 shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl transition-all duration-300"
        :class="{
          'border-gold/40 shadow-2xl ring-1 ring-gold/20': expanded || hasFocus,
        }"
      >
        <div class="flex flex-wrap items-stretch gap-2">
          <div
            class="group/location relative flex min-w-[220px] flex-1 cursor-text items-center gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-sm transition hover:border-slate-200 hover:bg-white/95"
            :class="{
              'border-gold/40 bg-white shadow-sm ring-1 ring-gold/30': activeField === 'location' || filters.location,
            }"
            @click.stop="activeField = 'location'"
          >
            <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
              <MapPin class="h-3 w-3" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Standort</p>
              <div class="flex items-center gap-1.5 text-sm">
                <input
                  v-model="locationQuery"
                  placeholder="Stadt, Adresse oder PLZ"
                  class="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0"
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
              class="absolute left-0 right-0 top-full z-40 mt-2"
            >
              <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
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
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'openNow' || filters.openNow,
            }"
            type="button"
            aria-pressed="filters.openNow"
            @click.stop="toggleFilter('openNow'); activeField = 'openNow'"
          >
            <span class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Clock class="h-3.5 w-3.5" />
              </span>
              <span class="whitespace-nowrap">Jetzt geöffnet</span>
            </span>
            <span v-if="filters.openNow" class="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
              Aktiv
            </span>
            <span
              v-if="filters.openNow"
              class="absolute right-3 top-2 cursor-pointer text-slate-400 transition hover:text-slate-600"
              @click.stop="clearFilter('openNow')"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <button
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'price' || priceActive,
            }"
            type="button"
            @click.stop="openPrice"
          >
            <span class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Euro class="h-3.5 w-3.5" />
              </span>
              <span class="whitespace-nowrap">Preisrahmen</span>
            </span>
            <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <template v-if="priceActive">
                <span class="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                  {{ filters.price[0] }}€ – {{ filters.price[1] }}€
                </span>
              </template>
              <ChevronDown class="h-4 w-4 text-slate-400" />
            </span>
            <span
              v-if="priceActive"
              class="absolute right-3 top-2 cursor-pointer text-slate-400 transition hover:text-slate-600"
              @click.stop="clearFilter('price')"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <button
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'lockTypes' || filters.lockTypes.length,
            }"
            type="button"
            @click.stop="openLockTypes"
          >
            <span class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Lock class="h-3.5 w-3.5" />
              </span>
              <span class="whitespace-nowrap">Schlösser</span>
            </span>
            <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <template v-if="filters.lockTypes.length">
                <span class="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] text-gold">
                  {{ filters.lockTypes.length }} ausgewählt
                </span>
              </template>
              <ChevronDown class="h-4 w-4 text-slate-400" />
            </span>
            <span
              v-if="filters.lockTypes.length"
              class="absolute right-3 top-2 cursor-pointer text-slate-400 transition hover:text-slate-600"
              @click.stop="clearFilter('lockTypes')"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <div class="order-last ml-auto flex w-full justify-center pt-1 sm:order-none sm:ml-auto sm:w-auto sm:justify-end">
            <button
              class="group relative flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/40 sm:w-auto"
            >
              <span class="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <Search class="h-3.5 w-3.5" />
              </span>
              <span class="relative z-10">Suchen</span>
              <span class="absolute inset-0 scale-0 rounded-full bg-white/20 transition-transform duration-500 ease-out group-hover:scale-125 group-active:scale-150"></span>
            </button>
          </div>
        </div>
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
