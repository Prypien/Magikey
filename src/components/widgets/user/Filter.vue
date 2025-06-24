<template>
  <div class="bg-white shadow-md rounded-xl p-6 border border-gray-200">
    <h2 class="text-xl font-semibold mb-4">🔍 Filter</h2>

    <fieldset class="mb-4">
      <label class="block mb-1">Umkreis</label>
      <select v-model="selectedDistance" class="w-full border rounded px-3 py-2">
        <option v-for="km in [10, 25, 50, 100]" :key="km" :value="km">
          {{ km }} km
        </option>
      </select>
    </fieldset>

    <fieldset class="mb-4">
      <label class="block mb-1">Sortieren</label>
      <select v-model="sortBy" class="w-full border rounded px-3 py-2">
        <option value="price_asc">Preis aufsteigend</option>
        <option value="price_desc">Preis absteigend</option>
      </select>
    </fieldset>

    <label class="flex items-center mb-2">
      <input type="checkbox" v-model="onlyOpen" class="mr-2" />
      Nur geöffnete Firmen
    </label>

    <label class="flex items-center mb-4">
      <input type="checkbox" v-model="onlyEmergency" class="mr-2" />
      Nur mit 24/7 Notdienst
    </label>

    <button
      @click="apply"
      class="w-full bg-[#d9a908] hover:bg-yellow-500 text-black font-semibold py-2 rounded"
    >
      Filter anwenden
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['apply'])

const selectedDistance = ref(25)
const sortBy = ref('price_asc')
const onlyOpen = ref(false)
const onlyEmergency = ref(false)

const apply = () => {
  emit('apply', {
    distance: selectedDistance.value,
    sortBy: sortBy.value,
    onlyOpen: onlyOpen.value,
    onlyEmergency: onlyEmergency.value
  })
}
</script>
