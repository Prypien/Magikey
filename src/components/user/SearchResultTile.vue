<!-- Diese Datei zeigt eine einzelne Firma in der Ergebnisliste. -->
<template>
  <li
    class="p-4 bg-white rounded-xl border flex gap-4 cursor-pointer hover:shadow-lg transition min-h-28"
    :class="borderColor"
    @click="navigateToDetails"
  >
    <img
      class="w-16 h-16 rounded-md object-cover"
      :src="company.logo_url || '/logo.png'"
      alt="Logo"
    />

    <div class="flex-1 space-y-1">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-lg">{{ company.company_name }}</h3>
        <span v-if="!company.verified" class="text-xs text-red-500">Not verified</span>
      </div>
      <p class="text-sm text-gray-600">PLZ: {{ company.postal_code }}</p>
      <p v-if="isOpen" class="text-sm">Preis: ab {{ company.price }} €</p>
      <p v-else-if="company.emergency_price" class="text-sm text-red-600">
        Notdienstpreis: {{ company.emergency_price }} €
      </p>
      <p>
        <span
          class="px-2 py-1 rounded-full text-xs font-semibold"
          :class="statusClass"
        >
          {{ openStatus }}
        </span>
      </p>
      <p
        v-if="lockTypes.length"
        class="text-xs text-gray-500 flex items-center gap-1"
      >
        <span>{{ lockTypeDisplay }}</span>
      </p>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LOCK_TYPE_LABELS, LOCK_TYPE_ICONS } from '@/constants/lockTypes'
import { DAYS } from '@/constants/days'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const isOpen = computed(() => {
  const now = new Date()
  const dayIndex = now.getDay() - 1
  const today = DAYS[dayIndex < 0 ? 6 : dayIndex]
  const hours = props.company?.opening_hours?.[today]

  if (!hours || !hours.open || !hours.close) return false

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const nowM = now.getHours() * 60 + now.getMinutes()
  return nowM >= toMinutes(hours.open) && nowM <= toMinutes(hours.close)
})

const openStatus = computed(() => {
  if (isOpen.value) return 'Jetzt geöffnet'
  if (props.company.is_247) return 'Geschlossen – Notdienst verfügbar'
  return 'Derzeit geschlossen'
})

const statusClass = computed(() =>
  isOpen.value
    ? 'bg-green-100 text-green-800'
    : props.company.is_247
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-600'
)

const borderColor = computed(() =>
  isOpen.value ? 'border-green-500' : props.company.is_247 ? 'border-red-500' : 'border-gray-300'
)

const lockTypes = computed(() =>
  (props.company.lock_types || []).map((t) => ({
    icon: LOCK_TYPE_ICONS[t] || '',
    label: LOCK_TYPE_LABELS[t] || t
  }))
)

const lockTypeDisplay = computed(() =>
  lockTypes.value.map((lt) => lt.icon).join(' ')
)

function navigateToDetails() {
  router.push({ name: 'details', params: { id: props.company.id } })
}
</script>
