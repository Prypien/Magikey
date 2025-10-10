<template>
  <section class="page-wrapper">
    <Transition name="fade" mode="out-in">
      <div v-if="loading" class="glass-card flex flex-col items-center justify-center gap-4 p-12 text-slate-500">
        <Loader :size="72" />
        <p class="text-sm">Wir prüfen dein Unternehmensprofil …</p>
      </div>
      <div v-else-if="!company" class="glass-card space-y-4 p-10 text-center text-slate-600">
        <h1 class="text-2xl font-semibold text-slate-900">Kein Profil gefunden</h1>
        <p>
          Wir konnten deinem Login aktuell kein Unternehmensprofil zuordnen. Wende dich bitte an den Support, damit wir
          gemeinsam die nächsten Schritte besprechen können.
        </p>
        <a class="btn" href="mailto:partner@magikey.de">
          <i class="fa fa-envelope"></i>
          Support kontaktieren
        </a>
      </div>
      <div v-else class="space-y-10">
        <header class="glass-card space-y-6 p-8 sm:p-10">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="space-y-4">
              <p class="badge-neutral inline-flex items-center gap-2 text-sm text-amber-600">
                <i class="fa fa-shield-alt"></i>
                Sicherheitsprüfung läuft
              </p>
              <div class="space-y-3">
                <h1 class="text-3xl font-semibold text-slate-900">Wir machen dein Profil vertrauenswürdig</h1>
                <p class="text-base text-slate-600">
                  Damit Kund:innen auf Magikey nur geprüfte Schlüsseldienste finden, gleicht unser Team jede Anmeldung
                  manuell ab. Du bist jetzt in der Warteschlange zur Verifizierung. Sobald alle Angaben passen, schalten
                  wir dein Profil frei und informieren dich per E-Mail.
                </p>
              </div>
            </div>
            <div class="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-left text-sm text-amber-800 shadow-inner">
              <p class="font-semibold text-amber-900">Aktueller Status</p>
              <p class="mt-2 flex items-center gap-2">
                <span class="inline-flex h-3 w-3 animate-pulse rounded-full bg-amber-500"></span>
                {{ statusLabel }}
              </p>
              <p v-if="company.verification?.last_update" class="mt-3 text-xs text-amber-700">
                Letzte Aktualisierung am {{ formatDate(company.verification.last_update) }}
              </p>
            </div>
          </div>
        </header>

        <div class="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div class="glass-card space-y-6 p-8 sm:p-10">
            <h2 class="text-xl font-semibold text-slate-900">Was wir für dich prüfen</h2>
            <p class="text-sm text-slate-600">
              Unser Trust & Safety Team gleicht deine Angaben mit öffentlichen Quellen ab und ergänzt dein Profil um
              vertrauensbildende Informationen.
            </p>
            <dl class="grid gap-4 sm:grid-cols-2">
              <VerificationItem
                icon="fa-map-marker-alt"
                label="Google Unternehmensprofil"
                :value="company.verification?.google_place_url"
                placeholder="Wird von uns recherchiert"
              />
              <VerificationItem
                icon="fa-star"
                label="Übertragene Google-Rezensionen"
                :value="company.verification?.google_reviews_url"
                placeholder="Noch nicht zugeordnet"
              />
              <VerificationItem
                icon="fa-globe"
                label="Offizielle Website"
                :value="company.verification?.website_url"
                placeholder="Link wird hinterlegt"
              />
              <VerificationItem
                icon="fa-balance-scale"
                label="Preis-Einschätzung"
                :value="company.verification?.price_statement"
                placeholder="Wir gleichen deine Preisangaben ab"
              />
            </dl>
            <div class="rounded-3xl border border-emerald-200/80 bg-emerald-50/70 p-6 text-sm text-emerald-700 shadow-inner">
              <p class="font-semibold text-emerald-900">Transparente Zusammenarbeit</p>
              <p class="mt-2">
                Du kannst dich jederzeit bei uns melden, wenn sich Daten ändern oder du ergänzende Nachweise schicken
                möchtest. Wir aktualisieren dein Profil innerhalb eines Werktages.
              </p>
              <a class="mt-3 inline-flex items-center gap-2 text-emerald-700 underline decoration-emerald-400" href="mailto:partner@magikey.de">
                <i class="fa fa-lock"></i>
                Sicheren Upload anfordern
              </a>
            </div>
          </div>

          <aside class="space-y-6">
            <div class="glass-card space-y-4 p-7">
              <h2 class="text-lg font-semibold text-slate-900">Dein Ansprechpartner</h2>
              <p class="text-sm text-slate-600">
                Jede Prüfung wird von einem Mitglied unseres Trust-Teams begleitet. Du erhältst nach Abschluss eine
                Zusammenfassung mit allen hinterlegten Links.
              </p>
              <div class="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-inner">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                  <i class="fa fa-user-shield"></i>
                </div>
                <div class="space-y-1 text-sm">
                  <p class="font-semibold text-slate-800">{{ company.verification?.assigned_admin || 'Trust & Safety Team' }}</p>
                  <p class="text-slate-500">partner@magikey.de</p>
                </div>
              </div>
              <div class="space-y-2 text-sm text-slate-600">
                <p>
                  <i class="fa fa-check-circle text-emerald-500"></i>
                  Mitglied im Verband: <strong>{{ company.verification?.association_member ? 'Ja' : 'Wird geprüft' }}</strong>
                </p>
                <p>
                  <i class="fa fa-id-card text-gold"></i>
                  Registernummer: <strong>{{ company.verification?.register_number || 'wird ergänzt' }}</strong>
                </p>
              </div>
            </div>
            <div class="glass-card space-y-4 p-7 text-sm text-slate-600">
              <h2 class="text-lg font-semibold text-slate-900">Nächste Schritte</h2>
              <ol class="space-y-3">
                <li class="flex items-start gap-3">
                  <span class="rounded-full bg-gold/20 px-2 py-1 text-xs font-semibold text-gold">1</span>
                  <span>Wir verifizieren Adresse, Preise und Zugehörigkeiten.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="rounded-full bg-gold/20 px-2 py-1 text-xs font-semibold text-gold">2</span>
                  <span>Du erhältst eine Zusammenfassung mit allen angehängten Links.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="rounded-full bg-gold/20 px-2 py-1 text-xs font-semibold text-gold">3</span>
                  <span>Nach deiner Freigabe schalten wir das Profil live.</span>
                </li>
              </ol>
              <p class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs">
                Hinweis: Du kannst die Prüfung beschleunigen, indem du uns Handelsregisterauszug oder
                Verbandsbestätigungen zusendest. Wir speichern alle Nachweise verschlüsselt.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, isFirebaseConfigured } from '@/core/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import Loader from '@/ui/components/common/Loader.vue'
