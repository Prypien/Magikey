<!-- Diese Datei sammelt die Öffnungszeiten für mehrere Wochentage ein. -->
<template>
  <div class="form-section">
    <label class="block font-semibold mb-2">Wochentage</label>
    <div class="flex gap-2 mb-4">
      <button
        v-for="day in days"
        :key="day.key"
        :class="[
          'w-10 py-1 rounded-2xl border text-sm font-medium',
          selectedDays.includes(day.key)
            ? 'bg-gold text-white border-gold shadow'
            : 'bg-white text-gray-600 border-gray-300'
        ]"
        @click="toggleDay(day.key)"
        type="button"
      >
        {{ day.short }}
      </button>
    </div>
    <div class="flex items-center gap-3">
      <label class="text-sm">Uhrzeit:</label>
      <input type="time" v-model="open" class="input w-24" />
      <span>–</span>
      <input type="time" v-model="close" class="input w-24" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DAYS, DAY_LABELS } from '@/constants/days'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const days = DAYS.map(key => ({ key, short: DAY_LABELS[key] }))

const selectedDays = ref(
  Object.keys(props.modelValue).length
    ? Object.keys(props.modelValue)
    : DAYS.slice(0, 5)
)
const open = ref('')
const close = ref('')

// Sync mit v-model
watch(
  () => props.modelValue,
  val => {
    if (!val) return
    const keys = Object.keys(val)
    if (keys.length) {
      // only update selected days if they actually changed
      if (
        keys.length !== selectedDays.value.length ||
        keys.some((k, i) => k !== selectedDays.value[i])
      ) {
        selectedDays.value = keys
      }
      const first = val[keys[0]] || {}
      if (open.value !== first.open) {
        open.value = first.open || ''
      }
      if (close.value !== first.close) {
        close.value = first.close || ''
      }
    }
  },
  { immediate: true }
)

// Emit
watch([selectedDays, open, close], () => {
  const result = {}
  selectedDays.value.forEach(day => {
    result[day] = { open: open.value, close: close.value }
  })
  emit('update:modelValue', result)
})

function toggleDay(key) {
  if (selectedDays.value.includes(key)) {
    selectedDays.value = selectedDays.value.filter(d => d !== key)
  } else {
    selectedDays.value.push(key)
  }
}
</script>

<style scoped>
.input {
  @apply border rounded-xl px-2 py-1 w-24 text-sm focus:ring-2 focus:ring-gold focus:border-gold border-gray-300;
}
.bg-gold {
  background-color: #d9a908 !important;
  color: #fff !important;
  border-color: #d9a908 !important;
}
</style>
