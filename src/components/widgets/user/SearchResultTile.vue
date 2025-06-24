<template>
  <li
    class="p-4 bg-white rounded-xl shadow-md border-2 flex items-start gap-4 cursor-pointer hover:shadow-lg"
    :class="borderColor"
    @click="navigateToDetails"
  >
    <img
      class="w-14 h-14 rounded-full object-cover"
      :src="company.logo_url || '/logo.png'"
      alt="Logo"
    />

    <div class="flex-1">
      <h3 class="font-bold text-lg">{{ company.company_name }}</h3>
      <p>PLZ: {{ company.postal_code }}</p>
      <p>Preis: ab {{ company.price }} €</p>
      <div class="flex items-center gap-2 text-sm">
        <span class="text-yellow-500">⭐ {{ company.rating?.toFixed(1) || '4.5' }}</span>
      </div>

      <p class="font-semibold" :class="statusColor">{{ openStatus }}</p>

      <p v-if="!isOpen && company.is_247 && company.emergency_price" class="text-red-600">
        Notdienstpreis: {{ company.emergency_price }} €
      </p>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const isOpen = computed(() => {
  const now = new Date()
  const dayIndex = now.getDay() - 1 // JS: So 0, Mo 1 → deine Öffnungslogik: Mo 0
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const today = days[dayIndex < 0 ? 6 : dayIndex]
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

const statusColor = computed(() =>
  isOpen.value ? 'text-green-600' : props.company.is_247 ? 'text-red-600' : 'text-gray-500'
)

const borderColor = computed(() =>
  isOpen.value ? 'border-green-500' : props.company.is_247 ? 'border-red-500' : 'border-gray-300'
)

function navigateToDetails() {
  router.push({ name: 'details', params: { id: props.company.id } })
}
</script>
