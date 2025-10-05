<!-- Diese Datei sammelt die Öffnungszeiten für mehrere Wochentage ein. -->
<template>
  <div class="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-inner">
    <label class="font-semibold text-slate-700">Wochentage</label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="day in days"
        :key="day.key"
        type="button"
        class="pill-checkbox px-4 py-2 text-xs sm:text-sm"
        :class="{ 'border-gold bg-gold/25 text-slate-900 shadow': selectedDays.includes(day.key) }"
        @click="toggleDay(day.key)"
      >
        {{ day.short }}
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600">
      <span class="font-medium">Uhrzeit</span>
      <input type="time" v-model="open" class="water-input w-28 px-3 py-2 text-sm" />
      <span>–</span>
      <input type="time" v-model="close" class="water-input w-28 px-3 py-2 text-sm" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DAYS, DAY_LABELS } from '@/core/constants/days'

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
.pill-checkbox {
  transition: all 0.2s ease;
}
</style>
