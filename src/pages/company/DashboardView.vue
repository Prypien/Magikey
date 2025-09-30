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
        <div
          v-if="adminNotice"
          class="glass-card border border-amber-200/70 bg-amber-50/80 p-4 text-sm text-amber-700"
        >
          <i class="fa fa-user-shield mr-2"></i>
          {{ adminNotice }}
        </div>
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
            <div class="w-full space-y-3 rounded-3xl border border-white/80 bg-white/70 p-5 text-center shadow-inner">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Verifizierungsstatus</p>
              <div
                class="mx-auto inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold"
                :class="statusMeta.badgeClass"
              >
                <i class="fa" :class="statusMeta.icon"></i>
                {{ statusMeta.label }}
              </div>
              <p class="text-sm text-slate-600">{{ statusMeta.description }}</p>
              <div class="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-700">
                <p class="font-semibold">Sicherheitsversprechen</p>
                <p>
                  Unser Trust-Team prüft dein Profil manuell, verknüpft offizielle Quellen und schaltet dich erst nach
                  erfolgreicher Prüfung frei.
                </p>
              </div>
              <div
                v-if="company.is_admin"
                class="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-700"
              >
                <p class="font-semibold">Administrator-Rechte aktiv</p>
                <p>Du kannst andere Schlüsseldienste im Trust Center prüfen und verifizieren.</p>
              </div>
            </div>
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
              <DataRow label="Verband" :value="company.association_member ? 'Mitglied' : 'kein Mitglied'" />
              <DataRow label="Website" :value="company.website_url || '–'" />
              <DataRow label="Google-Profil" :value="company.google_place_url || '–'" />
            </div>
            <div class="space-y-3 text-sm text-slate-600">
              <h4 class="font-semibold text-slate-800">Beschreibung</h4>
              <p>{{ company.description || 'Noch keine Beschreibung hinterlegt.' }}</p>
              <div v-if="company.price_comment" class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-700">
                <p class="font-semibold">Preis-Transparenz</p>
                <p>{{ company.price_comment }}</p>
              </div>
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
                <router-link
                  v-if="company.is_admin"
                  to="/admin/verification"
                  class="pill-checkbox border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  <i class="fa fa-user-shield"></i>
                  Trust Center öffnen
                </router-link>
              </div>
            </div>

            <div class="glass-card space-y-4 p-6 sm:p-8">
              <h3 class="text-lg font-semibold text-slate-900">Vertrauenssignale</h3>
              <p class="text-sm text-slate-600">
                Transparente Informationen stärken das Sicherheitsgefühl deiner Kundschaft.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-3">
                  <i class="fa fa-shield-alt mt-1 text-emerald-500"></i>
                  <span>{{ company.security_badge || 'Hinterlege ein geprüftes Siegel im Admin-Bereich.' }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fa fa-comments mt-1 text-emerald-500"></i>
                  <span>{{ company.review_policy_note || 'Alle Bewertungen laufen über Magikey und werden moderiert.' }}</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fa fa-location-dot mt-1 text-emerald-500"></i>
                  <span>
                    {{ company.google_place_url ? 'Google-Standort ist verknüpft.' : 'Bitte reiche den offiziellen Google-Link nach.' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DataRow from '@/components/common/DataRow.vue'
import Loader from '@/components/common/Loader.vue'
import { DAYS, DAY_LABELS } from '@/constants/days'
import { onAuthStateChanged } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'

const company = ref(null)
const loading = ref(true)
const adminNotice = ref('')

let unsubscribeAuth

const route = useRoute()
const router = useRouter()

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

watch(
  () => route.query.notice,
  (notice) => {
    if (notice === 'admin_required') {
      adminNotice.value =
        'Du benötigst Administrator-Rechte, um das Trust Center aufzurufen. Bitte lasse dich von einem bestehenden Admin freischalten.'
    } else if (notice === 'admin_error') {
      adminNotice.value =
        'Deine Berechtigung konnte nicht geprüft werden. Aktualisiere die Seite oder wende dich an das Magikey Trust-Team.'
    } else {
      adminNotice.value = ''
    }

    if (notice) {
      const newQuery = { ...route.query }
      delete newQuery.notice
      router.replace({ query: newQuery }).catch(() => {})
    }
  },
  { immediate: true }
)

const statusMeta = computed(() => {
  if (!company.value) {
    return {
      label: 'Unbekannt',
      description: 'Wir laden deine Daten…',
      icon: 'fa-spinner fa-spin',
      badgeClass: 'border-slate-200 bg-slate-50 text-slate-600',
    }
  }

  const status = company.value.verification_status || (company.value.verified ? 'verified' : 'pending')

  if (status === 'verified') {
    return {
      label: 'Verifiziert',
      description: 'Dein Profil ist freigeschaltet und erscheint in den Suchergebnissen.',
      icon: 'fa-check-circle',
      badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    }
  }

  if (status === 'on_hold') {
    return {
      label: 'Unterlagen nachreichen',
      description:
        'Unser Trust-Team benötigt noch Nachweise. Bitte reiche fehlende Dokumente im Admin-Dialog nach.',
      icon: 'fa-hourglass-half',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-600',
    }
  }

  return {
    label: 'In manueller Prüfung',
    description:
      'Wir gleichen deine Angaben mit offiziellen Quellen ab. Du wirst informiert, sobald die Freigabe erfolgt.',
    icon: 'fa-magnifying-glass',
    badgeClass: 'border-slate-200 bg-slate-50 text-slate-600',
  }
})

function formatTimeRange(range) {
  if (!range || !range.open || !range.close) return 'geschlossen'
  return `${range.open} – ${range.close}`
}

function dayStatus(day) {
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return 'text-gray-500'
  return 'text-black'
}

</script>

<style scoped>
img {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
