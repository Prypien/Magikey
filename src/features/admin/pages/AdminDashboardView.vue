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

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article class="summary-card summary-card--pending">
          <div class="summary-card__label">
            <i class="fa fa-hourglass-half"></i>
            Ausstehende Profile
          </div>
          <p class="summary-card__value">{{ pendingCount }}</p>
          <p class="summary-card__hint">Warten auf Freigabe</p>
        </article>
        <article class="summary-card summary-card--review">
          <div class="summary-card__label">
            <i class="fa fa-tasks"></i>
            In Bearbeitung
          </div>
          <p class="summary-card__value">{{ inReviewCount }}</p>
          <p class="summary-card__hint">Aktive Prüfungen</p>
        </article>
        <article class="summary-card summary-card--verified">
          <div class="summary-card__label">
            <i class="fa fa-shield-check"></i>
            Verifizierte Profile
          </div>
          <p class="summary-card__value">{{ verifiedCount }}</p>
          <p class="summary-card__hint">Live in der Suche</p>
        </article>
        <article class="summary-card summary-card--total">
          <div class="summary-card__label">
            <i class="fa fa-database"></i>
            Gesamtbestand
          </div>
          <p class="summary-card__value">{{ totalCount }}</p>
          <p class="summary-card__hint">Aktualisiert {{ lastRefreshLabel }}</p>
        </article>
      </div>

      <div class="dashboard-grid flex flex-col gap-6 lg:grid lg:grid-cols-[360px,1fr] lg:gap-8">
        <aside class="dashboard-sidebar glass-card space-y-6 p-6 sm:p-8">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">Unternehmen</h2>
            <button type="button" class="pill-checkbox text-xs" @click="loadCompanies" :disabled="loading">
              <i class="fa fa-sync"></i>
              Aktualisieren
            </button>
          </div>

          <div class="space-y-3">
            <label class="search-field">
              <i class="fa fa-search"></i>
              <input v-model="searchTerm" type="search" placeholder="Suchen nach Name, Ort oder PLZ" />
            </label>
            <div class="flex flex-wrap gap-2 text-xs text-slate-500">
              <button type="button" class="filter-chip" :class="{ active: filter === 'pending' }" @click="filter = 'pending'">
                <i class="fa fa-hourglass-half"></i>
                In Prüfung
              </button>
              <button type="button" class="filter-chip" :class="{ active: filter === 'verified' }" @click="filter = 'verified'">
                <i class="fa fa-check-circle"></i>
                Verifiziert
              </button>
              <button type="button" class="filter-chip" :class="{ active: filter === 'all' }" @click="filter = 'all'">
                <i class="fa fa-list"></i>
                Alle
              </button>
            </div>
          </div>

          <div v-if="loading" class="flex items-center justify-center py-10">
            <Loader :size="48" />
          </div>
          <ul v-else class="dashboard-company-list space-y-2">
            <li v-if="!filteredCompanies.length" class="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
              Keine Unternehmen im ausgewählten Filter.
            </li>
            <li
              v-for="companyItem in filteredCompanies"
              :key="companyItem.id"
              class="company-item"
            >
              <button type="button" class="w-full text-left" @click="openCompany(companyItem.id)">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 space-y-1">
                    <p class="truncate text-sm font-semibold text-slate-800">{{ companyItem.company_name }}</p>
                    <p class="truncate text-xs text-slate-500">
                      {{ companyItem.city }} · {{ companyItem.postal_code }}
                    </p>
                  </div>
                  <span class="status-pill" :class="companyItem.verified ? 'status-pill--verified' : 'status-pill--pending'">
                    <i class="fa" :class="companyItem.verified ? 'fa-check' : 'fa-hourglass-half'"></i>
                    {{ companyItem.verified ? 'Live' : 'On Hold' }}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </aside>

        <div class="space-y-6">
          <section class="glass-card space-y-4 p-6 sm:p-8">
            <h2 class="text-lg font-semibold text-slate-900">Verifizierung starten</h2>
            <p class="text-sm text-slate-600">
              Wähle links ein Unternehmen aus, um Details zu prüfen, Nachweise zu dokumentieren und den Status zu
              ändern. Du wirst zur Detailseite des Unternehmens weitergeleitet.
            </p>
            <p class="text-xs text-slate-500">
              Tipp: Nutze die Filter und die Suche, um schnell Unternehmen nach Stadt, Postleitzahl oder Status zu
              finden.
            </p>
          </section>

          <section class="glass-card space-y-5 p-6 sm:p-8">
            <div class="space-y-2">
              <h2 class="text-lg font-semibold text-slate-900">Account &amp; Daten löschen</h2>
              <p class="text-sm text-slate-600">
                Entferne alle Daten eines Unternehmens dauerhaft anhand der Login-E-Mail-Adresse. Die Löschung umfasst
                Firmenprofil, Nutzerkonto und verknüpfte Datensätze.
              </p>
            </div>
            <form class="space-y-4" @submit.prevent="handleDelete">
              <label class="form-field">
                <span>E-Mail-Adresse</span>
                <input v-model="deleteEmail" type="email" placeholder="unternehmen@example.com" />
              </label>
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-slate-500">
                  Aktion erfordert Adminrechte und kann nicht rückgängig gemacht werden.
                </p>
                <button type="submit" class="btn-danger" :disabled="deleting">
                  <i class="fa fa-user-slash"></i>
                  Daten unwiderruflich löschen
                </button>
              </div>
            </form>
            <p v-if="deleteFeedback" :class="['text-sm', deleteFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-600']">
              {{ deleteFeedback.message }}
            </p>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Loader from '@/ui/components/common/Loader.vue'
