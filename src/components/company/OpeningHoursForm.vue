<template>
  <div class="form-section">
    <label class="flex items-center gap-2 mb-2">
      <input type="checkbox" v-model="sameForAll" />
      <span class="text-sm">Gilt an allen Tagen die gleichen Öffnungszeiten?</span>
    </label>

    <div v-if="sameForAll" class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="label">Öffnungszeit von</label>
        <input type="time" v-model="allOpen" class="input" />
      </div>
      <div>
        <label class="label">bis</label>
        <input type="time" v-model="allClose" class="input" />
      </div>
    </div>

    <div v-else class="space-y-2 mb-2">
      <div
        v-for="day in days"
        :key="day.key"
        class="grid grid-cols-4 items-center gap-2"
      >
        <span class="text-sm">{{ day.label }}</span>
        <input type="time" v-model="openingHours[day.key].open" class="input" />
        <input type="time" v-model="openingHours[day.key].close" class="input" />
        <button type="button" class="text-xs text-gray-500" @click="setClosed(day.key)">
          Geschlossen
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
      <button type="button" class="text-sm text-gold underline" @click="set247">
        24/7
      </button>
      <button type="button" class="text-sm text-gold underline" @click="setAllClosed">
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

const sameForAll = ref(false)
const allOpen = ref('')
const allClose = ref('')

const emptyHours = () => ({ open: '', close: '' })
const openingHours = ref(
  days.reduce((acc, d) => ({ ...acc, [d.key]: emptyHours() }), {})
)

watch(
  () => props.modelValue,
  val => {
    if (!val) return
    let firstDay = null
    let allSame = true
    days.forEach(d => {
      const cur = val[d.key] || {}
      openingHours.value[d.key] = { ...emptyHours(), ...cur }
      if (!firstDay) {
        firstDay = cur
      } else if (cur.open !== firstDay.open || cur.close !== firstDay.close) {
        allSame = false
      }
    })
    if (firstDay && firstDay.open && firstDay.close && allSame) {
      sameForAll.value = true
      allOpen.value = firstDay.open
      allClose.value = firstDay.close
    } else {
      sameForAll.value = false
    }
  },
  { immediate: true }
)

watch(openingHours, val => emit('update:modelValue', val), { deep: true })

watch([sameForAll, allOpen, allClose], () => {
  if (sameForAll.value) {
    days.forEach(d => {
      openingHours.value[d.key] = { open: allOpen.value, close: allClose.value }
    })
  }
})

function copyMonday() {
  const m = { ...openingHours.value.monday }
  days.forEach(d => {
    openingHours.value[d.key] = { ...m }
  })
}

function setClosed(day) {
  openingHours.value[day] = { open: '', close: '' }
}

function set247() {
  allOpen.value = '00:00'
  allClose.value = '23:59'
  sameForAll.value = true
  days.forEach(d => {
    openingHours.value[d.key] = { open: '00:00', close: '23:59' }
  })
}

function setAllClosed() {
  days.forEach(d => {
    openingHours.value[d.key] = { open: '', close: '' }
  })
}
</script>
