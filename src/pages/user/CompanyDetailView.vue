<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Zurück -->
    <button @click="$router.push('/')" class="text-gold font-semibold mb-4">
      ← Zurück
    </button>

    <!-- Firmenkopf -->
    <div class="flex flex-col items-center mb-6">
      <img :src="company.logo_url || '/logo.png'" alt="Firmenlogo" class="w-24 h-24 rounded-full object-cover shadow" />
      <h1 class="text-2xl font-bold mt-2">{{ company.company_name || 'Unbekannt' }}</h1>
    </div>

    <!-- Basisinfos -->
    <div class="space-y-1">
      <DataRow label="Telefon" :value="company.phone || 'Keine Nummer'" />
      <DataRow label="Adresse" :value="fullAddress" />
      <DataRow label="Preis" :value="`ab ${company.price || '-'} €`" />
      <DataRow label="Bewertung" :value="`${(company.rating || 0).toFixed(1)} ⭐`" />
    </div>

    <!-- Status -->
    <div class="flex items-center gap-2 mt-4 font-semibold" :class="statusColor">
      <span>
        {{ openStatus }}<template v-if="isOpen"> (bis {{ closingTime }})</template>
      </span>
    </div>

    <!-- Öffnungszeiten -->
@@ -32,51 +32,51 @@
      <div class="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div v-for="day in days" :key="day" class="text-sm">
          <strong>{{ dayLabel(day) }}:</strong> {{ formatTimeRange(company.opening_hours?.[day]) }}
        </div>
      </div>
    </div>

    <!-- Beschreibung -->
    <div class="mt-6">
      <h2 class="font-bold mb-2">Beschreibung</h2>
      <p>{{ company.description || 'Keine Beschreibung' }}</p>
    </div>

    <!-- Aktionen -->
    <div class="mt-8 flex gap-4 justify-center">
      <a
        v-if="company.phone"
        :href="`tel:${company.phone}`"
        class="bg-gold text-black font-semibold px-4 py-2 rounded flex items-center gap-2"
      >
        <i class="fa fa-phone"></i> Anrufen
      </a>
      <a
        :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`"
        target="_blank"
        class="bg-black text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
      >
        <i class="fa fa-map-marker"></i> Route
      </a>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/UI/DataRow.vue'

const route = useRoute()
const companyId = route.params.id // ✅ Routing fix
const company = ref({})
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

onMounted(async () => {
  if (companyId) {
    const snapshot = await getDoc(doc(db, 'companies', companyId))
    if (snapshot.exists()) {
      company.value = snapshot.data()
    }
  }
})

const fullAddress = computed(() => `${company.value.postal_code || ''} ${company.value.address || ''}`)

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

<style scoped>
</style>
