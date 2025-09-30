<template>
  <section class="page-wrapper">
    <div class="space-y-8">
      <header class="glass-card border border-emerald-100/70 bg-emerald-50/60 p-6 sm:p-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-2">
            <p class="badge-neutral inline-flex items-center gap-2 text-emerald-600">
              <i class="fa fa-shield-check text-lg"></i>
              Magikey Trust Center
            </p>
            <h1 class="text-2xl font-semibold text-slate-900">
              Unternehmen verifizieren & Vertrauensanker setzen
            </h1>
            <p class="text-sm text-slate-600">
              Prüfe neue Registrierungen, hinterlege die offiziellen Quellen und bestätige die Seriosität. Erst nach
              deiner Freigabe erscheint der Betrieb öffentlich.
            </p>
          </div>
          <div class="rounded-3xl border border-white/70 bg-white/80 px-5 py-4 text-center shadow-inner">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Wartende Prüfungen</p>
            <p class="text-3xl font-semibold text-emerald-600">{{ pendingCount }}</p>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[0.42fr,0.58fr] xl:grid-cols-[0.38fr,0.62fr]">
        <aside class="glass-card space-y-4 p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Prüffälle</h2>
            <button class="text-sm text-emerald-600 hover:underline" @click="loadCompanies" :disabled="loading">
              <i class="fa fa-rotate"></i>
              Aktualisieren
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-10">
            <Loader :size="56" />
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="companyItem in companies"
              :key="companyItem.id"
              class="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-inner transition hover:border-emerald-200"
            >
              <button
                class="flex w-full flex-col gap-2 text-left"
                :class="{
                  'outline outline-2 outline-emerald-400/70 shadow-lg': companyItem.id === selectedCompanyId,
                }"
                @click="selectCompany(companyItem.id)"
              >
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-base font-semibold text-slate-900">{{ companyItem.company_name }}</h3>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                    :class="statusBadgeClass(companyItem.verification_status, companyItem.verified)"
                  >
                    <i class="fa" :class="statusIcon(companyItem.verification_status, companyItem.verified)"></i>
                    {{ statusLabel(companyItem.verification_status, companyItem.verified) }}
                  </span>
                </div>
                <p class="text-xs text-slate-500">
                  {{ companyItem.city || '–' }} · registriert am
                  {{ formatDate(companyItem.created_at) }}
                </p>
              </button>
            </li>
          </ul>

          <p v-if="!loading && !companies.length" class="text-center text-sm text-slate-500">
            Aktuell warten keine Unternehmen auf eine Prüfung. Schau später wieder vorbei.
          </p>
        </aside>

        <div class="glass-card space-y-6 p-4 sm:p-6 lg:p-8" v-if="selectedCompany">
          <div class="space-y-3">
            <p class="badge-neutral inline-flex items-center gap-2 text-slate-600">
              <i class="fa fa-id-card"></i>
              Unternehmensakte
            </p>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 class="text-xl font-semibold text-slate-900">{{ selectedCompany.company_name }}</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  class="pill-checkbox text-xs"
                  :class="selectedCompany.association_member ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : ''"
                >
                  <i class="fa fa-handshake"></i>
                  Verband: {{ selectedCompany.association_member ? 'Mitglied' : 'kein Mitglied' }}
                </span>
                <span v-if="selectedCompany.security_badge" class="pill-checkbox text-xs">
                  <i class="fa fa-shield"></i>
                  {{ selectedCompany.security_badge }}
                </span>
              </div>
            </div>
            <p class="text-sm text-slate-600">
              {{ selectedCompany.description || 'Keine Beschreibung hinterlegt.' }}
            </p>
          </div>

          <form class="space-y-6" @submit.prevent="saveAdministrativeData">
            <div class="grid gap-4 md:grid-cols-2">
              <label class="space-y-2">
                <span class="label text-slate-700">Google-Unternehmensprofil</span>
                <input
                  v-model="form.google_place_url"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  class="water-input"
                  required
                />
                <span class="text-xs text-slate-500">
                  Verlinkung auf den offiziellen Google-Standort sorgt für zusätzliche Vertrauenssignale.
                </span>
              </label>

              <label class="space-y-2">
                <span class="label text-slate-700">Website des Unternehmens</span>
                <input
                  v-model="form.website_url"
                  type="url"
                  placeholder="https://"
                  class="water-input"
                  required
                />
                <span class="text-xs text-slate-500">Wir binden die geprüfte Website prominent im Profil ein.</span>
              </label>

              <label class="space-y-2 md:col-span-2">
                <span class="label text-slate-700">Preis-Kommentar</span>
                <textarea
                  v-model="form.price_comment"
                  class="water-textarea min-h-[100px]"
                  placeholder="Beschreibe transparent, wie sich die Preise zusammensetzen."
                ></textarea>
                <span class="text-xs text-slate-500">
                  Zeige klar, welche Leistungen enthalten sind (Anfahrt, Nachtzuschläge, Verbandsrabatte …).
                </span>
              </label>

              <label class="flex items-center gap-3">
                <input v-model="form.association_member" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-gold" />
                <span class="text-sm text-slate-600">Unternehmen ist Mitglied im Branchenverband</span>
              </label>

              <label class="space-y-2">
                <span class="label text-slate-700">Sicherheits-Siegel</span>
                <input
                  v-model="form.security_badge"
                  type="text"
                  class="water-input"
                  placeholder="z. B. Verband Deutscher Schlüsseldienste"
                />
              </label>

              <label class="space-y-2 md:col-span-2">
                <span class="label text-slate-700">Hinweis zur Bewertungsrichtlinie</span>
                <textarea
                  v-model="form.review_policy_note"
                  class="water-textarea min-h-[100px]"
                  placeholder="Erkläre, dass alle Rezensionen über Magikey eingeholt und überprüft werden."
                ></textarea>
              </label>

              <label class="space-y-2">
                <span class="label text-slate-700">Status</span>
                <select v-model="form.verification_status" class="water-input">
                  <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </label>

              <label class="space-y-2 md:col-span-2">
                <span class="label text-slate-700">Interne Notiz</span>
                <textarea
                  v-model="form.admin_notes"
                  class="water-textarea min-h-[90px]"
                  placeholder="Dokumentiere Gespräche, Nachweise oder Rückfragen."
                ></textarea>
              </label>
            </div>

            <div class="flex flex-wrap gap-3">
              <Button type="submit" :disabled="saving">
                <template v-if="saving">
                  Speichern…
                </template>
                <template v-else>
                  Vertrauensdaten sichern
                </template>
              </Button>
              <Button
                type="button"
                class="border-emerald-200 text-emerald-600 !bg-white hover:!bg-emerald-50"
                @click="verifySelectedCompany"
                :disabled="form.verification_status === 'verified' || verifying"
              >
                <template v-if="verifying">
                  Prüfe…
                </template>
                <template v-else>
                  Unternehmen verifizieren
                </template>
              </Button>
            </div>

            <p v-if="successMessage" class="text-sm font-medium text-emerald-600">
              <i class="fa fa-check-circle"></i>
              {{ successMessage }}
            </p>
            <p v-if="errorMessage" class="text-sm font-medium text-red-500">
              <i class="fa fa-exclamation-triangle"></i>
              {{ errorMessage }}
            </p>
          </form>
        </div>

        <div v-else class="glass-card flex items-center justify-center p-8 text-center text-slate-500">
          <div class="space-y-3">
            <i class="fa fa-user-shield text-4xl text-emerald-400"></i>
            <p>Wähle links ein Unternehmen, um die Vertrauensprüfung zu beginnen.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Button from '@/components/common/Button.vue'
