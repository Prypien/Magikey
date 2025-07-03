<template>
  <div class="sticky top-0 z-30 bg-white flex gap-2 py-2 px-3 rounded-2xl shadow overflow-x-auto">
    <FilterChip
      :active="filters.openNow"
      :icon="Clock"
      label="Jetzt geöffnet"
      @click="toggle('openNow')"
    />
    <FilterChip
      :active="priceActive"
      :icon="Euro"
      label="Preis"
      :showChevron="true"
      @click="showPrice = true"
    />
    <div class="flex items-center px-3 py-2 rounded-2xl border bg-white" :class="filters.location ? 'border-gold text-gold' : 'border-gray-200 text-gray-700'">
      <MapPin class="w-5 h-5 mr-2" />
      <input
        v-model="filters.location"
        placeholder="Wo?"
        class="bg-transparent focus:outline-none w-20 sm:w-32"
      />
    </div>
    <FilterPriceSheet
      v-model="filters.price"
      :visible="showPrice"
      @close="showPrice = false; priceActive = true"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { Clock, Euro, MapPin } from 'lucide-vue-next'
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
const priceActive = ref(false)

watch(filters, () => {
  emit('update:modelValue', { ...filters })
}, { deep: true })

function toggle(key) {
  filters[key] = !filters[key]
}
</script>
