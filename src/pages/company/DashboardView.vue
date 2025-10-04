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
                class="flex w-full flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50/80 px-5 py-5 text-sm text-amber-700"
              >
                <div class="flex items-center gap-3 text-amber-800">
                  <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg text-amber-500">
                    <i class="fa fa-shield-check"></i>
                  </span>
                  <p class="font-semibold">Dein Profil befindet sich in unserer Sicherheitsprüfung.</p>
                </div>
                <p class="text-center text-sm text-amber-700">
                  Unser Trust &amp; Safety Team gleicht deine Angaben mit offiziellen Quellen ab. Sobald alles bestätigt
                  ist, schalten wir dein Profil frei und du erhältst eine Bestätigung per E-Mail.
                </p>
                <div class="flex flex-col gap-2 text-xs text-amber-700 sm:flex-row sm:items-center sm:justify-center">
                  <router-link
                    to="/on-hold"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-amber-400 bg-white px-4 py-2 font-semibold text-amber-700"
                  >
                    <i class="fa fa-eye"></i>
                    Prüfstatus ansehen
                  </router-link>
                  <a
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-amber-200/60 px-4 py-2 font-semibold text-amber-700"
                    href="mailto:partner@magikey.de"
                  >
                    <i class="fa fa-envelope"></i>
                    Trust-Team kontaktieren
                  </a>
                </div>
                <div class="rounded-2xl border border-amber-200/60 bg-white/70 px-4 py-3 text-xs text-amber-700">
                  <p class="flex items-center gap-2 font-semibold text-amber-800">
                    <span class="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400"></span>
                    {{ verificationStatusLabel }}
                  </p>
                  <p v-if="company.verification?.assigned_admin" class="mt-2">
                    Ansprechpartner: {{ company.verification.assigned_admin }}
                  </p>
                  <p v-if="company.verification?.association_member" class="mt-2">
                    Verband geprüft und hinterlegt.
                  </p>
                </div>
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
              <DataRow label="WhatsApp" :value="company.whatsapp || '–'" />
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
            <div class="glass-card space-y-4 p-6 sm:p-8">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 class="text-lg font-semibold text-slate-900">Öffnungszeiten</h3>
                <span
                  v-if="company.verification?.status === 'verified'"
                  class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
                >
                  <i class="fa fa-lock"></i>
                  Verifiziert durch Trust-Team
                </span>
              </div>
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
              <h3 class="text-lg font-semibold text-slate-900">Ankunftszeiten einschätzen</h3>
              <p class="text-sm text-slate-600">
                Die frühere Live-Tracking-Funktion wurde entfernt. Bitte stimme die genaue Ankunft direkt mit deinen Kundinnen
                und Kunden ab. In der Unternehmensansicht wird eine grobe Ankunftszeit auf Basis der Entfernung angezeigt.
              </p>
              <p class="text-xs text-slate-500">
                Tipp: Halte deine Adress- und Kontaktdaten aktuell, damit Nachfragen schnell beantwortet werden können.
              </p>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/common/DataRow.vue'
import Loader from '@/components/common/Loader.vue'
import { DAYS, DAY_LABELS } from '@/constants/days'
import { onAuthStateChanged } from 'firebase/auth'

const company = ref(null)
const loading = ref(true)

const router = useRouter()

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
      company.value = { id: snap.id, ...snap.data() }
      if (!company.value.verified && company.value.verification?.status !== 'verified') {
        router.replace({ name: 'verification-hold' })
      }
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

const verificationStatusLabel = computed(() => {
  const status = company.value?.verification?.status
  if (status === 'verified') return 'Prüfung abgeschlossen'
  if (status === 'rejected') return 'Profil benötigt Anpassungen'
  if (status === 'in_review') return 'Profil in Bearbeitung'
  return 'Profil in Prüfung'
})
</script>

<style scoped>
img {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
