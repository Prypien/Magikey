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
                  @click.stop="clearFilter('location'); activeField = null"
                >
                  <X class="h-3 w-3" />
                </button>
              </div>
            </div>

            <div
              v-if="activeField === 'location'"
              class="absolute left-0 right-0 top-full z-40 mt-2"
            >
              <SearchPopoverPanel
                title="Standort festlegen"
                description="Tippe eine Adresse ein oder nutze deinen aktuellen Standort."
              >
                <div class="space-y-3">
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl border border-dashed border-gold/30 bg-gold/5 px-4 py-3 text-left text-sm font-medium text-gold transition hover:border-gold/60 hover:bg-gold/10"
                    @click.stop="useGeoLocation"
                  >
                    <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <i v-if="!geolocationPending" class="fa fa-location-crosshairs"></i>
                      <span v-else class="h-4 w-4 animate-spin rounded-full border-2 border-gold/40 border-t-gold"></span>
                    </span>
                    <span class="text-left">
                      Aktuellen Standort verwenden
                      <span class="block text-xs font-normal text-gold/70">Magikey findet passende Dienste in deiner Nähe.</span>
                    </span>
                  </button>
                  <div class="rounded-xl border border-slate-200/70 bg-white/90">
                    <div v-if="locationSuggestionsLoading" class="px-4 py-4 text-sm text-slate-500">
                      Vorschläge werden geladen…
                    </div>
                    <ul
                      v-else-if="locationSuggestions.length"
                      class="max-h-64 divide-y divide-slate-100 overflow-y-auto"
                    >
                      <li v-for="suggestion in locationSuggestions" :key="suggestion.id">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gold/10"
                          @click.stop="selectLocation(suggestion)"
                        >
                          <span class="font-medium text-slate-700">{{ suggestion.label }}</span>
                          <span v-if="suggestion.city && suggestion.postalCode" class="text-xs text-slate-400">
                            {{ suggestion.city }}
                          </span>
                        </button>
                      </li>
                    </ul>
                    <div v-else-if="locationSuggestionsError" class="px-4 py-4 text-sm text-rose-500">
                      {{ locationSuggestionsError }}
                    </div>
                    <div v-else class="px-4 py-4 text-sm text-slate-500">
                      Gib mindestens zwei Zeichen ein, um Orte zu finden.
                    </div>
                  </div>
                </div>
                <template #footer v-if="filters.location">
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span class="truncate">
                      Aktuell ausgewählt:
                      <span class="font-semibold text-slate-700">{{ filters.location }}</span>
                    </span>
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                      @click.stop="clearFilter('location'); activeField = null"
                    >
                      Zurücksetzen
                    </button>
                  </div>
                </template>
              </SearchPopoverPanel>
            </div>
          </div>

          <button
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'openNow' || filters.openNow,
            }"
            type="button"
            aria-pressed="filters.openNow"
            @click.stop="handleOpenNowButtonClick"
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
              @click.stop="clearFilter('openNow'); activeField = null"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <div v-if="activeField === 'openNow'" class="absolute left-0 right-0 top-full z-40 mt-2">
            <SearchPopoverPanel
              title="Öffnungszeiten"
              description="Zeige nur Anbieter, die zum jetzigen Zeitpunkt erreichbar sind."
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-700">Jetzt geöffnet</p>
                    <p class="text-xs text-slate-500">Aktiviere den Schalter, um 24/7-Notdienste zu priorisieren.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="filters.openNow"
                    class="relative inline-flex h-6 w-11 items-center rounded-full border border-slate-300 bg-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                    :class="{ 'border-gold/60 bg-gold/60': filters.openNow }"
                    @click.stop="toggleOpenNow()"
                  >
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                      :class="{ 'translate-x-5': filters.openNow, 'translate-x-1': !filters.openNow }"
                    ></span>
                  </button>
                </div>
                <p class="text-xs text-slate-500">
                  Wir gleichen die Öffnungszeiten mit den Angaben der Anbieter ab. Einige Betriebe bieten Rufbereitschaft an und werden trotzdem angezeigt.
                </p>
              </div>
              <template #footer>
                <div class="flex items-center justify-end gap-2 text-xs">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    @click.stop="clearFilter('openNow'); activeField = null"
                  >
                    Zurücksetzen
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white transition hover:bg-slate-800"
                    @click.stop="activeField = null"
                  >
                    Fertig
                  </button>
                </div>
              </template>
            </SearchPopoverPanel>
          </div>

          <button
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'price' || priceActive,
            }"
            type="button"
            @click.stop="togglePricePanel"
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
              @click.stop="clearFilter('price'); activeField = null"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <div v-if="activeField === 'price'" class="absolute left-0 right-0 top-full z-40 mt-2">
            <SearchPopoverPanel
              title="Preisrahmen"
              description="Lege den gewünschten Kostenrahmen für den Einsatz fest."
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Budget</span>
                  <span>{{ priceDraft.min }}€ – {{ priceDraft.max }}€</span>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                      <span>Minimum</span>
                      <span>{{ priceDraft.min }}€</span>
                    </div>
                    <input
                      v-model.number="priceDraft.min"
                      type="range"
                      :min="PRICE_MIN"
                      :max="PRICE_MAX"
                      step="10"
                      class="mt-2 w-full"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                      <span>Maximum</span>
                      <span>{{ priceDraft.max }}€</span>
                    </div>
                    <input
                      v-model.number="priceDraft.max"
                      type="range"
                      :min="PRICE_MIN"
                      :max="PRICE_MAX"
                      step="10"
                      class="mt-2 w-full"
                    />
                  </div>
                </div>
                <p class="text-xs text-slate-500">
                  Die Preise dienen als Orientierung für den Erstkontakt. Endpreise hängen vom Aufwand vor Ort ab.
                </p>
              </div>
              <template #footer>
                <div class="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    @click.stop="handleResetPrice"
                  >
                    Zurücksetzen
                  </button>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      @click.stop="activeField = null; syncPriceDraft()"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      class="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white transition hover:bg-slate-800"
                      @click.stop="applyPrice"
                    >
                      Übernehmen
                    </button>
                  </div>
                </div>
              </template>
            </SearchPopoverPanel>
          </div>

          <button
            class="group relative flex min-w-[150px] flex-1 items-center justify-between gap-2 rounded-2xl border border-transparent bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-white/95 sm:flex-none sm:flex-grow-0"
            :class="{
              'border-gold/40 bg-white text-gold shadow-sm ring-1 ring-gold/30': activeField === 'lockTypes' || filters.lockTypes.length,
            }"
            type="button"
            @click.stop="toggleLockTypesPanel"
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
              @click.stop="clearFilter('lockTypes'); activeField = null"
            >
              <X class="h-3 w-3" />
            </span>
          </button>

          <div v-if="activeField === 'lockTypes'" class="absolute left-0 right-0 top-full z-40 mt-2">
            <SearchPopoverPanel
              title="Schlosstypen"
              description="Wähle aus, für welche Schlossarten du Unterstützung benötigst."
            >
              <div class="max-h-64 space-y-2 overflow-y-auto pr-1">
                <label
                  v-for="option in lockTypeOptions"
                  :key="option.value"
                  class="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2 text-sm transition hover:border-gold/40 hover:bg-gold/5"
                >
                  <div class="flex items-center gap-3">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <i class="fa fa-lock"></i>
                    </span>
                    <span class="font-medium text-slate-700">{{ option.label }}</span>
                  </div>
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
                    :value="option.value"
                    :checked="isLockTypeSelected(option.value)"
                    @change.stop="toggleLockType(option.value)"
                  />
                </label>
              </div>
              <template #footer>
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    @click.stop="handleResetLockTypes"
                  >
                    Zurücksetzen
                  </button>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full px-3 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      @click.stop="activeField = null; syncLockDraft()"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      class="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white transition hover:bg-slate-800"
                      @click.stop="applyLockTypes"
                    >
                      Übernehmen
                    </button>
                  </div>
                </div>
              </template>
            </SearchPopoverPanel>
          </div>

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
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { MapPin, Clock, Euro, ChevronDown, Search, X, Lock } from '@/components/icons'
import { filters, clearFilter } from '@/stores/filters'
import { useLocationSearch } from '@/composables/useLocationSearch'
import { LOCK_TYPE_OPTIONS } from '@/constants/lockTypes'
import SearchPopoverPanel from './SearchPopoverPanel.vue'

