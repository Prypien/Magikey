<!-- Diese Datei stellt die Startseite mit Firmenliste und Intro dar. -->
<template>
  <!-- Startseite mit Filterleiste und Firmenliste -->
  <div class="space-y-12">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 px-4 py-6 shadow-xl backdrop-blur sm:px-8 sm:py-8 lg:px-10 lg:py-10"
    >
      <div class="absolute -top-24 right-[-20%] hidden h-72 w-72 rounded-full bg-gold/30 blur-3xl sm:block"></div>
      <div class="absolute left-[-15%] top-8 hidden h-56 w-56 rounded-full bg-gold/20 blur-3xl md:block"></div>
      <div class="relative grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div class="hidden flex-col gap-8 lg:flex">
          <header class="space-y-5">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70">
              Schlüsseldienst-Finder
            </p>
            <h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {{ headline }}
            </h1>
            <p class="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Finde verifizierte Schlüsseldienste in deiner Nähe – transparent, fair und rund um die Uhr verfügbar.
              Magikey zeigt dir sofort passende Anbieter und hilft im Notfall mit einer direkten Empfehlung.
            </p>
            <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 sm:text-sm">
              <span class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                <i class="fa fa-shield-alt"></i>
                Sicherheit zuerst: geprüfte Unternehmensdaten
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-600">
                <i class="fa fa-user-check"></i>
                Nur bestätigte Anbieter werden gelistet
              </span>
            </div>
            <div class="flex flex-wrap gap-3">
              <button type="button" class="btn" data-testid="cta-customer-search" @click="focusSearchSection">
                <i class="fa fa-search-location"></i>
                Zur Suche
              </button>
              <button
                type="button"
                class="pill-checkbox"
                data-testid="cta-company-register-hero"
                @click="goToRegister"
              >
                <i class="fa fa-briefcase"></i>
                Unternehmen registrieren
              </button>
            </div>
          </header>

          <div v-if="activeBadges.length" class="flex flex-wrap gap-2">
            <span
              v-for="badge in activeBadges"
              :key="badge.key"
              class="group inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/80 px-3 py-1 text-xs font-medium text-gold shadow-sm backdrop-blur transition hover:border-gold/60"
            >
              <span>{{ badge.label }}</span>
              <button
                v-if="badge.clear"
                type="button"
                class="text-[11px] text-gold/70 transition group-hover:text-gold"
                @click="badge.clear()"
              >
                <span class="sr-only">Filter entfernen</span>
                ×
              </button>
            </span>
          </div>

          <dl v-if="!loading" class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-transparent bg-white/90 p-4 shadow-sm">
              <dt class="text-xs uppercase tracking-wide text-slate-500">Anbieter gefunden</dt>
              <dd class="mt-2 text-2xl font-semibold text-slate-900">
                {{ filteredCompanies.length }}
              </dd>
              <p class="mt-1 text-xs text-slate-500">passend zu deiner Auswahl</p>
            </div>
            <div class="rounded-2xl border border-transparent bg-white/90 p-4 shadow-sm">
              <dt class="text-xs uppercase tracking-wide text-slate-500">Filter aktiv</dt>
              <dd class="mt-2 text-2xl font-semibold text-slate-900">
                {{ activeBadges.length }}
              </dd>
              <p class="mt-1 text-xs text-slate-500">
                {{ activeBadges.length ? 'angepasste Kriterien' : 'alle Anbieter im Überblick' }}
              </p>
            </div>
            <div class="rounded-2xl border border-transparent bg-white/90 p-4 shadow-sm">
              <dt class="text-xs uppercase tracking-wide text-slate-500">Letzte Aktualisierung</dt>
              <dd class="mt-2 text-2xl font-semibold text-slate-900">
                {{ lastUpdated }}
              </dd>
              <p class="mt-1 text-xs text-slate-500">automatisch synchronisiert</p>
            </div>
          </dl>
        </div>

        <aside class="flex flex-col gap-4">
          <div class="rounded-2xl border border-red-100 bg-white/90 p-5 shadow-sm sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
              Notfallmodus
            </p>
            <h2 class="mt-3 text-xl font-semibold text-slate-900">Soforthilfe bei zugefallenen Türen</h2>
            <p class="mt-2 text-sm text-slate-600">
              Wir empfehlen dir den aktuell bestbewerteten 24/7-Dienst aus deiner Suche. Ein Klick bringt dich direkt
              zum Unternehmensprofil.
            </p>
            <p v-if="emergencyCompany" class="mt-4 text-sm font-medium text-slate-700">
              Empfohlen: {{ emergencyCompany.company_name }}<span v-if="emergencyRating">
                · {{ emergencyRating.toFixed(1) }} / 5 ⭐
              </span>
            </p>
            <p v-else class="mt-4 text-sm text-slate-500">
              Wir suchen passende Notdienste für dich …
            </p>
            <button
              type="button"
              class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
              :disabled="!emergencyCompany"
              @click="requestEmergencyHelp"
            >
              <i class="fa fa-bell" aria-hidden="true"></i>
              Notdienst jetzt kontaktieren
            </button>
          </div>

          <div class="hidden rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm lg:block">
            <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              <i class="fa fa-building"></i>
              Für Unternehmen
            </p>
            <h3 class="mt-3 text-lg font-semibold text-slate-900">Werde Teil von Magikey</h3>
            <p class="mt-2 text-sm text-slate-600">
              Registriere deinen Schlüsseldienst, lade Nachweise hoch und erscheine nach der Verifizierung in der Suche.
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              <button type="button" class="btn" data-testid="cta-company-register" @click="goToRegister">
                <i class="fa fa-key"></i>
                Jetzt registrieren
              </button>
              <button
                type="button"
                class="pill-checkbox"
                data-testid="cta-company-login"
                @click="goToLogin"
              >
                <i class="fa fa-sign-in-alt"></i>
                Bereits Partner? Login
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section ref="resultsSection" class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">Suchergebnisse</h2>
          <p class="text-sm text-slate-500">
            Live aktualisiert basierend auf deinen Filtern.
          </p>
        </div>
        <span
          v-if="!loading"
          class="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-600 shadow-sm"
        >
          {{ filteredCompanies.length }} Anbieter
        </span>
      </div>

      <div class="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur sm:p-6">
        <div v-if="loading" class="flex flex-col items-center gap-3 py-10 text-slate-500">
          <Loader :size="72" />
          <p>Wir sammeln die besten Anbieter für dich…</p>
        </div>
        <template v-else>
          <div
            v-if="filteredCompanies.length === 0"
            class="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-slate-200 bg-white/90 p-8 text-center text-slate-500"
          >
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">
              <i class="fa fa-magic"></i>
            </div>
            <div class="space-y-2">
              <p class="text-base font-semibold text-slate-700">Noch kein Treffer</p>
              <p class="max-w-md text-sm text-slate-500">
                Sag uns kurz Bescheid und wir informieren dich, sobald neue Schlüsseldienste verfügbar sind.
              </p>
            </div>
            <NotifyForm class="w-full max-w-md text-left" />
          </div>
          <SearchResults v-else :companies="filteredCompanies" />
        </template>
      </div>
    </section>

    
  </div>
  <transition name="modal">
    <div
      v-if="showIntro"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeIntro"
    >
      <IntroPopup @close="closeIntro" @help="goToSupport" />
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onBeforeUnmount, defineAsyncComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchResults from '@/ui/components/user/SearchResults.vue'
import Loader from '@/ui/components/common/Loader.vue'
import IntroPopup from '@/ui/components/user/IntroPopup.vue'
import { filters, clearFilter } from '@/core/stores/filters'
import { useCompanyStore } from '@/core/stores/company'
import { LOCK_TYPE_LABELS } from '@/core/constants/lockTypes'
import { detectCurrentLocation } from '@/core/services/location'
import { hasLockType } from '@/core/utils/lockTypes'
import { parseEuroAmount } from '@/core/utils/price'
import { extractRating } from '@/core/utils/reviews'