import Loader from '@/components/common/Loader.vue'
import {
  getCompaniesForAdmin,
  updateCompanyAdmin,
} from '@/services/company'

const companies = ref([])
const loading = ref(true)
const saving = ref(false)
const verifying = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const selectedCompanyId = ref('')

const form = reactive({
  google_place_url: '',
  website_url: '',
  price_comment: '',
  association_member: false,
  security_badge: '',
  review_policy_note: '',
  verification_status: 'pending',
  admin_notes: '',
})

const statusOptions = [
  { value: 'pending', label: 'Prüfung ausstehend' },
  { value: 'on_hold', label: 'Unterlagen nachreichen' },
  { value: 'verified', label: 'Verifiziert' },
]

const pendingCount = computed(() =>
  companies.value.filter((company) => (company.verification_status || (company.verified ? 'verified' : 'pending')) !== 'verified')
    .length
)

const selectedCompany = computed(() =>
  companies.value.find((company) => company.id === selectedCompanyId.value) || null
)

watch(selectedCompany, (company) => {
  if (!company) return
  form.google_place_url = company.google_place_url || ''
  form.website_url = company.website_url || ''
  form.price_comment = company.price_comment || ''
  form.association_member = Boolean(company.association_member)
  form.security_badge = company.security_badge || ''
  form.review_policy_note = company.review_policy_note || ''
  form.verification_status = company.verification_status || (company.verified ? 'verified' : 'pending')
  form.admin_notes = company.admin_notes || ''
  successMessage.value = ''
  errorMessage.value = ''
})