defineProps({
  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['focus', 'blur'])

const root = ref(null)
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

const PRICE_MIN = 0
const PRICE_MAX = 1000
const priceDraft = reactive({
  min: filters.price[0],
  max: filters.price[1]
})
const lockTypeOptions = LOCK_TYPE_OPTIONS
const selectedLockTypes = ref([...filters.lockTypes])

function syncPriceDraft() {
  priceDraft.min = filters.price[0]
  priceDraft.max = filters.price[1]
}

function syncLockDraft() {
  selectedLockTypes.value = [...filters.lockTypes]
}

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

watch(activeField, (val, oldVal) => {
  if (val) {
    emit('focus')
  } else {
    emit('blur')
  }

  if (val !== 'location') {
    resetLocationSuggestions()
  }

  if (val !== 'price' && oldVal === 'price') {
    syncPriceDraft()
  }

  if (val !== 'lockTypes' && oldVal === 'lockTypes') {
    syncLockDraft()
  }
})

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) {
    activeField.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

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

watch(
  () => filters.price.join(','),
  () => {
    syncPriceDraft()
  }
)

watch(
  () => filters.lockTypes.join(','),
  () => {
    syncLockDraft()
  }
)

watch(
  () => priceDraft.min,
  (value) => {
    if (value < PRICE_MIN) {
      priceDraft.min = PRICE_MIN
    } else if (value > priceDraft.max) {
      priceDraft.min = priceDraft.max
    }
  }
)

watch(
  () => priceDraft.max,
  (value) => {
    if (value > PRICE_MAX) {
      priceDraft.max = PRICE_MAX
    } else if (value < priceDraft.min) {
      priceDraft.max = priceDraft.min
    }
  }
)

function handleOpenNowButtonClick() {
  activeField.value = activeField.value === 'openNow' ? null : 'openNow'
}

function toggleOpenNow(forceValue) {
  const next = typeof forceValue === 'boolean' ? forceValue : !filters.openNow
  filters.openNow = next
  if (!next) {
    activeField.value = null
  }
}

function togglePricePanel() {
  activeField.value = activeField.value === 'price' ? null : 'price'
}

function applyPrice() {
  filters.price = [priceDraft.min, priceDraft.max]
  activeField.value = null
}

function handleResetPrice() {
  clearFilter('price')
  syncPriceDraft()
  activeField.value = null
}

function toggleLockTypesPanel() {
  activeField.value = activeField.value === 'lockTypes' ? null : 'lockTypes'
}

function toggleLockType(value) {
  const current = new Set(selectedLockTypes.value)
  if (current.has(value)) {
    current.delete(value)
  } else {
    current.add(value)
  }
  selectedLockTypes.value = Array.from(current)
}

function isLockTypeSelected(value) {
  return selectedLockTypes.value.includes(value)
}

function applyLockTypes() {
  filters.lockTypes = [...selectedLockTypes.value]
  activeField.value = null
}

function handleResetLockTypes() {
  clearFilter('lockTypes')
  syncLockDraft()
  activeField.value = null
}
</script>
