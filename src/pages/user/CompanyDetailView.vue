<template>
  <div class="max-w-5xl mx-auto p-6">
    <button @click="$router.back()" class="text-gold font-semibold mb-4 flex items-center gap-1">
      <span class="text-lg">←</span>
      <span>Zurück</span>
    </button>

    <div class="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <div class="flex flex-col items-center text-center">
          <img
            :src="company.logo_url || '/logo.png'"
            alt="Firmenlogo"
            class="w-28 h-28 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <h1 class="text-3xl font-bold mt-4 text-black flex items-center gap-2">
            {{ company.company_name || 'Unbekannt' }}
            <span v-if="!company.verified" class="text-sm text-red-600">Not verified</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">{{ fullAddress }}</p>
        </div>

        <div class="space-y-1 mt-6">
          <DataRow label="Telefon" :value="company.phone || 'Keine Nummer'" />
          <DataRow label="Preis" :value="`ab ${company.price || '-'} €`" />
        </div>

        <div class="flex items-center gap-2 mt-4 font-semibold" :class="statusColor">
          <span>{{ openStatus }}</span>
          <span v-if="isOpen" class="text-gray-500">bis {{ closingTime }}</span>
        </div>

        <div class="mt-6">
          <h2 class="font-semibold mb-2 text-black">Öffnungszeiten</h2>
          <div class="bg-gray-50 border rounded-lg p-4">
            <div v-for="day in days" :key="day" class="text-sm" :class="dayStatus(day)">
              <strong class="mr-1">{{ dayLabel(day) }}:</strong>
              {{ formatTimeRange(company.opening_hours?.[day]) }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="font-semibold mb-2 text-black">Beschreibung</h2>
          <p class="text-gray-700">{{ company.description || 'Keine Beschreibung' }}</p>
        </div>

        <div class="mt-8 flex gap-4 justify-center">
          <a
            v-if="company.phone"
            :href="`tel:${company.phone}`"
            class="bg-gold text-black font-semibold px-4 py-2 rounded-full flex items-center gap-2"
          >
            <i class="fa fa-phone"></i> Anrufen
          </a>
        </div>

      </div>

      <div class="md:w-1/2">
        <iframe
          class="w-full h-64 md:h-full rounded"
          :src="mapUrl"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCompany } from '@/services/company'
import DataRow from '@/components/common/DataRow.vue'

const route = useRoute()
const companyId = route.params.id
const company = ref({})
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

onMounted(async () => {
  if (companyId) {
    try {
      const data = await getCompany(companyId)
      if (data) {
        company.value = data
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
    }
  }
})

const fullAddress = computed(() => `${company.value.postal_code || ''} ${company.value.address || ''}`)
const mapUrl = computed(() => `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`)

const now = new Date()
const currentMinutes = now.getHours() * 60 + now.getMinutes()

const isOpen = computed(() => {
  const day = days[now.getDay() - 1 < 0 ? 6 : now.getDay() - 1]
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return false

  const toMin = (t) => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1])
  return currentMinutes >= toMin(hours.open) && currentMinutes <= toMin(hours.close)
})

const closingTime = computed(() => {
  const day = days[now.getDay() - 1 < 0 ? 6 : now.getDay() - 1]
  return company.value.opening_hours?.[day]?.close || ''
})

const openStatus = computed(() => {
  if (isOpen.value) return 'Jetzt geöffnet'
  if (company.value.is_247 && company.value.emergency_price) return `Notdienst verfügbar – ${company.value.emergency_price} €`
  return 'Derzeit geschlossen'
})

const statusColor = computed(() => {
  if (isOpen.value) return 'text-green-600'
  if (company.value.is_247) return 'text-red-600'
  return 'text-gray-500'
})

function dayStatus(day) {
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return 'text-gray-500'
  return 'text-black'
}

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

function formatTimeRange(range) {
  if (!range || !range.open || !range.close) return 'geschlossen'
  return `${range.open} – ${range.close}`
}
</script>
