<template>
  <div class="form-section">
    <label class="flex items-center gap-2 mb-4">
      <input type="checkbox" v-model="sameForAll" class="accent-gold" />
      <span class="text-sm">Gilt an allen Tagen die gleichen Öffnungszeiten?</span>
    </label>

    <div v-if="sameForAll" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="label">Öffnungszeit von</label>
        <input type="time" v-model="allOpen" class="input" />
      </div>
      <div>
        <label class="label">bis</label>
        <input type="time" v-model="allClose" class="input" />
      </div>
    </div>

    <div v-else class="space-y-3 mb-4">
      <div
        v-for="day in days"
        :key="day.key"
        class="grid grid-cols-1 sm:grid-cols-4 items-center gap-2"
      >
        <span class="text-sm sm:col-span-1">{{ day.label }}</span>
        <input
          type="time"
          v-model="openingHours[day.key].open"
          class="input sm:col-span-1"
          :disabled="isClosed(day.key)"
        />
        <input
          type="time"
          v-model="openingHours[day.key].close"
          class="input sm:col-span-1"
          :disabled="isClosed(day.key)"
        />
        <button
          type="button"
          class="text-xs text-gray-500 sm:col-span-1"
          @click="toggleClosed(day.key)"
        >
          {{ isClosed(day.key) ? "Geöffnet" : "Geschlossen" }}
        </button>
      </div>
      <button
        type="button"
        class="text-sm text-gold underline"
        @click="copyMonday"
      >
        Montag auf alle übernehmen
      </button>
    </div>

    <div class="flex gap-4">
      <button type="button" class="btn-outline py-1 px-3 text-sm" @click="set247">
        24/7
      </button>
      <button type="button" class="btn-outline py-1 px-3 text-sm" @click="setAllClosed">
        Alle geschlossen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const days = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' }
]

// Refs
const sameForAll = ref(false)
const allOpen = ref('')
const allClose = ref('')
const openingHours = ref(
  days.reduce((acc, d) => ({ ...acc, [d.key]: { open: '', close: '', closed: false } }), {})
)

// Helper: Ist der Tag geschlossen?
function isClosed(dayKey) {
  return openingHours.value[dayKey].closed
}

function toggleClosed(dayKey) {
  openingHours.value[dayKey].closed = !openingHours.value[dayKey].closed
  if (openingHours.value[dayKey].closed) {
    openingHours.value[dayKey].open = ''
    openingHours.value[dayKey].close = ''
  }
}

// Watch .modelValue -> local state (für Edit/Reload)
watch(
  () => props.modelValue,
  val => {
    if (!val) return
    days.forEach(d => {
      openingHours.value[d.key] = {
        open: val[d.key]?.open || '',
        close: val[d.key]?.close || '',
        closed: val[d.key]?.closed || false
      }
    })
    // Check if all days are equal and not closed
    const first = openingHours.value[days[0].key]
    const allSame =
      days.every(
        d =>
          openingHours.value[d.key].open === first.open &&
          openingHours.value[d.key].close === first.close &&
          !openingHours.value[d.key].closed
      ) && first.open && first.close
    sameForAll.value = !!allSame
    if (allSame) {
      allOpen.value = first.open
      allClose.value = first.close
    }
  },
  { immediate: true }
)

// Update emit wenn sich openingHours ändern
watch(
  openingHours,
  val => {
    emit('update:modelValue', Object.fromEntries(days.map(d => [d.key, { ...val[d.key] }])))
  },
  { deep: true }
)

// Watch „alle gleich“ + Öffnungszeiten
watch([sameForAll, allOpen, allClose], () => {
  if (sameForAll.value) {
    days.forEach(d => {
      openingHours.value[d.key] = {
        open: allOpen.value,
        close: allClose.value,
        closed: false
      }
    })
  }
})

// Button-Functions
function copyMonday() {
  const m = { ...openingHours.value.monday }
  days.forEach(d => {
    openingHours.value[d.key] = { ...m }
  })
}
function set247() {
  sameForAll.value = true
  allOpen.value = '00:00'
  allClose.value = '23:59'
  days.forEach(d => {
    openingHours.value[d.key] = { open: '00:00', close: '23:59', closed: false }
  })
}
function setAllClosed() {
  sameForAll.value = false
  days.forEach(d => {
    openingHours.value[d.key] = { open: '', close: '', closed: true }
  })
}
</script>
