<template>
  <div ref="root" class="sm:hidden flex justify-center px-2 sticky top-2 z-30">
    <div v-if="!expanded" class="w-full max-w-4xl">
      <button
        @click="expanded = true"
        class="w-full flex items-center gap-2 px-6 py-4 rounded-full border shadow bg-white"
      >
        <Search class="w-5 h-5 text-gold" />
        <span class="text-sm text-gray-600">
          {{ filters.location || 'Ort, Preis, Öffnungszeiten…' }}
        </span>
      </button>
    </div>
    <transition name="slide-down">
      <FilterBar
        v-show="expanded"
        class="w-full max-w-2xl"
        :expanded="true"
        @blur="expanded = false"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Search } from '@/components/icons'
import FilterBar from './FilterBar.vue'
import { filters } from '@/stores/filters'

const expanded = ref(false)
const root = ref(null)

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
