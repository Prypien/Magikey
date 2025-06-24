<template>
  <div class="max-w-3xl mx-auto p-6">
    <div v-if="loading" class="text-center text-gray-500">⏳ Lädt Firmendaten...</div>

    <div v-else-if="!company" class="text-center text-red-500">
      Keine Firmendaten gefunden.
    </div>

    <div v-else>
      <div class="flex justify-center mb-6">
        <img v-if="company.logo_url" :src="company.logo_url" alt="Firmenlogo" class="w-24 h-24 rounded-full object-cover shadow" />
      </div>

      <div class="space-y-2">
        <DataRow label="Firmenname" :value="company.company_name" />
        <DataRow label="E-Mail" :value="company.email" />
        <DataRow label="Telefon" :value="company.phone" />
        <DataRow label="Adresse" :value="company.address" />
        <DataRow label="Ort" :value="company.city" />
        <DataRow label="PLZ" :value="company.postal_code" />
        <DataRow label="Preis" :value="`ab ${company.price} €`" />
        <DataRow label="24/7 Notdienst" :value="company.is_247 ? 'Ja' : 'Nein'" />
        <DataRow v-if="company.is_247 && company.emergency_price" label="Notdienstpreis" :value="`${company.emergency_price} €`" />
      </div>

      <div class="mt-6">
        <h2 class="font-bold mb-2">Öffnungszeiten:</h2>
        <div v-for="day in days" :key="day.key" class="text-sm text-gray-700">
          {{ day.label }}: {{ formatTimeRange(company.opening_hours?.[day.key]) }}
        </div>
      </div>

      <p class="mt-4 font-semibold text-gray-800">
        Bewertung: {{ parseFloat(company.rating || 0).toFixed(1) }} ⭐
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/ui/DataRow.vue'

const company = ref(null)
const loading = ref(true)

onMounted(async () => {
  const user = auth.currentUser
  if (!user) return

  try {
    const snap = await getDoc(doc(db, 'companies', user.uid))
    if (snap.exists()) {
      company.value = snap.data()
    }
  } catch (e) {
    console.error('Fehler beim Laden der Firmendaten:', e)
  } finally {
    loading.value = false
  }
})

const days = [
  { key: 'monday', label: 'Mo' },
  { key: 'tuesday', label: 'Di' },
  { key: 'wednesday', label: 'Mi' },
  { key: 'thursday', label: 'Do' },
  { key: 'friday', label: 'Fr' },
  { key: 'saturday', label: 'Sa' },
  { key: 'sunday', label: 'So' },
]

function formatTimeRange(range) {
  if (!range || !range.open || !range.close) return 'geschlossen'
  return `${range.open} – ${range.close}`
}
</script>

<style scoped>
img {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
