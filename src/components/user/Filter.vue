<template>
  <div
    :class="[
      dropdown
        ? 'dropdown p-4 space-y-4'
        : 'bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-4'
    ]"
  >
    <h2 class="text-lg font-semibold">🔍 Filter</h2>

    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <label class="label">Umkreis</label>
        <select v-model="selectedDistance" class="input">
          <option v-for="km in [10, 25, 50, 100]" :key="km" :value="km">
            {{ km }} km
          </option>
        </select>
      </div>

      <div>
        <label class="label">Sortieren</label>
        <select v-model="sortBy" class="input">
          <option value="price_asc">Preis aufsteigend</option>
          <option value="price_desc">Preis absteigend</option>
        </select>
      </div>

    </div>

    <div class="grid gap-2 sm:grid-cols-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="onlyOpen" class="accent-gold" />
        <span>Nur geöffnete Firmen</span>
      </label>

      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="onlyEmergency" class="accent-gold" />
        <span>Nur mit 24/7 Notdienst</span>
      </label>
    </div>

    <div class="text-right">
      <button @click="apply" class="btn px-4 py-2">Filter anwenden</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { dropdown } = defineProps({
  dropdown: {
    type: Boolean,
    default: false,
  },
})

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
    onlyEmergency: onlyEmergency.value,
  })
}
</script>