import { db, isFirebaseConfigured } from '@/core/firebase'
import { ROUTE_NAMES } from '@/core/constants/routes'
import { deleteUserDataByEmail } from '@/core/services/admin'

const router = useRouter()
const companies = ref([])
const loading = ref(true)
const filter = ref('pending')
const searchTerm = ref('')
const lastRefresh = ref(null)
const deleteEmail = ref('')
const deleting = ref(false)
const deleteFeedback = ref(null)

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
  } catch (error) {
    console.error('Unternehmen konnten nicht geladen werden:', error)
  } finally {
    loading.value = false
  }
}

function openCompany(id) {
  router.push({ name: ROUTE_NAMES.ADMIN_COMPANY_DETAIL, params: { companyId: id } })
}

const filteredCompanies = computed(() => {
  let list = [...companies.value]

  if (filter.value === 'verified') {
    list = list.filter((company) => company.verified)
  } else if (filter.value === 'pending') {
    list = list.filter((company) => !company.verified)
  }

  const term = searchTerm.value.trim().toLowerCase()
  if (term) {
    list = list.filter((company) => {
      const values = [company.company_name, company.city, company.postal_code, company.email]
      return values.some((value) => String(value || '').toLowerCase().includes(term))
    })
  }

  return list
})

const pendingCount = computed(() => companies.value.filter((company) => !company.verified).length)
const inReviewCount = computed(
  () =>
    companies.value.filter(
      (company) => company.verification?.status === 'in_review' && !company.verified,
    ).length,
)
const verifiedCount = computed(() => companies.value.filter((company) => company.verified).length)
const totalCount = computed(() => companies.value.length)

const lastRefreshLabel = computed(() => {
  if (!lastRefresh.value) return 'gerade'
  return lastRefresh.value.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
})

function normaliseErrorMessage(error) {
  const fallback = 'Konnte Daten nicht löschen. Bitte erneut versuchen.'
  if (!error) return fallback
  const details = typeof error.details === 'string' ? error.details.trim() : ''
  if (details) return details
  const message = typeof error.message === 'string' ? error.message.replace(/^functions\.httpsCallable\(.*?\):\s*/, '').trim() : ''
  if (message) return message
  return fallback
}

async function handleDelete() {
  deleteFeedback.value = null
  const email = deleteEmail.value.trim()
  if (!email) {
    deleteFeedback.value = { type: 'error', message: 'Bitte gib eine E-Mail-Adresse ein.' }
    return
  }

  deleting.value = true
  try {
    const result = await deleteUserDataByEmail(email)
    const deleted = result?.deletedDocuments ?? 0
    deleteFeedback.value = {
      type: 'success',
      message: `Alle Daten wurden gelöscht. (${deleted} Einträge entfernt)`,
    }
    deleteEmail.value = ''
    await loadCompanies()
  } catch (error) {
    deleteFeedback.value = { type: 'error', message: normaliseErrorMessage(error) }
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
.dashboard-grid {
  align-items: flex-start;
}

.dashboard-sidebar {
  position: sticky;
  top: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow: auto;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 0.5rem 1.2rem;
  background: rgba(248, 250, 252, 0.7);
  color: #475569;
}

.search-field input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.35rem 0.9rem;
  color: #64748b;
  background: rgba(248, 250, 252, 0.6);
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: rgba(248, 191, 64, 0.6);
  color: #b45309;
}

.filter-chip.active {
  border-color: rgba(248, 191, 64, 0.9);
  color: #92400e;
  background: rgba(248, 191, 64, 0.22);
  box-shadow: 0 12px 28px rgba(248, 191, 64, 0.18);
}

.dashboard-company-list {
  max-height: 24rem;
  overflow: auto;
}

.company-item {
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.75);
  transition: all 0.2s ease;
}

.company-item button {
  padding: 0.9rem 1.1rem;
}

.company-item:hover {
  border-color: rgba(248, 191, 64, 0.7);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
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

.summary-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: rgba(255, 255, 255, 0.9);
  padding: 1.25rem;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.summary-card__label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-card__hint {
  font-size: 0.75rem;
  color: #64748b;
}

.summary-card--pending {
  border-color: rgba(251, 191, 36, 0.35);
}

.summary-card--review {
  border-color: rgba(59, 130, 246, 0.25);
}

.summary-card--verified {
  border-color: rgba(16, 185, 129, 0.25);
}

.summary-card--total {
  border-color: rgba(148, 163, 184, 0.35);
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.55rem 1.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #dc2626, #b91c1c);
  box-shadow: 0 14px 30px rgba(220, 38, 38, 0.25);
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-danger:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(220, 38, 38, 0.3);
}
</style>
