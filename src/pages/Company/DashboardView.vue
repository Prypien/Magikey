<template>
  <div class="max-w-3xl mx-auto p-6">
    <Transition name="fade" mode="out-in">
      <div v-if="loading" class="flex flex-col items-center py-20 text-gray-500">
        <Loader :size="80" />
        <p class="mt-2">Lädt Firmendaten...</p>
      </div>
      <div v-else-if="!company" class="text-center text-red-500 py-20">
        Keine Firmendaten gefunden.
      </div>
      <div v-else class="bg-white/90 rounded-xl shadow p-6 space-y-6">
        <Transition name="fade">
          <div v-if="!company.verified" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
            <p class="text-yellow-800">Dein Profil ist noch nicht verifiziert.</p>
            <Button
              size="sm"
              class="mt-2"
              type="button"
              @click="verifyProfile"
              :disabled="verificationSending"
            >
              <template v-if="verificationSending">Senden...</template>
              <template v-else>Verifizierungsmail senden</template>
            </Button>
            <p v-if="verificationSent" class="text-green-600 text-sm mt-2">E-Mail wurde gesendet.</p>
          </div>
          <div v-else class="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4 flex items-center gap-2">
            <i class="fa fa-check-circle text-green-600"></i>
            <p class="text-green-800 font-semibold">Profil verifiziert</p>
          </div>
        </Transition>
        <div class="flex flex-col items-center">
          <img
            v-if="company.logo_url"
            :src="company.logo_url"
            alt="Firmenlogo"
            class="w-24 h-24 rounded-full object-cover shadow mb-2"
          />
          <h2 class="text-xl font-semibold text-gray-800">
            {{ company.company_name }}
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <DataRow label="E-Mail" :value="company.email" />
          <DataRow label="Telefon" :value="company.phone" />
          <DataRow label="Adresse" :value="company.address" />
          <DataRow label="Ort" :value="company.city" />
          <DataRow label="PLZ" :value="company.postal_code" />
          <DataRow label="Preis" :value="`ab ${company.price} €`" />
          <DataRow label="24/7 Notdienst" :value="company.is_247 ? 'Ja' : 'Nein'" />
          <DataRow
            v-if="company.is_247 && company.emergency_price"
            label="Notdienstpreis"
            :value="`${company.emergency_price} €`"
          />
        </div>

        <div>
          <h3 class="font-bold mb-2 text-gray-800">Öffnungszeiten</h3>
          <div
            v-for="day in days"
            :key="day.key"
            class="text-sm"
            :class="dayStatus(day.key)"
          >
            {{ day.label }}: {{ formatTimeRange(company.opening_hours?.[day.key]) }}
          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/common/DataRow.vue'
import Loader from '@/components/common/Loader.vue'
import Button from '@/components/common/Button.vue'
import { sendVerificationEmail } from '@/services/auth'

const company = ref(null)
const loading = ref(true)
const verificationSending = ref(false)
const verificationSent = ref(false)

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

function dayStatus(day) {
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return 'text-gray-500'
  return 'text-black'
}

async function verifyProfile() {
  const user = auth.currentUser
  if (!user) return
  verificationSending.value = true
  try {
    await sendVerificationEmail(user)
    verificationSent.value = true
  } catch (e) {
    window.alert('Fehler beim Senden der Verifizierungsmail: ' + e.message)
  } finally {
    verificationSending.value = false
  }
}
</script>

<style scoped>
img {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