const NotifyForm = defineAsyncComponent(() => import('@/ui/components/user/NotifyForm.vue'))

const router = useRouter()
const { loading, fetchCompanies, filteredCompanies } = useCompanyStore()
const showIntro = ref(false)
let exitIntentBound = false
let exitIntentTriggered = false
const INTRO_KEY = 'introShown'
const euroFormatter = new Intl.NumberFormat('de-DE')
const lastUpdatedAt = ref(null)
const resultsSection = ref(null)

const emergencyCandidate = computed(() => {
  const companies = filteredCompanies.value || []
  if (!companies.length) return null

  function getComparablePrice(company) {
    const emergencyPrice = parseEuroAmount(company?.emergency_price)
    if (Number.isFinite(emergencyPrice) && emergencyPrice > 0) {
      return emergencyPrice
    }

    const basePrice = parseEuroAmount(company?.price)
    if (Number.isFinite(basePrice) && basePrice >= 0) {
      return basePrice
    }

    return Number.POSITIVE_INFINITY
  }

  const supportsHouseLock = (company) => hasLockType(company?.lock_types, 'house')

  const relevantCompanies = companies.filter(supportsHouseLock)
  if (!relevantCompanies.length) return null

  const ranked = relevantCompanies
    .map((company) => ({
      company,
      rating: extractRating(company),
      is247: company?.is_247 ? 1 : 0,
      comparablePrice: getComparablePrice(company),
    }))
    .sort((a, b) => {
      const ratingA = a.rating ?? -1
      const ratingB = b.rating ?? -1
      if (ratingA !== ratingB) return ratingB - ratingA

      if (a.is247 !== b.is247) return b.is247 - a.is247

      if (a.comparablePrice !== b.comparablePrice) {
        return a.comparablePrice - b.comparablePrice
      }

      const nameA = a.company?.company_name || ''
      const nameB = b.company?.company_name || ''
      return nameA.localeCompare(nameB, 'de')
    })

  return ranked[0]
})

