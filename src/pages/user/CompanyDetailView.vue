<!-- Diese Datei zeigt alle Details zu einer ausgewählten Firma. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-6xl space-y-8">
      <button @click="$router.back()" class="pill-checkbox text-sm">
        <i class="fa fa-arrow-left"></i>
        Zurück
      </button>

      <div class="glass-card p-8 sm:p-10">
        <div class="grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
          <div class="space-y-6">
            <div class="flex flex-col items-center gap-4 text-center">
              <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner">
                <img
                  :src="company.logo_url || '/logo.png'"
                  alt="Firmenlogo"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="space-y-2">
                <h1 class="section-heading text-3xl">{{ company.company_name || 'Unbekannt' }}</h1>
                <p class="section-subtitle">{{ fullAddress }}</p>
                <div class="flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
                  <span
                    class="badge-neutral"
                    :class="isOpen ? 'text-emerald-600 border-emerald-200' : 'text-slate-500'"
                  >
                    <i class="fa" :class="isOpen ? 'fa-door-open' : 'fa-clock'" />
                    {{ openStatus }}
                  </span>
                  <span v-if="company.is_247" class="pill-checkbox border-gold bg-gold/20 text-slate-900">
                    <i class="fa fa-moon"></i>
                    24/7 Notdienst
                  </span>
                  <span v-if="company.verified" class="pill-checkbox border-emerald-200 bg-emerald-50 text-emerald-600">
                    <i class="fa fa-check-circle"></i>
                    Verifiziert
                  </span>
                  <span
                    v-if="company.association_member"
                    class="pill-checkbox border-sky-200 bg-sky-50 text-sky-600"
                  >
                    <i class="fa fa-handshake"></i>
                    Verbandsmitglied
                  </span>
                  <span
                    v-if="company.security_badge"
                    class="pill-checkbox border-emerald-200 bg-emerald-50 text-emerald-600"
                  >
                    <i class="fa fa-shield-alt"></i>
                    {{ company.security_badge }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <DataRow label="Telefon" :value="company.phone || 'Keine Nummer'" />
              <DataRow label="Preis" :value="company.price ? `ab ${company.price} €` : 'auf Anfrage'" />
              <DataRow
                v-if="company.is_247 && company.emergency_price"
                label="Notdienstpreis"
                :value="`${company.emergency_price} €`"
              />
              <DataRow label="Website" :value="websiteLabel" />
              <DataRow label="Google-Profil" :value="googleLabel" />
              <DataRow label="Verband" :value="company.association_member ? 'Mitglied' : 'kein Mitglied'" />
            </div>

            <div class="space-y-4">
              <h2 class="text-lg font-semibold text-slate-900">Öffnungszeiten</h2>
              <div class="grid gap-2 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-inner">
                <div
                  v-for="day in days"
                  :key="day"
                  class="flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 px-4 py-2 text-sm"
                  :class="dayStatus(day)"
                >
                  <span class="font-medium text-slate-700">{{ dayLabel(day) }}</span>
                  <span class="text-slate-600">{{ formatTimeRange(company.opening_hours?.[day]) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h2 class="text-lg font-semibold text-slate-900">Beschreibung</h2>
              <p class="text-sm text-slate-600">{{ company.description || 'Keine Beschreibung' }}</p>
              <div
                v-if="company.price_comment"
                class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-700"
              >
                <p class="font-semibold">Preis-Transparenz</p>
                <p>{{ company.price_comment }}</p>
              </div>
              <div
                v-if="company.review_policy_note"
                class="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-sky-700"
              >
                <p class="font-semibold">Rezensionsrichtlinie</p>
                <p>{{ company.review_policy_note }}</p>
              </div>
            </div>

            <div v-if="lockTypes.length" class="space-y-3">
              <h2 class="text-lg font-semibold text-slate-900">Kompatible Schlösser</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(lt, idx) in lockTypes"
                  :key="idx"
                  class="pill-checkbox"
                >
                  <span class="text-lg">{{ lt.icon }}</span>
                  <span>{{ lt.label }}</span>
                </span>
              </div>
            </div>

            <div class="flex flex-wrap justify-center gap-4">
              <button
                v-if="company.phone"
                type="button"
                class="btn flex items-center gap-2"
                @click="openContactDialog('call')"
              >
                <i class="fa fa-phone"></i>
                Jetzt anrufen
              </button>
              <button
                v-if="company.email"
                type="button"
                class="pill-checkbox flex items-center gap-2 border-emerald-200 bg-emerald-50 text-emerald-700"
                @click="openContactDialog('message')"
              >
                <i class="fa fa-envelope"></i>
                Jetzt anschreiben
              </button>
              <a
                v-if="company.website_url"
                :href="company.website_url"
                target="_blank"
                rel="noopener"
                class="pill-checkbox flex items-center gap-2"
              >
                <i class="fa fa-globe"></i>
                Website besuchen
              </a>
            </div>
          </div>

          <div class="min-h-[18rem] overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner">
            <iframe
              class="h-full w-full"
              :src="mapUrl"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div class="mt-10 space-y-5">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Rezensionen über Magikey</h2>
            <span class="text-sm font-medium text-emerald-600">{{ ratingHeadline }}</span>
          </div>
          <div v-if="reviewsLoading" class="flex justify-center py-8">
            <Loader :size="64" />
          </div>
          <div
            v-else-if="!reviews.length"
            class="rounded-3xl border border-white/70 bg-white/70 p-6 text-center text-sm text-slate-600 shadow-inner"
          >
            <i class="fa fa-shield-check text-2xl text-emerald-500"></i>
            <p class="mt-2">
              Dieses Unternehmen sammelt Bewertungen ausschließlich über Magikey. Nach deiner Anfrage erhältst du automatisch
              einen geprüften Bewertungsbogen per E-Mail.
            </p>
          </div>
          <ul v-else class="space-y-4">
            <li
              v-for="review in reviews"
              :key="review.id"
              class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-inner"
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1 text-amber-500">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="fa"
                      :class="star <= review.rating ? 'fa-star' : 'fa-star text-amber-200'"
                    ></i>
                  </div>
                  <span class="text-sm font-medium text-slate-700">{{ review.rating }}/5</span>
                </div>
                <span class="text-xs text-slate-500">{{ formatReviewDate(review.created_at) }}</span>
              </div>
              <p class="text-sm text-slate-600">
                {{ review.comment || 'Keine zusätzlichen Angaben.' }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <Transition name="fade">
    <div
      v-if="showContactDialog"
      class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4 py-6"
    >
      <div class="w-full max-w-xl space-y-6 rounded-3xl border border-white/60 bg-white p-6 sm:p-8 shadow-2xl">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <p class="badge-neutral text-emerald-600">Sicherer Kontakt</p>
            <h3 class="text-xl font-semibold text-slate-900">{{ contactHeadline }}</h3>
            <p class="text-sm text-slate-600">{{ contactDescription }}</p>
          </div>
          <button type="button" class="pill-checkbox text-sm" @click="closeContactDialog">
            <i class="fa fa-times"></i>
            Schließen
          </button>
        </div>

        <div class="space-y-4">
          <label class="space-y-2">
            <span class="label text-slate-700">E-Mail-Adresse</span>
            <input
              v-model="customerEmail"
              type="email"
              class="water-input"
              placeholder="dein.name@mail.de"
              required
            />
          </label>

          <div v-if="!requestSent" class="flex flex-col gap-3 sm:flex-row">
            <Button class="flex-1" @click="submitReviewRequest" :disabled="sendingRequest">
              <template v-if="sendingRequest">
                <i class="fa fa-spinner fa-spin"></i>
                Prüfen…
              </template>
              <template v-else>
                Bewertungsbogen senden
              </template>
            </Button>
            <div class="flex-1 rounded-2xl border border-white/70 bg-white/70 p-4 text-xs text-slate-600">
              <p class="font-semibold text-slate-700">Warum dieser Schritt?</p>
              <p>
                Wir stellen sicher, dass nur echte Kund:innen eine Bewertung abgeben. Deine Adresse wird ausschließlich für
                diesen Vorgang verwendet.
              </p>
            </div>
          </div>

          <div
            v-else
            class="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-700"
          >
            <p class="font-semibold">
              <i class="fa fa-check-circle"></i>
              Bewertungsbogen versendet
            </p>
            <p>
              Du erhältst gleich eine E-Mail von Magikey. Du kannst den Fragebogen auch direkt hier öffnen:
              <router-link :to="requestLink" class="font-semibold underline">Rezension ausfüllen</router-link>.
            </p>
            <div class="flex flex-wrap gap-3 text-xs text-emerald-600">
              <a v-if="contactMode === 'call' && company.phone" :href="`tel:${company.phone}`" class="pill-checkbox">
                <i class="fa fa-phone"></i>
                {{ company.phone }} anrufen
              </a>
              <a v-if="contactMode === 'message' && company.email" :href="`mailto:${company.email}`" class="pill-checkbox">
                <i class="fa fa-envelope"></i>
                {{ company.email }} anschreiben
              </a>
            </div>
          </div>

          <p v-if="requestError" class="text-sm text-red-500">
            <i class="fa fa-circle-exclamation"></i>
            {{ requestError }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCompany } from '@/services/company'
import { createReviewRequest, getCompanyReviews } from '@/services/review'
import DataRow from '@/components/common/DataRow.vue'
import Loader from '@/components/common/Loader.vue'
import { LOCK_TYPE_LABELS, LOCK_TYPE_ICONS } from '@/constants/lockTypes'
import { DAYS, DAY_LABELS } from '@/constants/days'
import Button from '@/components/common/Button.vue'

const route = useRoute()
const companyId = route.params.id
const company = ref({})
const reviews = ref([])
const reviewsLoading = ref(true)
const days = DAYS

const showContactDialog = ref(false)
const contactMode = ref('call')
const customerEmail = ref('')
const sendingRequest = ref(false)
const requestSent = ref(false)
const requestError = ref('')
const requestLink = ref('')

onMounted(async () => {
  if (companyId) {
    try {
      const data = await getCompany(companyId)
      if (data) {
        company.value = data
        loadReviews()
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
    }
  }
})

watch(
  () => company.value.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadReviews()
    }
  }
)

const fullAddress = computed(() => {
  const parts = [company.value.address, company.value.postal_code, company.value.city].filter(Boolean)
  return parts.join(', ')
})
const mapUrl = computed(() => {
  if (company.value.google_place_url) {
    const hasQuery = company.value.google_place_url.includes('?')
    const hasOutput = company.value.google_place_url.includes('output=embed')
    return hasOutput
      ? company.value.google_place_url
      : `${company.value.google_place_url}${hasQuery ? '&' : '?'}output=embed`
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`
})

const now = new Date()
const currentMinutes = now.getHours() * 60 + now.getMinutes()

const isOpen = computed(() => {
  const day = days[now.getDay() - 1 < 0 ? 6 : now.getDay() - 1]
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return false

  const toMin = (t) => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1])
  return currentMinutes >= toMin(hours.open) && currentMinutes <= toMin(hours.close)
})

const openStatus = computed(() => {
  if (isOpen.value) return 'Jetzt geöffnet'
  if (company.value.is_247 && company.value.emergency_price) return `Notdienst verfügbar – ${company.value.emergency_price} €`
  return 'Derzeit geschlossen'
})

function dayStatus(day) {
  const hours = company.value.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return 'text-gray-500'
  return 'text-black'
}

function dayLabel(day) {
  return DAY_LABELS[day] || day
}

function formatTimeRange(range) {
  if (!range || !range.open || !range.close) return 'geschlossen'
  return `${range.open} – ${range.close}`
}

const lockTypes = computed(() =>
  (company.value.lock_types || []).map((t) => ({
    icon: LOCK_TYPE_ICONS[t] || '',
    label: LOCK_TYPE_LABELS[t] || t
  }))
)

const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((total, review) => total + (Number(review.rating) || 0), 0)
  return Math.round((sum / reviews.value.length) * 10) / 10
})

const ratingHeadline = computed(() => {
  if (!reviews.value.length) return 'Noch keine Bewertungen'
  return `${averageRating.value} / 5 · ${reviews.value.length} ${reviews.value.length === 1 ? 'Stimme' : 'Stimmen'}`
})

const contactHeadline = computed(() => (contactMode.value === 'call' ? 'Telefonischer Kontakt' : 'Schriftliche Anfrage'))

const contactDescription = computed(() =>
  contactMode.value === 'call'
    ? 'Teile uns kurz deine E-Mail-Adresse mit. Wir schicken dir direkt den geschützten Bewertungsbogen für diesen Auftrag.'
    : 'Hinterlasse deine E-Mail-Adresse – wir verbinden dich mit dem geprüften Unternehmen und senden gleichzeitig den Bewertungsbogen.'
)

const websiteLabel = computed(() => {
  if (!company.value.website_url) return 'Keine Website hinterlegt'
  return company.value.website_url.replace(/^https?:\/\//, '')
})

const googleLabel = computed(() => {
  if (!company.value.google_place_url) return 'Ohne Google-Referenz'
  const url = company.value.google_place_url.replace(/^https?:\/\//, '')
  return url.length > 45 ? `${url.slice(0, 42)}…` : url
})

function openContactDialog(mode) {
  contactMode.value = mode
  customerEmail.value = ''
  requestSent.value = false
  requestError.value = ''
  requestLink.value = ''
  showContactDialog.value = true
}

function closeContactDialog() {
  showContactDialog.value = false
}

async function submitReviewRequest() {
  if (!customerEmail.value) {
    requestError.value = 'Bitte gib eine gültige E-Mail-Adresse ein.'
    return
  }
  const targetCompanyId = company.value?.id || companyId
  if (!targetCompanyId) {
    requestError.value = 'Unternehmen konnte nicht gefunden werden.'
    return
  }

  sendingRequest.value = true
  requestError.value = ''
  try {
    const request = await createReviewRequest({
      companyId: targetCompanyId,
      companyName: company.value.company_name,
      customerEmail: customerEmail.value,
      channel: contactMode.value,
    })
    requestSent.value = true
    requestLink.value = `/review/${request.id}`
  } catch (error) {
    console.error('Bewertungsanforderung fehlgeschlagen:', error)
    requestError.value = error.message || 'Es ist ein Fehler aufgetreten.'
  } finally {
    sendingRequest.value = false
  }
}

async function loadReviews() {
  if (!companyId) return
  reviewsLoading.value = true
  try {
    reviews.value = await getCompanyReviews(companyId)
  } catch (error) {
    console.error('Rezensionen konnten nicht geladen werden:', error)
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

function formatReviewDate(dateLike) {
  if (!dateLike) return 'unbekannt'
  try {
    const date = typeof dateLike === 'string' ? new Date(dateLike) : dateLike.toDate?.() ?? new Date(dateLike)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (error) {
    console.warn('Rezensionsdatum konnte nicht formatiert werden:', error)
    return 'unbekannt'
  }
}
</script>
