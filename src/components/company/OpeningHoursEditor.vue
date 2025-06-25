<template>
  <div>
    <h2 class="font-bold mb-4 text-lg">Öffnungszeiten</h2>

    <div v-if="!showAllDays" class="space-y-4">
      <DayRow label="Mo–Fr" :days="['monday', 'tuesday', 'wednesday', 'thursday', 'friday']" />
      <DayRow label="Samstag" :days="['saturday']" />
      <DayRow label="Sonntag" :days="['sunday']" />
    </div>

    <div v-else class="space-y-2">
      <DayRow
        v-for="day in days"
        :key="day"
        :label="dayLabel(day)"
        :days="[day]"
      />
    </div>

    <button
      @click="showAllDays = !showAllDays"
      class="text-sm text-blue-600 mt-2 flex items-center gap-1"
    >
      <i :class="showAllDays ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
      {{ showAllDays ? 'Weniger anzeigen' : 'Individuell anpassen' }}
    </button>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const props = defineProps({
  openingHours: Object,
})
const emit = defineEmits(['update'])

const showAllDays = ref(false)

const updateTime = (day, type, value) => {
  emit('update', { day, type, value })
}

provide('openingHours', props.openingHours)
provide('updateTime', updateTime)

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

function dayLabel(day) {
  return {
    monday: 'Mo',
    tuesday: 'Di',
    wednesday: 'Mi',
    thursday: 'Do',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'So'
  }[day] || day
}
</script>

<script>
import { inject } from 'vue'

export default {
  components: {
    DayRow: {
      props: ['label', 'days'],
      setup() {
        const openingHours = inject('openingHours')
        const updateTime = inject('updateTime')

        const timeOptions = [
          '', '00:00', '01:00', '02:00', '03:00', '04:00',
          '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
          '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
          '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ]

        return { openingHours, updateTime, timeOptions }
      },
      template: `
        <div class="flex items-center gap-2">
          <div class="w-24 font-medium">{{ label }}</div>
          <select
            class="border border-gray-300 rounded px-2 py-1 text-sm"
            :value="openingHours[days[0]].open"
            @change="e => days.forEach(day => updateTime(day, 'open', e.target.value))"
          >
            <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
          </select>
          <span class="mx-1">–</span>
          <select
            class="border border-gray-300 rounded px-2 py-1 text-sm"
            :value="openingHours[days[0]].close"
            @change="e => days.forEach(day => updateTime(day, 'close', e.target.value))"
          >
            <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>
      `
    }
  }
}
</script>

<style scoped>
</style>