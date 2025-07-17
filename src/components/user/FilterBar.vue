<template>
<div ref="root" class="sticky top-2 z-30 flex justify-center px-2" @click.self="activeField = null">
    <div
      class="flex items-center w-full max-w-4xl divide-x rounded-full shadow-lg bg-white/80 backdrop-blur border border-gray-100 transition-all duration-200"
      :class="{ 'scale-105': expanded }"
    >
      <div
        class="relative flex items-center gap-2 px-4 flex-1 transition-all duration-200"
        :class="{ 'bg-white scale-105 z-10': activeField === 'location' || filters.location }"
        @click.stop="activeField = 'location'"
      >
        <MapPin class="w-5 h-5 text-gold" />
        <input
          v-model="filters.location"
          placeholder="Wo?"
          class="flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-400 text-sm"
          autocomplete="postal-code"
          @focus="activeField = 'location'"
        />
        <button
          v-if="filters.location"
          @click.stop="clear('location')"
          class="text-gray-400 hover:text-black"
        >
          <X class="w-3 h-3" />
        </button>
        <!-- Input field for location, suggestions removed as free input is desired -->
      </div>
      <button
        class="relative flex items-center gap-2 px-4 flex-shrink-0 hover:bg-gray-50 transition-all duration-200"
        :class="{ 'text-gold bg-white scale-105 z-10': activeField === 'openNow' || filters.openNow }"
        @click.stop="toggle('openNow'); activeField = 'openNow'"
      >
        <Clock class="w-5 h-5" />
        <span class="hidden sm:inline">Jetzt geöffnet</span>
        <span v-if="filters.openNow" @click.stop="clear('openNow')" class="ml-1 text-gray-400 hover:text-black cursor-pointer">
          <X class="w-3 h-3" />
        </span>
      </button>
      <button
        class="relative flex items-center gap-2 px-4 flex-shrink-0 hover:bg-gray-50 transition-all duration-200"
        :class="{ 'text-gold bg-white scale-105 z-10': activeField === 'price' || priceActive }"
        @click.stop="openPrice"
      >
        <Euro class="w-5 h-5" />
        <span class="hidden sm:inline">Preis</span>
        <span v-if="priceActive" @click.stop="clear('price')" class="ml-1 text-gray-400 hover:text-black cursor-pointer">
          <X class="w-3 h-3" />
        </span>
        <ChevronDown v-else class="w-4 h-4" />
      </button>
      <div class="pl-3 pr-4">
        <button class="p-2 bg-gold rounded-full text-white hover:bg-gold/90" aria-label="Suchen">
          <Search class="w-4 h-4" />
        </button>
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
import { reactive, ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { MapPin, Clock, Euro, ChevronDown, Search, X } from '@/components/icons'
import FilterPriceSheet from './FilterPriceSheet.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ openNow: false, price: [0, 1000], location: '' })
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const root = ref(null)
const filters = reactive({ ...props.modelValue })
const showPrice = ref(false)
const activeField = ref(null)
const priceActive = computed(() => filters.price[0] !== 0 || filters.price[1] !== 1000)

watch(activeField, (val) => {
  if (val) {
    emit('focus')
  } else {
    emit('blur')
  }
})

watch(filters, () => {
  emit('update:modelValue', { ...filters })
}, { deep: true })

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

function toggle(key) {
  filters[key] = !filters[key]
}
function clear(key) {
  if (key === "price") {
    filters.price = [0, 1000]
  } else if (key === "location") {
    filters.location = ""
  } else {
    filters[key] = false
  }
}

function openPrice() {
  showPrice.value = true
  activeField.value = 'price'
}

function closePrice() {
  showPrice.value = false
  activeField.value = null
}
</script>
