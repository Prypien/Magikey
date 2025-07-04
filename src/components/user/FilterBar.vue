<template>
  <div class="sticky top-2 z-30 flex justify-center px-2">
    <div
      class="flex items-center w-full max-w-3xl divide-x rounded-full shadow-lg bg-white/80 backdrop-blur border border-gray-100"
    >
      <div class="flex items-center gap-2 px-4 flex-1">
        <MapPin class="w-5 h-5 text-gold" />
        <input
          v-model="filters.location"
          placeholder="Wo?"
          class="flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-400 text-sm"
          autocomplete="postal-code"
        />
      </div>
      <button
        class="flex items-center gap-2 px-4 flex-shrink-0 hover:bg-gray-50"
        :class="{ 'text-gold': filters.openNow }"
        @click="toggle('openNow')"
      >
        <Clock class="w-5 h-5" />
        <span class="hidden sm:inline">Jetzt geöffnet</span>
      </button>
      <button
        class="relative flex items-center gap-2 px-4 flex-shrink-0 hover:bg-gray-50"
        :class="{ 'text-gold': priceActive }"
        @click="showPrice = true"
      >
        <Euro class="w-5 h-5" />
        <span class="hidden sm:inline">Preis</span>
        <ChevronDown class="w-4 h-4" />
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
      @close="showPrice = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { MapPin, Clock, Euro, ChevronDown, Search } from '@/components/icons'
import FilterPriceSheet from './FilterPriceSheet.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ openNow: false, price: [0, 100], location: '' })
  }
})

const emit = defineEmits(['update:modelValue'])

const filters = reactive({ ...props.modelValue })
const showPrice = ref(false)
const priceActive = computed(() => filters.price[0] !== 0 || filters.price[1] !== 100)

watch(filters, () => {
  emit('update:modelValue', { ...filters })
}, { deep: true })

function toggle(key) {
  filters[key] = !filters[key]
}
</script>
