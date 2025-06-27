<template>
  <div>
    <p v-if="companies.length === 0" class="text-center text-gray-500">
      Keine Ergebnisse gefunden
    </p>

    <ul v-else class="grid grid-cols-1 gap-4 auto-rows-fr">
      <SearchResultTile
        v-for="company in companies"
        :key="company.id"
        :company="company"
      />
    </ul>
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