const emergencyCompany = computed(() => emergencyCandidate.value?.company ?? null)
const emergencyRating = computed(() => emergencyCandidate.value?.rating ?? null)

const headline = computed(() => {
  let text = 'Finde deinen Schlüsseldienst'

  if (filters.location) {
    text = `Schlüsseldienste in ${filters.location}`
  } else if (filters.lockTypes.length) {
    const labels = filters.lockTypes
      .map((t) => LOCK_TYPE_LABELS[t] || t)
      .slice(0, 2)
      .join(', ')
    text = `Expert:innen für ${labels}`
    if (filters.lockTypes.length > 2) text += ' & mehr'
  }

  if (filters.openNow) {
    text += filters.location ? ' – jetzt geöffnet' : ' – jetzt geöffnet'
  }

  if (filters.price[1] < 1000) {
    text += ` bis ${euroFormatter.format(filters.price[1])} €`
  }

  return text
})

const activeBadges = computed(() => {
  const badges = []

  if (filters.location) {
    badges.push({
      key: 'location',
      label: filters.locationMeta?.label || `PLZ ${filters.location}`,
      clear: () => clearFilter('location')
    })
  }

  if (filters.openNow) {
    badges.push({
      key: 'openNow',
      label: 'Jetzt geöffnet',
      clear: () => clearFilter('openNow')
    })
  }

  const priceActive = filters.price[0] !== 0 || filters.price[1] !== 1000
  if (priceActive) {
    badges.push({
      key: 'price',
      label: `Preis ${euroFormatter.format(filters.price[0])}€ – ${euroFormatter.format(filters.price[1])}€`,
      clear: () => clearFilter('price')
    })
  }

  if (filters.lockTypes.length) {
    const labels = filters.lockTypes.map((t) => LOCK_TYPE_LABELS[t] || t)
    const preview = labels.slice(0, 2).join(', ')
    const remaining = labels.length - 2
    const label = remaining > 0 ? `${preview} +${remaining}` : preview
    badges.push({
      key: 'lockTypes',
      label,
      clear: () => clearFilter('lockTypes')
    })
  }

  return badges
})

const lastUpdated = computed(() => {
  if (!lastUpdatedAt.value) return 'Gerade eben'

  const diffMinutes = Math.floor((Date.now() - lastUpdatedAt.value.getTime()) / 60000)
  if (diffMinutes <= 0) return 'Gerade eben'
  if (diffMinutes < 60) return `${diffMinutes} Min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} Std`

  return lastUpdatedAt.value.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit'
  })
})

// Versucht, den Standort automatisch zu setzen
async function useLocation() {
  if (filters.location) return
  try {
    const location = await detectCurrentLocation({ enableHighAccuracy: true, timeout: 12000 })
    if (location?.label) {
      filters.location = location.label
      filters.locationMeta = location
    }
  } catch (err) {
    console.error('Geolocation fehlgeschlagen', err)
  }
}

// Daten initial laden
onMounted(async () => {
  setupExitIntent()
  useLocation()
  await fetchCompanies()
  lastUpdatedAt.value = new Date()
})

function closeIntro() {
  showIntro.value = false
  teardownExitIntent()
  rememberExitIntent()
}

function goToSupport() {
  closeIntro()
  router.push({ name: 'support' })
}

function requestEmergencyHelp() {
  const candidate = emergencyCompany.value
  if (!candidate) return

  if (candidate.id) {
    router.push({ name: 'details', params: { id: candidate.id } })
  }
}

function scrollToSection(section) {
  if (typeof window === 'undefined') return
  const sectionEl = section?.value
  if (sectionEl?.scrollIntoView) {
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function focusSearchSection() {
  scrollToSection(resultsSection)
}

function goToRegister() {
  router.push({ name: 'register' })
}

function goToLogin() {
  router.push({ name: 'login' })
}

function setupExitIntent() {
  if (typeof window === 'undefined' || exitIntentBound || hasSeenExitIntent()) {
    return
  }

  document.addEventListener('mouseleave', handleExitIntent)
  exitIntentBound = true
}

function teardownExitIntent() {
  if (!exitIntentBound) return
  document.removeEventListener('mouseleave', handleExitIntent)
  exitIntentBound = false
}

function handleExitIntent(event) {
  if (exitIntentTriggered || hasSeenExitIntent()) return
  if (event.clientY > 0) return

  exitIntentTriggered = true
  teardownExitIntent()
  showIntro.value = true
}

onBeforeUnmount(() => {
  teardownExitIntent()
})

function hasSeenExitIntent() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage.getItem(INTRO_KEY))
}

function rememberExitIntent() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(INTRO_KEY, '1')
}
</script>
