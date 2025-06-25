<template>
  <div>
    <p v-if="companies.length === 0" class="text-center text-gray-500">
      Keine Ergebnisse gefunden
    </p>

    <ul v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <SearchResultTile
        v-for="(company, index) in companies"
        :key="index"
        :company="company"
      />
    </ul>
  </div>
</template>

<script setup>
import SearchResultTile from './SearchResultTile.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true
  }
})
</script>
