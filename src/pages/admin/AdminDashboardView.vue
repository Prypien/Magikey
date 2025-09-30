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

            <form class="space-y-5" @submit.prevent="saveVerification('in_review')">
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

const companies = ref([])
const loading = ref(true)
const saving = ref(false)
const filter = ref('pending')
const selectedId = ref('')
const lastRefresh = ref(null)

const form = reactive({
  google_place_url: '',
  google_reviews_url: '',
  website_url: '',
  price_statement: '',
  association_member: false,
  register_number: '',
  assigned_admin: '',
  admin_notes: '',
  contact_email: '',
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
    companies.value = snap.docs.map((document) => ({ id: document.id, ...document.data() }))
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

async function saveVerification(status) {
  if (!currentCompany.value) return
  if (!isFirebaseConfigured || !db) {
    alert('Firebase ist nicht konfiguriert. Änderungen können nicht gespeichert werden.')
    return
  }
  saving.value = true
  try {
    const docRef = doc(db, 'companies', currentCompany.value.id)
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
        status,
        last_update: serverTimestamp(),
      },
      contact_email: form.contact_email || '',
      verified: status === 'verified',
    })
    await loadCompanies()
  } catch (error) {
    console.error('Verifizierung konnte nicht gespeichert werden:', error)
    alert('Speichern fehlgeschlagen. Bitte erneut versuchen.')
  } finally {
    saving.value = false
  }
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
