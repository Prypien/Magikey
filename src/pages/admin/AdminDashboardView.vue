<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-6xl space-y-8">
      <header class="glass-card space-y-4 p-8 sm:p-10">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-2">
            <p class="badge-neutral inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <i class="fa fa-user-shield"></i>
              Adminbereich
            </p>
            <h1 class="text-3xl font-semibold text-slate-900">Trust &amp; Safety Cockpit</h1>
            <p class="text-sm text-slate-600">
              Prüfe neue Unternehmen, ergänze verifizierende Informationen und gib Profile für die Suche frei. Jede
              Aktion wird im Firestore protokolliert.
            </p>
          </div>
          <div class="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-700 shadow-inner">
            <p class="font-semibold text-emerald-900">Live-Überblick</p>
            <p class="mt-2 flex items-center gap-2">
              <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              {{ pendingCount }} Profile in Prüfung
            </p>
            <p class="mt-1 text-xs text-emerald-600">Aktualisiert {{ lastRefreshLabel }}</p>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
        <aside class="glass-card space-y-5 p-6 sm:p-8">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Unternehmen</h2>
            <button type="button" class="pill-checkbox text-xs" @click="loadCompanies" :disabled="loading">
              <i class="fa fa-sync"></i>
              Aktualisieren
            </button>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              class="filter-chip"
              :class="{ active: filter === 'pending' }"
              @click="filter = 'pending'"
            >
              <i class="fa fa-hourglass-half"></i>
              In Prüfung
            </button>
            <button
              type="button"
              class="filter-chip"
              :class="{ active: filter === 'verified' }"
              @click="filter = 'verified'"
            >
              <i class="fa fa-check-circle"></i>
              Verifiziert
            </button>
            <button
              type="button"
              class="filter-chip"
              :class="{ active: filter === 'all' }"
              @click="filter = 'all'"
            >
              <i class="fa fa-list"></i>
              Alle
            </button>
          </div>

          <div v-if="loading" class="flex items-center justify-center py-10">
            <Loader :size="48" />
          </div>
          <ul v-else class="space-y-2">
            <li v-if="!filteredCompanies.length" class="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
              Keine Unternehmen im ausgewählten Filter.
            </li>
            <li
              v-for="companyItem in filteredCompanies"
              :key="companyItem.id"
              class="company-item"
              :class="{ active: companyItem.id === selectedId }"
            >
              <button type="button" class="w-full text-left" @click="selectCompany(companyItem.id)">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 space-y-1">
                    <p class="truncate text-sm font-semibold text-slate-800">{{ companyItem.company_name }}</p>
                    <p class="truncate text-xs text-slate-500">{{ companyItem.city }} · {{ companyItem.postal_code }}</p>
                  </div>
                  <span
                    class="status-pill"
                    :class="companyItem.verified ? 'status-pill--verified' : 'status-pill--pending'"
                  >
                    <i class="fa" :class="companyItem.verified ? 'fa-check' : 'fa-hourglass-half'"></i>
                    {{ companyItem.verified ? 'Live' : 'On Hold' }}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </aside>

        <div class="glass-card min-h-[28rem] p-6 sm:p-10">
          <div v-if="!currentCompany" class="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-500">
            <i class="fa fa-user-lock text-3xl"></i>
            <p class="max-w-sm text-sm">Wähle links ein Unternehmen aus, um die Verifizierungsdaten zu ergänzen.</p>
          </div>

          <div v-else class="space-y-6">
            <div class="flex flex-col gap-3 border-b border-white/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">{{ currentCompany.company_name }}</h2>
                <p class="text-sm text-slate-500">{{ currentCompany.address }}, {{ currentCompany.postal_code }} {{ currentCompany.city }}</p>
              </div>
              <span class="status-pill" :class="verificationStatusClass">
                <i class="fa" :class="currentCompany.verified ? 'fa-shield-check' : 'fa-shield-alt'"></i>
                {{ verificationStatusLabel }}
              </span>
            </div>

            <form class="space-y-8" @submit.prevent="saveVerification('in_review')">
              <section class="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account &amp; Basisdaten</h3>
                  <span class="text-xs text-slate-400">UID: {{ currentCompany.id }}</span>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="form-field">
                    <span>Firmenname</span>
                    <input v-model="form.company_name" type="text" placeholder="Schlüsseldienst Müller" />
                  </label>
                  <label class="form-field">
                    <span>Login E-Mail</span>
                    <input v-model="form.email" type="email" placeholder="beispiel@firma.de" />
                  </label>
                  <label class="form-field">
                    <span>Telefonnummer</span>
                    <input v-model="form.phone" type="tel" placeholder="z. B. 0151 12345678" />
                  </label>
                  <label class="form-field">
                    <span>WhatsApp</span>
                    <input v-model="form.whatsapp" type="tel" placeholder="z. B. +49 151 987654321" />
                  </label>
                </div>
                <div class="grid gap-4 md:grid-cols-3">
                  <label class="form-field md:col-span-2">
                    <span>Straße &amp; Hausnummer</span>
                    <input v-model="form.address" type="text" placeholder="Musterstraße 1" />
                  </label>
                  <label class="form-field">
                    <span>PLZ</span>
                    <input v-model="form.postal_code" type="text" placeholder="12345" />
                  </label>
                  <label class="form-field">
                    <span>Ort</span>
                    <input v-model="form.city" type="text" placeholder="Berlin" />
                  </label>
                </div>
                <div class="grid gap-4 md:grid-cols-3">
                  <label class="form-field">
                    <span>Preis (ab)</span>
                    <input v-model="form.price" type="number" min="0" step="1" placeholder="69" />
                  </label>
                  <label class="form-field">
                    <span>Notdienstpreis</span>
                    <input
                      v-model="form.emergency_price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="149"
                      :disabled="!form.is_247"
                    />
                  </label>
                  <label class="form-checkbox">
                    <input v-model="form.is_247" type="checkbox" />
                    <span>24/7 Notdienst</span>
                  </label>
                </div>
                <label class="form-field">
                  <span>Beschreibung</span>
                  <textarea v-model="form.description" rows="3" placeholder="Kurzbeschreibung des Angebots"></textarea>
                </label>
                <div class="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p
                        class="font-semibold"
                        :class="form.email_verified ? 'text-emerald-600' : 'text-amber-600'"
                      >
                        {{ emailVerificationLabel }}
                      </p>
                      <p v-if="!form.email_verified" class="text-xs text-slate-500">
                        Markiere die E-Mail als bestätigt, sobald du sie erfolgreich geprüft hast.
                      </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="btn-secondary"
                        :disabled="saving || form.email_verified"
                        @click="markEmailVerified"
                      >
                        <i class="fa fa-envelope-open"></i>
                        Als verifiziert markieren
                      </button>
                      <button
                        v-if="form.email_verified"
                        type="button"
                        class="btn-outline"
                        :disabled="saving"
                        @click="resetEmailVerification"
                      >
                        <i class="fa fa-undo"></i>
                        Status zurücksetzen
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section class="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-6">
                <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Leistungen &amp; Zeiten</h3>
                <div class="space-y-3">
                  <p class="text-sm font-medium text-slate-600">Schlosstypen</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="option in lockTypeOptions"
                      :key="option.value"
                      type="button"
                      class="pill-checkbox px-4 py-2 text-xs sm:text-sm"
                      :class="{ 'border-gold bg-gold/25 text-slate-900 shadow': form.lock_types.includes(option.value) }"
                      @click="toggleLockType(option.value)"
                    >
                      <span>{{ option.label }}</span>
                    </button>
                  </div>
                  <p v-if="!form.lock_types.length" class="text-xs text-slate-500">
                    Es wurden noch keine Schlosstypen ausgewählt.
                  </p>
                  <div v-else class="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span v-for="type in form.lock_types" :key="type" class="rounded-full bg-slate-100 px-3 py-1">
                      {{ lockTypeLabel(type) }}
                    </span>
                  </div>
                </div>
                <div class="space-y-3">
                  <p class="text-sm font-medium text-slate-600">Öffnungszeiten</p>
                  <OpeningHoursForm v-model="form.opening_hours" />
                </div>
              </section>

              <section class="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-6">
                <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Verifizierungsinformationen</h3>
                <div class="grid gap-5 md:grid-cols-2">
                  <label class="form-field">
                    <span>Google Unternehmensprofil</span>
                    <input v-model="form.google_place_url" type="url" placeholder="https://maps.google.com/..." />
                  </label>
                  <label class="form-field">
                    <span>Google Rezensionen</span>
                    <input v-model="form.google_reviews_url" type="url" placeholder="https://maps.google.com/..." />
                  </label>
                  <label class="form-field">
                    <span>Offizielle Website</span>
                    <input v-model="form.website_url" type="url" placeholder="https://" />
                  </label>
                  <label class="form-field">
                    <span>Preis-Einschätzung</span>
                    <input v-model="form.price_statement" type="text" placeholder="z. B. Preise telefonisch bestätigt" />
                  </label>
                  <label class="form-field">
                    <span>Register-/Verbandsnummer</span>
                    <input v-model="form.register_number" type="text" placeholder="HRB / Verbandsnummer" />
                  </label>
                  <label class="form-checkbox">
                    <input v-model="form.association_member" type="checkbox" />
                    <span>Unternehmen ist im Verband gelistet</span>
                  </label>
                </div>

                <label class="form-field">
                  <span>Interne Notizen</span>
                  <textarea v-model="form.admin_notes" rows="4" placeholder="Hinweise für das Trust-Team"></textarea>
                </label>

                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="form-field">
                    <span>Ansprechpartner:in Trust-Team</span>
                    <input v-model="form.assigned_admin" type="text" placeholder="z. B. Max Mustermann" />
                  </label>
                  <label class="form-field">
                    <span>Kontakt E-Mail</span>
                    <input v-model="form.contact_email" type="email" placeholder="kontakt@unternehmen.de" />
                  </label>
                </div>
              </section>

              <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p class="flex items-center gap-2">
                  <i class="fa fa-info-circle text-gold"></i>
                  Speichere deine Änderungen oder gib das Unternehmen direkt frei.
                </p>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <button type="submit" class="btn-secondary" :disabled="saving">
                    <i class="fa fa-save"></i>
                    Zwischenspeichern
                  </button>
                  <button type="button" class="btn" :disabled="saving" @click="saveVerification('verified')">
                    <i class="fa fa-check"></i>
                    Unternehmen verifizieren
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { db, isFirebaseConfigured } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import Loader from '@/components/common/Loader.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'
import { LOCK_TYPE_OPTIONS } from '@/constants/lockTypes'

