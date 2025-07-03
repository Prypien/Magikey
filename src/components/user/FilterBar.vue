<template>
  <div
    class="sticky top-2 z-30 flex gap-2 bg-white/80 backdrop-blur-md px-2 py-3 rounded-2xl shadow-lg w-full max-w-3xl mx-auto border border-gray-100 overflow-x-auto"
  >
    <FilterChip
      icon="Clock"
      label="Jetzt geöffnet"
      :active="filters.openNow"
      @click="toggle('openNow')"
    />
    <FilterChip
      icon="Euro"
      label="Preis"
      :active="priceActive"
      @click="showPrice = true"
    />
    <div class="relative flex items-center">
      <MapPin class="w-5 h-5 text-gold mr-1" />
      <input
        v-model="filters.location"
        placeholder="Wo?"
        class="bg-transparent border-none focus:ring-0 placeholder:text-gray-400 text-sm w-16 sm:w-24"
        autocomplete="postal-code"
      />
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
import { MapPin } from 'lucide-vue-next'
import FilterChip from './FilterChip.vue'
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
