<!-- Diese Datei zeigt eingeloggten Firmen ihre Profilübersicht. -->
<template>
  <section class="page-wrapper">
    <Transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="glass-card flex flex-col items-center justify-center gap-4 p-12 text-slate-500"
      >
        <Loader :size="80" />
        <p class="text-sm">Lädt Firmendaten…</p>
      </div>
      <div
        v-else-if="!company"
        class="glass-card flex flex-col items-center gap-3 p-12 text-center text-red-500"
      >
        <i class="fa fa-exclamation-circle text-3xl"></i>
        <p>Keine Firmendaten gefunden.</p>
      </div>
      <div v-else class="space-y-10">
        <div class="glass-card p-8 sm:p-10">
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="relative">
              <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner">
                <img
                  :src="company.logo_url || '/logo.png'"
                  alt="Firmenlogo"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-slate-900">{{ company.company_name }}</h2>
              <p class="text-sm text-slate-500">{{ company.city }} · PLZ {{ company.postal_code }}</p>
            </div>
            <Transition name="fade">
              <div
                v-if="!company.verified"
                class="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-700"
              >
                <p>Dein Profil ist noch nicht verifiziert.</p>
                <Button
                  size="sm"
                  type="button"
                  @click="verifyProfile"
                  :disabled="verificationSending"
                >
                  <template v-if="verificationSending">Senden…</template>
                  <template v-else>Verifizierungsmail senden</template>
                </Button>
                <p v-if="verificationSent" class="text-emerald-600">E-Mail wurde gesendet.</p>
              </div>
              <div
                v-else
                class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600"
              >
                <i class="fa fa-check-circle"></i>
                Profil verifiziert
              </div>
            </Transition>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div class="glass-card p-6 sm:p-8 space-y-6">
            <h3 class="text-lg font-semibold text-slate-900">Stammdaten</h3>
            <div class="grid gap-3 sm:grid-cols-2">
              <DataRow label="E-Mail" :value="company.email || '–'" />
              <DataRow label="Telefon" :value="company.phone || '–'" />
              <DataRow label="Adresse" :value="company.address || '–'" />
              <DataRow label="Ort" :value="company.city || '–'" />
              <DataRow label="PLZ" :value="company.postal_code || '–'" />
              <DataRow label="Preis" :value="company.price ? `ab ${company.price} €` : 'auf Anfrage'" />
              <DataRow label="24/7 Notdienst" :value="company.is_247 ? 'Ja' : 'Nein'" />
              <DataRow
                v-if="company.is_247 && company.emergency_price"
                label="Notdienstpreis"
                :value="`${company.emergency_price} €`"
              />
            </div>
            <div class="space-y-3 text-sm text-slate-600">
              <h4 class="font-semibold text-slate-800">Beschreibung</h4>
              <p>{{ company.description || 'Noch keine Beschreibung hinterlegt.' }}</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="glass-card p-6 sm:p-8 space-y-4">
              <h3 class="text-lg font-semibold text-slate-900">Öffnungszeiten</h3>
              <div class="space-y-2 text-sm">
                <div
                  v-for="day in days"
                  :key="day.key"
                  class="flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 px-4 py-2"
                  :class="dayStatus(day.key)"
                >
                  <span class="font-medium text-slate-700">{{ day.label }}</span>
                  <span class="text-slate-600">{{ formatTimeRange(company.opening_hours?.[day.key]) }}</span>
                </div>
              </div>
            </div>

            <div class="glass-card p-6 sm:p-8 space-y-4">
              <h3 class="text-lg font-semibold text-slate-900">Schnellaktionen</h3>
              <p class="text-sm text-slate-600">
                Halte dein Profil aktuell, um in der Suche prominent zu bleiben.
              </p>
              <div class="flex flex-wrap gap-3">
                <router-link to="/edit" class="pill-checkbox bg-gold/30 text-slate-900">
                  <i class="fa fa-pen"></i>
                  Profil bearbeiten
                </router-link>
                <router-link to="/" class="pill-checkbox">
                  <i class="fa fa-eye"></i>
                  Vorschau anzeigen
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/common/DataRow.vue'
import Loader from '@/components/common/Loader.vue'
import Button from '@/components/common/Button.vue'
import { sendVerificationEmail } from '@/services/auth'
import { DAYS, DAY_LABELS } from '@/constants/days'
import { onAuthStateChanged } from 'firebase/auth'

const company = ref(null)
const loading = ref(true)
const verificationSending = ref(false)
const verificationSent = ref(false)

let unsubscribeAuth

async function loadCompany(uid) {
  if (!isFirebaseConfigured) {
    company.value = null
    loading.value = false
    return
  }
  loading.value = true
  company.value = null

  try {
    const snap = await getDoc(doc(db, 'companies', uid))
    if (snap.exists()) {
      company.value = snap.data()
    }
  } catch (e) {
    console.error('Fehler beim Laden der Firmendaten:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isFirebaseConfigured) {
    loading.value = false
    return
  }
  try {
    unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          loadCompany(user.uid)
        } else {
          company.value = null
          loading.value = false
        }
      },
      (error) => {
        console.error('Auth-Listener konnte nicht gestartet werden:', error)
        company.value = null
        loading.value = false
      }
    )
  } catch (error) {
    console.error('Registrierung des Auth-Listeners fehlgeschlagen:', error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (typeof unsubscribeAuth === 'function') {
    unsubscribeAuth()
  }
})

const days = DAYS.map(key => ({ key, label: DAY_LABELS[key] }))

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
  if (!isFirebaseConfigured) return
  const user = auth.currentUser
  if (!user || verificationSending.value) return
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