import VerificationItem from '@/ui/components/company/VerificationItem.vue'
import { ROUTE_LOCATIONS } from '@/core/constants/routes'

const router = useRouter()
const company = ref(null)
const loading = ref(true)

let unsubscribeAuth
let unsubscribeCompany

function cleanupCompanyListener() {
  if (typeof unsubscribeCompany === 'function') {
    unsubscribeCompany()
    unsubscribeCompany = null
  }
}

onMounted(() => {
  if (!isFirebaseConfigured) {
    loading.value = false
    company.value = null
    return
  }

  unsubscribeAuth = onAuthStateChanged(
    auth,
    (user) => {
      cleanupCompanyListener()
      if (!user) {
        company.value = null
        loading.value = false
        return
      }
      loading.value = true
      unsubscribeCompany = onSnapshot(
        doc(db, 'companies', user.uid),
        (snapshot) => {
          loading.value = false
          if (snapshot.exists()) {
            const data = { id: snapshot.id, ...snapshot.data() }
            company.value = data
            if (data.verified || data.verification?.status === 'verified') {
              router.replace(ROUTE_LOCATIONS.DASHBOARD)
            }
          } else {
            company.value = null
          }
        },
        () => {
          loading.value = false
          company.value = null
        }
      )
    },
    () => {
      loading.value = false
      company.value = null
    }
  )
})

onUnmounted(() => {
  cleanupCompanyListener()
  if (typeof unsubscribeAuth === 'function') {
    unsubscribeAuth()
  }
})

const statusLabel = computed(() => {
  const status = company.value?.verification?.status || 'pending'
  if (status === 'verified') return 'Freigabe erfolgt'
  if (status === 'rejected') return 'Profil benötigt Anpassungen'
  return 'Profil in Prüfung'
})

function formatDate(timestamp) {
  if (!timestamp) return ''
  try {
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.warn('Konnte Datum nicht formatieren', error)
    return ''
  }
}
</script>

<style scoped>
.badge-neutral {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 9999px;
  border: 1px solid rgba(251, 191, 36, 0.4);
  background: rgba(253, 230, 138, 0.4);
  padding: 0.45rem 0.9rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  header h1 {
    font-size: 1.75rem;
  }
}
</style>