function selectCompany(id) {
  selectedCompanyId.value = id
}

function statusLabel(status, verified) {
  const resolved = status || (verified ? 'verified' : 'pending')
  if (resolved === 'verified') return 'Verifiziert'
  if (resolved === 'on_hold') return 'Wartet auf Nachweise'
  return 'In Prüfung'
}

function statusBadgeClass(status, verified) {
  const resolved = status || (verified ? 'verified' : 'pending')
  if (resolved === 'verified') return 'border-emerald-200 bg-emerald-50 text-emerald-600'
  if (resolved === 'on_hold') return 'border-amber-200 bg-amber-50 text-amber-600'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

function statusIcon(status, verified) {
  const resolved = status || (verified ? 'verified' : 'pending')
  if (resolved === 'verified') return 'fa-check-circle'
  if (resolved === 'on_hold') return 'fa-hourglass-half'
  return 'fa-magnifying-glass'
}

function formatDate(dateLike) {
  if (!dateLike) return 'unbekannt'
  try {
    const date = typeof dateLike === 'string' ? new Date(dateLike) : dateLike.toDate?.() ?? new Date(dateLike)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (error) {
    console.warn('Konnte Datum nicht formatieren:', error)
    return 'unbekannt'
  }
}

async function loadCompanies() {
  loading.value = true
  try {
    companies.value = await getCompaniesForAdmin()
    if (!selectedCompanyId.value && companies.value.length) {
      selectedCompanyId.value = companies.value[0].id
    }
  } catch (error) {
    console.error('Fehler beim Laden der Firmenliste:', error)
    errorMessage.value = 'Daten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function saveAdministrativeData() {
  if (!selectedCompany.value) return
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const payload = {
      google_place_url: form.google_place_url,
      website_url: form.website_url,
      price_comment: form.price_comment,
      association_member: form.association_member,
      security_badge: form.security_badge,
      review_policy_note: form.review_policy_note,
      verification_status: form.verification_status,
      admin_notes: form.admin_notes,
      updated_at: new Date().toISOString(),
      verified: form.verification_status === 'verified',
      verified_at: form.verification_status === 'verified' ? new Date().toISOString() : null,
    }
    const updated = await updateCompanyAdmin(selectedCompany.value.id, payload)
    if (updated) {
      companies.value = companies.value.map((company) => (company.id === updated.id ? { ...company, ...updated } : company))
      successMessage.value = 'Vertrauensdaten erfolgreich gespeichert.'
    }
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    errorMessage.value = 'Speichern fehlgeschlagen. Bitte versuche es erneut.'
  } finally {
    saving.value = false
  }
}

async function verifySelectedCompany() {
  if (!selectedCompany.value) return
  verifying.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const payload = {
      verification_status: 'verified',
      verified: true,
      verified_at: new Date().toISOString(),
    }
    const updated = await updateCompanyAdmin(selectedCompany.value.id, payload)
    if (updated) {
      companies.value = companies.value.map((company) => (company.id === updated.id ? { ...company, ...updated } : company))
      form.verification_status = 'verified'
      successMessage.value = 'Unternehmen wurde erfolgreich verifiziert.'
    }
  } catch (error) {
    console.error('Verifizierung fehlgeschlagen:', error)
    errorMessage.value = 'Verifizierung nicht möglich. Prüfe die Angaben.'
  } finally {
    verifying.value = false
  }
}

onMounted(() => {
  loadCompanies()
})
</script>
