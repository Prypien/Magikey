<!-- Diese Datei listet alle gefundenen Firmen untereinander auf. -->
<template>
  <div>
    <p v-if="companies.length === 0" class="text-center text-gray-500">
      Keine Ergebnisse gefunden
    </p>

    <TransitionGroup
      v-else
      name="slide"
      tag="ul"
      class="grid grid-cols-1 gap-4 auto-rows-fr"
    >
      <SearchResultTile
        v-for="company in companies"
        :key="company.id"
        :company="company"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import SearchResultTile from './SearchResultTile.vue'

defineProps({
  companies: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
