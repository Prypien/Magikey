<template>
  <div ref="root" class="sticky top-2 z-30 flex justify-center px-2" @click.self="activeField = null">
    <div
      class="flex w-full max-w-4xl items-center divide-x overflow-hidden rounded-full border border-gray-100 bg-white/80 px-4 py-3 text-base shadow-lg backdrop-blur transition-all duration-200 sm:py-2 sm:text-sm"
      :class="{ 'scale-105 py-3': expanded }"
    >
      <div
        class="relative flex flex-1 items-center gap-2 py-3 px-4 transition-all duration-200 sm:py-2"
        :class="{ 'z-10 scale-105 bg-white': activeField === 'location' || filters.location }"
        @click.stop="activeField = 'location'"
      >
        <MapPin class="h-5 w-5 text-gold" />
        <input
          v-model="filters.location"
          placeholder="Wo?"
          class="flex-1 border-none bg-transparent text-base placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          autocomplete="postal-code"
          @focus="activeField = 'location'"
        />
        <button
          v-if="filters.location"
          @click.stop="clearFilter('location')"
          class="text-gray-400 hover:text-black"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
      <button
        class="relative flex flex-shrink-0 items-center gap-2 py-3 px-4 text-base transition-all duration-200 hover:bg-gray-50 sm:py-2 sm:text-sm"
        :class="{ 'z-10 scale-105 bg-white text-gold': activeField === 'openNow' || filters.openNow }"
        @click.stop="toggleFilter('openNow'); activeField = 'openNow'"
      >
        <Clock class="h-5 w-5" />
        <span class="hidden sm:inline">Jetzt geöffnet</span>
        <span v-if="filters.openNow" @click.stop="clearFilter('openNow')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
      </button>
      <button
        class="relative flex flex-shrink-0 items-center gap-2 py-3 px-4 text-base transition-all duration-200 hover:bg-gray-50 sm:py-2 sm:text-sm"
        :class="{ 'z-10 scale-105 bg-white text-gold': activeField === 'price' || priceActive }"
        @click.stop="openPrice"
      >
        <Euro class="h-5 w-5" />
        <span class="hidden sm:inline" v-if="!priceActive">Preis</span>
        <span class="hidden sm:inline" v-else>{{ filters.price[0] }}€ - {{ filters.price[1] }}€</span>
        <span v-if="priceActive" @click.stop="clearFilter('price')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
        <ChevronDown v-else class="h-4 w-4" />
      </button>
      <button
        class="relative flex flex-shrink-0 items-center gap-2 py-3 px-4 text-base transition-all duration-200 hover:bg-gray-50 sm:py-2 sm:text-sm"
        :class="{ 'z-10 scale-105 bg-white text-gold': activeField === 'lockTypes' || filters.lockTypes.length }"
        @click.stop="openLockTypes"
      >
        <Lock class="h-5 w-5" />
        <span class="hidden sm:inline" v-if="!filters.lockTypes.length">Schlösser</span>
        <span class="hidden sm:inline" v-else>{{ filters.lockTypes.length }} ausgewählt</span>
        <span v-if="filters.lockTypes.length" @click.stop="clearFilter('lockTypes')" class="ml-1 cursor-pointer text-gray-400 hover:text-black">
          <X class="h-3 w-3" />
        </span>
        <ChevronDown v-else class="h-4 w-4" />
      </button>
      <div class="flex justify-end py-3 pl-4 pr-4 sm:py-0">
        <button class="rounded-full bg-gold p-2 text-white hover:bg-gold/90" aria-label="Suchen">
          <Search class="h-4 w-4" />
        </button>
      </div>
    </div>
    <FilterPriceSheet v-model="filters.price" :visible="showPrice" @close="closePrice" />
    <FilterLockTypeSheet v-model="filters.lockTypes" :visible="showLockTypes" @close="closeLockTypes" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { MapPin, Clock, Euro, ChevronDown, Search, X } from '@/components/icons'
import { Lock } from 'lucide-vue-next'
import { filters, toggleFilter, clearFilter } from '@/stores/filters'

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
</script>
