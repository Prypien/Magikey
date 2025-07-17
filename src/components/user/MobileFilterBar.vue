<template>
  <div ref="root" class="sm:hidden flex justify-center px-2 sticky top-2 z-30">
    <div v-if="!expanded" class="flex items-center w-full max-w-4xl gap-2">
      <button @click="expanded = true" class="flex-1 flex items-center justify-between px-4 py-3 rounded-full border shadow bg-white">
        <span class="text-sm">Suche</span>
        <Search class="w-5 h-5" />
      </button>
      <button @click="toggle('openNow')" class="p-3 rounded-full border bg-white" :class="{ 'text-gold border-gold': filters.openNow }">
        <Clock class="w-5 h-5" />
      </button>
      <button @click="openPrice" class="p-3 rounded-full border bg-white" :class="{ 'text-gold border-gold': priceActive }">
        <Euro class="w-5 h-5" />
      </button>
    </div>
    <transition name="slide-down">
      <FilterBar
        ref="bar"
        v-show="expanded"
        class="w-full max-w-2xl"
        :expanded="true"
        @blur="expanded = false"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Search, Clock, Euro } from '@/components/icons'
import FilterBar from './FilterBar.vue'
import { filters } from '@/stores/filters'

const expanded = ref(false)
const bar = ref(null)
const root = ref(null)

const priceActive = computed(() => filters.price[0] !== 0 || filters.price[1] !== 1000)

function toggle(key) {
  filters[key] = !filters[key]
}

function openPrice() {
  expanded.value = true
  nextTick(() => {
    bar.value?.openPrice()
  })
}

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
</script>

<style scoped>
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>