const companies = ref([])
const loading = ref(true)
const saving = ref(false)
const filter = ref('pending')
const selectedId = ref('')
const lastRefresh = ref(null)
const lockTypeOptions = LOCK_TYPE_OPTIONS

const form = reactive({
  // Account & Basisdaten
  company_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  postal_code: '',
  city: '',
  price: '',
  emergency_price: '',
  is_247: false,
  description: '',
  lock_types: [],
  opening_hours: {},
  email_verified: false,
  email_verified_at: null,
  contact_email: '',
  // Verifizierungsdaten
  google_place_url: '',
  google_reviews_url: '',
  website_url: '',
  price_statement: '',
  association_member: false,
  register_number: '',
  assigned_admin: '',
  admin_notes: '',
})

async function loadCompanies() {
  if (!isFirebaseConfigured || !db) {
    loading.value = false
    companies.value = []
    return
  }
  loading.value = true
  try {
    const q = query(collection(db, 'companies'), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    companies.value = snap.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .filter((company) => !company.is_admin)
    lastRefresh.value = new Date()
    if (companies.value.length && !companies.value.find((c) => c.id === selectedId.value)) {
      selectedId.value = companies.value[0].id
      hydrateForm()
    } else {
      hydrateForm()
    }
  } catch (error) {
    console.error('Unternehmen konnten nicht geladen werden:', error)
  } finally {
    loading.value = false
  }
}

function hydrateForm() {
  const current = currentCompany.value
  if (!current) return
  const verification = current.verification || {}
  form.company_name = current.company_name || ''
  form.email = current.email || ''
  form.phone = current.phone || ''
  form.whatsapp = current.whatsapp || ''
  form.address = current.address || ''
  form.postal_code = current.postal_code || ''
  form.city = current.city || ''
  form.price = current.price ?? ''
  form.emergency_price = current.emergency_price ?? ''
  form.is_247 = Boolean(current.is_247)
  form.description = current.description || ''
  form.lock_types = Array.isArray(current.lock_types) ? [...current.lock_types] : []
  form.opening_hours = current.opening_hours ? { ...current.opening_hours } : {}
  form.email_verified = Boolean(current.email_verified)
  form.email_verified_at = normalizeTimestamp(current.email_verified_at)
  form.google_place_url = verification.google_place_url || ''
  form.google_reviews_url = verification.google_reviews_url || ''
  form.website_url = verification.website_url || ''
  form.price_statement = verification.price_statement || ''
  form.association_member = Boolean(verification.association_member)
  form.register_number = verification.register_number || ''
  form.assigned_admin = verification.assigned_admin || ''
  form.admin_notes = verification.admin_notes || ''
  form.contact_email = current.contact_email || ''
}

function selectCompany(id) {
  selectedId.value = id
  hydrateForm()
}

const filteredCompanies = computed(() => {
  if (filter.value === 'all') return companies.value
  if (filter.value === 'verified') return companies.value.filter((company) => company.verified)
  return companies.value.filter((company) => !company.verified)
})

const currentCompany = computed(() => companies.value.find((company) => company.id === selectedId.value) || null)

const verificationStatusLabel = computed(() => {
  if (!currentCompany.value) return 'Status unbekannt'
  const status = currentCompany.value.verification?.status
  if (status === 'verified') return 'Freigegeben'
  if (status === 'in_review') return 'In Bearbeitung'
  if (status === 'rejected') return 'Änderung erforderlich'
  return 'Wartet auf Prüfung'
})

const verificationStatusClass = computed(() => {
  if (!currentCompany.value) return ''
  return currentCompany.value.verified ? 'status-pill--verified' : 'status-pill--pending'
})

const pendingCount = computed(() => companies.value.filter((company) => !company.verified).length)

const lastRefreshLabel = computed(() => {
  if (!lastRefresh.value) return 'gerade'
  return lastRefresh.value.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
})

const emailVerificationLabel = computed(() => {
  if (!currentCompany.value) return ''
  if (!form.email_verified) return 'E-Mail noch nicht bestätigt'
  if (!form.email_verified_at) return 'E-Mail verifiziert'
  return `E-Mail verifiziert am ${formatDate(form.email_verified_at)}`
})

function formatDate(date) {
  const value = normalizeTimestamp(date)
  if (!value) return ''
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function normalizeTimestamp(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value.toDate === 'function') {
    try {
      return value.toDate()
    } catch (error) {
      console.warn('Konnte Timestamp nicht konvertieren', error)
    }
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function toggleLockType(option) {
  if (!Array.isArray(form.lock_types)) {
    form.lock_types = []
  }
  if (form.lock_types.includes(option)) {
    form.lock_types = form.lock_types.filter((item) => item !== option)
  } else {
    form.lock_types = [...form.lock_types, option]
  }
}

function lockTypeLabel(value) {
  const option = lockTypeOptions.find((opt) => opt.value === value)
  return option ? option.label : value
}

async function saveVerification(status, options = {}) {
  if (!currentCompany.value) return
  if (!isFirebaseConfigured || !db) {
    alert('Firebase ist nicht konfiguriert. Änderungen können nicht gespeichert werden.')
    return
  }
  saving.value = true
  try {
    const docRef = doc(db, 'companies', currentCompany.value.id)
    const targetStatus = options.keepStatus
      ? currentCompany.value.verification?.status || 'pending'
      : status
    const lockTypes = Array.isArray(form.lock_types) ? [...form.lock_types] : []
    const openingHours = form.opening_hours && typeof form.opening_hours === 'object'
      ? { ...form.opening_hours }
      : {}
    const emailVerifiedAtValue = form.email_verified
      ? normalizeTimestamp(form.email_verified_at) || new Date()
      : null
    await updateDoc(docRef, {
      verification: {
        ...(currentCompany.value.verification || {}),
        google_place_url: form.google_place_url,
        google_reviews_url: form.google_reviews_url,
        website_url: form.website_url,
        price_statement: form.price_statement,
        association_member: form.association_member,
        register_number: form.register_number,
        assigned_admin: form.assigned_admin,
        admin_notes: form.admin_notes,
        status: targetStatus,
        last_update: serverTimestamp(),
      },
      company_name: form.company_name || '',
      email: form.email || '',
      phone: form.phone || '',
      whatsapp: form.whatsapp || '',
      address: form.address || '',
      postal_code: form.postal_code || '',
      city: form.city || '',
      price: form.price || '',
      emergency_price: form.is_247 ? form.emergency_price || '' : '',
      is_247: Boolean(form.is_247),
      description: form.description || '',
      lock_types: lockTypes,
      opening_hours: openingHours,
      email_verified: Boolean(form.email_verified),
      email_verified_at: emailVerifiedAtValue,
      contact_email: form.contact_email || '',
      verified: targetStatus === 'verified',
    })
    await loadCompanies()
  } catch (error) {
    console.error('Verifizierung konnte nicht gespeichert werden:', error)
    alert('Speichern fehlgeschlagen. Bitte erneut versuchen.')
  } finally {
    saving.value = false
  }
}

async function markEmailVerified() {
  if (!currentCompany.value) return
  form.email_verified = true
  form.email_verified_at = new Date()
  await saveVerification(currentCompany.value.verification?.status || 'pending', { keepStatus: true })
}

async function resetEmailVerification() {
  if (!currentCompany.value) return
  form.email_verified = false
  form.email_verified_at = null
  await saveVerification(currentCompany.value.verification?.status || 'pending', { keepStatus: true })
}

loadCompanies()
</script>

<style scoped>
.badge-neutral {
  display: inline-flex;
  border-radius: 9999px;
  border: 1px solid rgba(16, 185, 129, 0.4);
  background: rgba(209, 250, 229, 0.6);
  padding: 0.4rem 0.9rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 9999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.6);
  padding: 0.35rem 0.9rem;
  font-weight: 600;
  color: rgb(100, 116, 139);
}

.filter-chip.active {
  border-color: rgba(248, 191, 64, 0.6);
  background: rgba(254, 243, 199, 0.9);
  color: #b45309;
}

.company-item {
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.7);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.company-item button {
  padding: 1rem 1.2rem;
}

.company-item:hover,
.company-item.active {
  border-color: rgba(248, 191, 64, 0.7);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-pill--verified {
  background: rgba(16, 185, 129, 0.12);
  color: rgb(22, 101, 52);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.status-pill--pending {
  background: rgba(251, 191, 36, 0.15);
  color: rgb(180, 83, 9);
  border: 1px solid rgba(251, 191, 36, 0.45);
}

.form-field {
  display: grid;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: rgb(51, 65, 85);
}

.form-field input,
.form-field textarea {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
  color: rgb(30, 41, 59);
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: rgba(248, 191, 64, 0.8);
  box-shadow: 0 0 0 4px rgba(248, 191, 64, 0.15);
}

.form-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  color: rgb(51, 65, 85);
}

.form-checkbox input {
  width: 1rem;
  height: 1rem;
  border-radius: 0.4rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 0.6rem 1.4rem;
  font-weight: 700;
  color: rgb(30, 41, 59);
  box-shadow: 0 12px 20px rgba(251, 191, 36, 0.35);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  color: rgb(30, 41, 59);
  background: rgba(148, 163, 184, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .btn,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 640px) {
  header h1 {
    font-size: 2rem;
  }
}
</style>
