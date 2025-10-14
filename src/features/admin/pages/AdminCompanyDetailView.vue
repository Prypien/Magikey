<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-6xl space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Unternehmensdetails</h1>
          <p v-if="company" class="text-xs text-slate-500">UID: {{ company.id }}</p>
        </div>
        <RouterLink :to="{ name: ROUTE_NAMES.ADMIN_DASHBOARD }" class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <i class="fa fa-arrow-left"></i>
          Zur Übersicht
        </RouterLink>
      </header>

      <div class="glass-card min-h-[28rem] p-6 sm:p-10">
        <div v-if="loading" class="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-500">
          <Loader :size="48" />
          <p class="text-sm">Lade Unternehmensdaten ...</p>
        </div>

        <div v-else-if="!company" class="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-500">
          <i class="fa fa-user-times text-3xl"></i>
          <p class="max-w-sm text-sm">Das angeforderte Unternehmen wurde nicht gefunden oder bereits gelöscht.</p>
          <RouterLink :to="{ name: ROUTE_NAMES.ADMIN_DASHBOARD }" class="btn-secondary inline-flex items-center gap-2">
            <i class="fa fa-arrow-left"></i>
            Zurück zur Übersicht
          </RouterLink>
        </div>

        <div v-else class="space-y-8">
          <div class="dashboard-content__header">
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ausgewähltes Unternehmen</p>
              <h2 class="text-2xl font-semibold text-slate-900">{{ company.company_name }}</h2>
              <div class="flex flex-wrap gap-2 text-xs text-slate-500">
                <span class="info-chip">
                  <i class="fa fa-map-marker-alt"></i>
                  {{ company.address }}
                </span>
                <span class="info-chip">
                  <i class="fa fa-city"></i>
                  {{ company.postal_code }} {{ company.city }}
                </span>
                <span class="info-chip" v-if="company.phone">
                  <i class="fa fa-phone"></i>
                  {{ company.phone }}
                </span>
              </div>
            </div>
            <div class="dashboard-status">
              <span class="status-pill" :class="verificationStatusClass">
                <i class="fa" :class="company.verified ? 'fa-shield-check' : 'fa-shield-alt'"></i>
                {{ verificationStatusLabel }}
              </span>
              <p class="dashboard-status__hint">Letzte Änderung: {{ verificationLastUpdate }}</p>
            </div>
          </div>

          <form class="space-y-8" @submit.prevent="saveVerification('in_review')">
            <nav class="dashboard-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                class="dashboard-tabs__button"
                :class="{ 'dashboard-tabs__button--active': activeTab === 'verification' }"
                @click="activeTab = 'verification'"
              >
                <i class="fa fa-clipboard-check"></i>
                Prüfungsdaten
              </button>
              <button
                type="button"
                role="tab"
                class="dashboard-tabs__button"
                :class="{ 'dashboard-tabs__button--active': activeTab === 'basics' }"
                @click="activeTab = 'basics'"
              >
                <i class="fa fa-id-card"></i>
                Basisdaten
              </button>
            </nav>

            <div class="space-y-8" v-show="activeTab === 'verification'">
              <section class="detail-card space-y-5">
                <h3 class="section-label">Verifizierungs-Checkliste</h3>
                <p class="text-sm text-slate-600">
                  Konzentriere dich auf diese Schritte, um das Profil für die Veröffentlichung vorzubereiten.
                </p>
                <ul class="verification-checklist">
                  <li
                    v-for="item in verificationChecklist"
                    :key="item.id"
                    class="verification-checklist__item"
                    :class="{ 'verification-checklist__item--done': item.complete }"
                  >
                    <i class="fa" :class="item.complete ? 'fa-check-circle' : 'fa-circle'" aria-hidden="true"></i>
                    <div>
                      <p class="font-medium text-slate-800">{{ item.label }}</p>
                      <p v-if="item.helper" class="text-xs text-slate-500">{{ item.helper }}</p>
                    </div>
                  </li>
                </ul>
              </section>

              <section class="detail-card space-y-5">
                <h3 class="section-label">Verifizierungsinformationen</h3>
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
                    <input v-model="form.website_url" type="url" placeholder="https://..." />
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

                <div class="grid gap-4 md:grid-cols-2">
                  <label class="form-field">
                    <span>Ansprechpartner:in Trust-Team</span>
                    <input v-model="form.assigned_admin" type="text" placeholder="z. B. Max Mustermann" />
                  </label>
                  <label class="form-field md:col-span-2">
                    <span>Interne Notizen</span>
                    <textarea v-model="form.admin_notes" rows="4" placeholder="Hinweise für das Trust-Team"></textarea>
                  </label>
                </div>
              </section>

              <section class="detail-card space-y-5">
                <h3 class="section-label">Beschreibung &amp; Kommunikation</h3>
                <label class="form-field">
                  <span>Beschreibung</span>
                  <textarea v-model="form.description" rows="3" placeholder="Kurzbeschreibung des Angebots"></textarea>
                </label>
                <div class="verification-callout">
                  <div class="space-y-2">
                    <p class="font-semibold" :class="form.email_verified ? 'text-emerald-600' : 'text-amber-600'">
                      {{ emailVerificationLabel }}
                    </p>
                    <p v-if="!form.email_verified" class="text-xs text-slate-500">
                      Markiere die E-Mail als bestätigt, sobald du sie erfolgreich geprüft hast.
                    </p>
                    <p v-if="resendSuccess" class="flex items-center gap-1 text-xs text-emerald-600">
                      <i class="fa fa-check-circle"></i>
                      Einladung erneut ausgelöst.
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
                    <button
                      type="button"
                      class="btn-outline"
                      :disabled="resending || !primaryContactEmail"
                      @click="resendRegistrationEmail"
                    >
                      <i class="fa fa-paper-plane"></i>
                      Registrierungsmail erneut senden
                    </button>
                  </div>
                </div>
              </section>

              <section class="detail-card space-y-5">
                <h3 class="section-label">Leistungen &amp; Zeiten</h3>
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
            </div>

            <div class="space-y-8" v-show="activeTab === 'basics'">
              <section class="detail-card space-y-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 class="section-label">Account &amp; Kommunikation</h3>
                  <span class="text-xs text-slate-400">UID: {{ company.id }}</span>
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
                  <label class="form-field md:col-span-2">
                    <span>Kontakt E-Mail</span>
                    <input v-model="form.contact_email" type="email" placeholder="kontakt@unternehmen.de" />
                  </label>
                </div>
              </section>

              <section class="detail-card space-y-5">
                <h3 class="section-label">Standort &amp; Preise</h3>
                <div class="grid gap-4">
                  <label class="form-field">
                    <span>Straße &amp; Hausnummer</span>
                    <input v-model="form.address" type="text" placeholder="Musterstraße 1" />
                  </label>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="form-field">
                      <span>PLZ</span>
                      <input v-model="form.postal_code" type="text" placeholder="12345" />
                    </label>
                    <label class="form-field">
                      <span>Ort</span>
                      <input v-model="form.city" type="text" placeholder="Berlin" />
                    </label>
                  </div>
                  <div class="price-grid">
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
                </div>
              </section>
            </div>

            <div class="action-bar">
              <p class="flex items-center gap-2 text-sm text-slate-600">
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
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import Loader from '@/ui/components/common/Loader.vue'
import OpeningHoursForm from '@/ui/components/company/OpeningHoursForm.vue'
import { LOCK_TYPE_OPTIONS } from '@/core/constants/lockTypes'
import { requestRegistrationEmail } from '@/core/services/admin'
import { ROUTE_NAMES } from '@/core/constants/routes'
import { db, isFirebaseConfigured } from '@/core/firebase'

