<template>
  <div>
    <p v-if="companies.length === 0" class="text-center text-gray-500">
      Keine Ergebnisse gefunden
    </p>

    <ul v-else class="space-y-4">
      <li v-for="(company, index) in companies" :key="index">
        <SearchResultTile :company="company" />
      </li>
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