const route = useRoute()
const companyId = computed(() => String(route.params.companyId || ''))

const company = ref(null)
const loading = ref(true)
const saving = ref(false)
const lockTypeOptions = LOCK_TYPE_OPTIONS
const activeTab = ref('verification')
const resending = ref(false)
const resendSuccess = ref(false)
const hydrating = ref(false)

function createEmptyForm() {
  return {
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
    google_place_url: '',
    google_reviews_url: '',
    website_url: '',
    price_statement: '',
    association_member: false,
    register_number: '',
    assigned_admin: '',
    admin_notes: '',
  }
}

const form = reactive(createEmptyForm())

function resetForm() {
  Object.assign(form, createEmptyForm())
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

function hydrateForm() {
  const current = company.value
  if (!current) return
  hydrating.value = true
  const verification = current.verification || {}
  try {
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
  } finally {
    hydrating.value = false
  }
}

async function loadCompany() {
  if (!companyId.value || !isFirebaseConfigured || !db) {
    company.value = null
    loading.value = false
    resetForm()
    return
  }

  loading.value = true
  try {
    const snap = await getDoc(doc(db, 'companies', companyId.value))
    company.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
    if (company.value) {
      hydrateForm()
    } else {
      resetForm()
    }
    resendSuccess.value = false
    resending.value = false
    activeTab.value = 'verification'
  } catch (error) {
    console.error('Unternehmen konnte nicht geladen werden:', error)
    company.value = null
    resetForm()
  } finally {
    loading.value = false
  }
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

const verificationStatusLabel = computed(() => {
  if (!company.value) return 'Status unbekannt'
  const status = company.value.verification?.status
  if (status === 'verified') return 'Freigegeben'
  if (status === 'in_review') return 'In Bearbeitung'
  if (status === 'rejected') return 'Änderung erforderlich'
  return 'Wartet auf Prüfung'
})

const verificationStatusClass = computed(() => {
  if (!company.value) return ''
  return company.value.verified ? 'status-pill--verified' : 'status-pill--pending'
})

const verificationLastUpdate = computed(() => {
  if (!company.value) return '–'
  const lastUpdate =
    company.value.verification?.last_update || company.value.updated_at || company.value.created_at
  const normalized = normalizeTimestamp(lastUpdate)
  return normalized ? formatDate(normalized) : 'Noch keine Änderungen'
})

const emailVerificationLabel = computed(() => {
  if (!company.value) return ''
  if (!form.email_verified) return 'E-Mail noch nicht bestätigt'
  if (!form.email_verified_at) return 'E-Mail verifiziert'
  return `E-Mail verifiziert am ${formatDate(form.email_verified_at)}`
})

const primaryContactEmail = computed(() => {
  const trimmedFormEmail = typeof form.email === 'string' ? form.email.trim() : ''
  if (trimmedFormEmail) return trimmedFormEmail

  const trimmedContactEmail = typeof form.contact_email === 'string' ? form.contact_email.trim() : ''
  if (trimmedContactEmail) return trimmedContactEmail

  const current = company.value
  const currentEmail = typeof current?.email === 'string' ? current.email.trim() : ''
  if (currentEmail) return currentEmail

  const currentContactEmail = typeof current?.contact_email === 'string' ? current.contact_email.trim() : ''
  if (currentContactEmail) return currentContactEmail

  return ''
})

const verificationChecklist = computed(() => {
  const items = []

  items.push({
    id: 'email_verification',
    label: 'Kontaktadresse bestätigt',
    complete: Boolean(form.email_verified),
    helper: form.email_verified
      ? form.email_verified_at
        ? `Verifiziert am ${formatDate(form.email_verified_at)}`
        : 'E-Mail als verifiziert markiert'
      : primaryContactEmail.value
      ? `Zu prüfen: ${primaryContactEmail.value}`
      : 'Keine Kontaktadresse hinterlegt',
  })

  items.push({
    id: 'google_profile',
    label: 'Google Unternehmensprofil',
    complete: Boolean(form.google_place_url),
    helper: form.google_place_url ? '' : 'Link zum Google-Profil ergänzen',
  })

  items.push({
    id: 'website',
    label: 'Website geprüft',
    complete: Boolean(form.website_url),
    helper: form.website_url ? '' : 'Website-Adresse ergänzen',
  })

  const hasPriceInfo = Boolean(form.price_statement || form.price || form.emergency_price)
  items.push({
    id: 'pricing',
    label: 'Preisangaben dokumentiert',
    complete: hasPriceInfo,
    helper: hasPriceInfo ? '' : 'Preis oder Einschätzung ergänzen',
  })

  const hasServices = Array.isArray(form.lock_types) && form.lock_types.length > 0
  items.push({
    id: 'services',
    label: 'Leistungsumfang gepflegt',
    complete: hasServices,
    helper: hasServices ? '' : 'Schlosstypen auswählen',
  })

  items.push({
    id: 'notes',
    label: 'Interne Notizen hinterlegt',
    complete: Boolean(form.admin_notes),
    helper: form.admin_notes ? '' : 'Kurzes Prüfprotokoll ergänzen',
  })

  return items
})

async function saveVerification(status, options = {}) {
  if (!company.value) return
  if (!isFirebaseConfigured || !db) {
    alert('Firebase ist nicht konfiguriert. Änderungen können nicht gespeichert werden.')
    return
  }
  saving.value = true
  try {
    const docRef = doc(db, 'companies', company.value.id)
    const targetStatus = options.keepStatus ? company.value.verification?.status || 'pending' : status
    const lockTypes = Array.isArray(form.lock_types) ? [...form.lock_types] : []
    const openingHours = form.opening_hours && typeof form.opening_hours === 'object' ? { ...form.opening_hours } : {}
    const emailVerifiedAtValue = form.email_verified
      ? normalizeTimestamp(form.email_verified_at) || new Date()
      : null
    const sanitizedEmail = typeof form.email === 'string' ? form.email.trim() : ''
    const sanitizedContactEmail = typeof form.contact_email === 'string' ? form.contact_email.trim() : ''
    form.email = sanitizedEmail
    form.contact_email = sanitizedContactEmail

    await updateDoc(docRef, {
      verification: {
        ...(company.value.verification || {}),
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
      email: sanitizedEmail,
      email_lowercase: sanitizedEmail ? sanitizedEmail.toLowerCase() : '',
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
      contact_email: sanitizedContactEmail,
      verified: targetStatus === 'verified',
    })
    await loadCompany()
  } catch (error) {
    console.error('Verifizierung konnte nicht gespeichert werden:', error)
    alert('Speichern fehlgeschlagen. Bitte erneut versuchen.')
  } finally {
    saving.value = false
  }
}

async function markEmailVerified() {
  if (!company.value) return
  form.email_verified = true
  form.email_verified_at = new Date()
  await saveVerification(company.value.verification?.status || 'pending', { keepStatus: true })
}

async function resetEmailVerification() {
  if (!company.value) return
  form.email_verified = false
  form.email_verified_at = null
  await saveVerification(company.value.verification?.status || 'pending', { keepStatus: true })
}

async function resendRegistrationEmail() {
  if (!company.value) return
  const email = primaryContactEmail.value
  if (!email) {
    alert('Es ist keine E-Mail-Adresse hinterlegt, an die die Registrierungsmail gesendet werden kann.')
    return
  }
  if (!isFirebaseConfigured || !db) {
    alert('Firebase ist nicht konfiguriert. Registrierungsmail kann nicht gesendet werden.')
    return
  }
  resending.value = true
  resendSuccess.value = false
  try {
    await requestRegistrationEmail({
      companyId: company.value.id,
      companyName: company.value.company_name || '',
      email,
      triggeredBy: 'admin-company-detail',
    })
    resendSuccess.value = true
  } catch (error) {
    console.error('Registrierungsmail konnte nicht gesendet werden:', error)
    alert('Registrierungsmail konnte nicht gesendet werden. Bitte erneut versuchen.')
  } finally {
    resending.value = false
  }
}

watch(
  () => form.email,
  (value, previous) => {
    if (hydrating.value) return
    const nextNormalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
    const prevNormalized = typeof previous === 'string' ? previous.trim().toLowerCase() : ''
    if (nextNormalized === prevNormalized) return
    form.email_verified = false
    form.email_verified_at = null
  },
)

watch(companyId, () => {
  loadCompany()
})

onMounted(() => {
  loadCompany()
})
</script>

<style scoped>
.dashboard-content__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .dashboard-content__header {
    flex-direction: row;
    align-items: flex-start;
  }
}

.dashboard-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  text-align: right;
}

.dashboard-status__hint {
  font-size: 0.75rem;
  color: #94a3b8;
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

.info-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
  color: #475569;
  padding: 0.35rem 0.85rem;
}

.dashboard-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.4rem;
  background: rgba(15, 23, 42, 0.04);
}

.dashboard-tabs__button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  transition: all 0.2s ease;
}

.dashboard-tabs__button:hover {
  color: #1f2937;
  background: rgba(255, 255, 255, 0.8);
}

.dashboard-tabs__button--active {
  border-color: rgba(251, 191, 36, 0.6);
  background: rgba(251, 191, 36, 0.18);
  color: #b45309;
  box-shadow: 0 10px 20px rgba(251, 191, 36, 0.22);
}

.detail-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.section-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
}

.verification-checklist {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.verification-checklist__item {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(248, 250, 252, 0.6);
  padding: 0.75rem 0.95rem;
  font-size: 0.85rem;
  color: #475569;
}

.verification-checklist__item i {
  margin-top: 0.1rem;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.9);
}

.verification-checklist__item--done {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.12);
  color: rgb(22, 101, 52);
}

.verification-callout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(248, 250, 252, 0.75);
  padding: 1.25rem;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.55rem 1.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline:not(:disabled):hover {
  color: #1f2937;
  border-color: rgba(248, 191, 64, 0.6);
}

.price-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.action-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
}

@media (min-width: 640px) {
  .action-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
