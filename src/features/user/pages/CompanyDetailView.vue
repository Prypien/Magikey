<!-- Diese Datei zeigt alle Details zu einer ausgewählten Firma. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-6xl space-y-8">
      <button @click="$router.back()" class="pill-checkbox text-sm">
        <i class="fa fa-arrow-left"></i>
        Zurück
      </button>

      <div v-if="company" class="glass-card p-8 sm:p-10">
        <div class="relative">
          <div
            class="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)] xl:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)] lg:items-start"
          >
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
                  </div>
                </div>

                <div v-if="hasContactOptions" class="flex flex-wrap justify-center gap-3 text-sm">
                  <button
                    v-if="phoneLink"
                    type="button"
                    class="btn flex items-center gap-2"
                    @click="startContact('call')"
                  >
                    <i class="fa fa-phone"></i>
                    {{ phoneActionLabel }}
                  </button>
                  <button
                    v-if="whatsappLink"
                    type="button"
                    class="btn flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
                    @click="startContact('whatsapp')"
                  >
                    <i class="fa fa-whatsapp"></i>
                    {{ whatsappActionLabel }}
                  </button>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <DataRow label="Telefon" :value="company.phone || 'Keine Nummer'" />
                <DataRow label="WhatsApp" :value="company.whatsapp || 'Keine Nummer'" />
                <DataRow label="Preis" :value="company.price ? `ab ${company.price} €` : 'auf Anfrage'" />
                <DataRow
                  v-if="company.is_247 && company.emergency_price"
                  label="Notdienstpreis"
                  :value="`${company.emergency_price} €`"
                />
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

              <div class="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-inner">
                <TrackingRequestPanel :company="company" />
              </div>
            </div>

            <div
              class="relative min-h-[28rem] sm:min-h-[34rem] lg:min-h-[44rem] xl:min-h-[52rem] overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner"
            >
              <iframe
                class="absolute inset-0 h-full w-full"
                :src="mapUrl"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <CompanyReviews
            class="mt-10"
            :google-reviews-url="googleReviewsUrl"
            :google-place-url="googlePlaceUrl"
            :google-rating="googleRating"
            :google-review-count="googleReviewCount"
            :magikey-reviews="magikeyReviews"
          />
        </div>
      </div>
      <div v-else-if="!isLoading" class="glass-card p-8 text-center text-slate-600">
        <h1 class="section-heading mb-2 text-2xl">Firma nicht gefunden</h1>
        <p>Die angeforderte Firma existiert nicht oder wurde noch nicht verifiziert.</p>
      </div>
    </div>
  </section>

  <ReviewRequestModal
    v-if="company"
    :open="showReviewModal"
    :company-id="company.id || companyId"
    :company-name="company.company_name || ''"
    :action="pendingAction"
    @close="closeReviewModal"
    @submitted="handleReviewSubmitted"
    @skip="handleReviewSkipped"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCompany } from '@/core/services/company'
import DataRow from '@/ui/components/common/DataRow.vue'
import { LOCK_TYPE_LABELS, LOCK_TYPE_ICONS } from '@/core/constants/lockTypes'
import { DAYS, DAY_LABELS } from '@/core/constants/days'
import TrackingRequestPanel from '@/ui/components/tracking/TrackingRequestPanel.vue'
import ReviewRequestModal from '@/ui/components/reviews/ReviewRequestModal.vue'
import CompanyReviews from '@/ui/components/reviews/CompanyReviews.vue'
import { useReviewStore } from '@/core/stores/reviews'

const route = useRoute()
const router = useRouter()
const companyId = ref(route.params.id ?? '')
const company = ref(null)
const isLoading = ref(true)
const days = DAYS
const showReviewModal = ref(false)
const pendingAction = ref('call')
const googleReviewsUrl = computed(() => company.value?.verification?.google_reviews_url ?? '')
const googlePlaceUrl = computed(() => company.value?.verification?.google_place_url ?? '')

const googleRating = computed(() => extractRating(company.value))
const googleReviewCount = computed(() => extractReviewCount(company.value))

const { reviews: magikeyReviews, fetchCompanyReviews } = useReviewStore()

async function loadCompany(id) {
  if (!id) {
    company.value = null
    isLoading.value = false
    return
  }

  isLoading.value = true

  try {
    const data = await getCompany(id)
    if (data) {
      company.value = data
    } else {
      await router.replace({ name: 'not-found' })
    }
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCompany(companyId.value)
})

watch(
  () => route.params.id,
  (nextId, previousId) => {
    if (nextId && nextId === previousId) return
    const normalisedId = nextId ?? ''
    if (normalisedId === companyId.value && !normalisedId) return
    companyId.value = normalisedId
    loadCompany(normalisedId)
  }
)

watch(
  () => company.value?.id,
  (id) => {
    if (id) {
      fetchCompanyReviews(id)
    }
  },
  { immediate: true }
)

const fullAddress = computed(() => {
  const current = company.value
  if (!current) return ''
  const parts = [current.address, current.postal_code, current.city].filter(Boolean)
  return parts.join(', ')
})
const mapUrl = computed(() => {
  const current = company.value
  if (!current) return ''
  const companyLat = current?.coordinates?.lat ?? current?.latitude
  const companyLng = current?.coordinates?.lng ?? current?.longitude

  if (Number.isFinite(companyLat) && Number.isFinite(companyLng)) {
    return `https://maps.google.com/maps?q=${companyLat},${companyLng}&output=embed`
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`
})

const now = new Date()
const currentMinutes = now.getHours() * 60 + now.getMinutes()

const isOpen = computed(() => {
  const current = company.value
  if (!current) return false
  const day = days[now.getDay() - 1 < 0 ? 6 : now.getDay() - 1]
  const hours = current.opening_hours?.[day]
  if (!hours || !hours.open || !hours.close) return false

  const toMin = (t) => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1])
  return currentMinutes >= toMin(hours.open) && currentMinutes <= toMin(hours.close)
})

const openStatus = computed(() => {
  const current = company.value
  if (!current) return 'Unbekannt'
  if (isOpen.value) return 'Jetzt geöffnet'
  if (current.is_247 && current.emergency_price) return `Notdienst verfügbar – ${current.emergency_price} €`
  return 'Derzeit geschlossen'
})

const phoneLink = computed(() => {
  const raw = company.value?.phone
  if (!raw) return ''
  const normalized = raw.toString().replace(/[^0-9+]/g, '')
  return normalized ? `tel:${normalized}` : ''
})

const whatsappLink = computed(() => {
  const raw = company.value?.whatsapp
  if (!raw) return ''
  const normalized = raw.toString().replace(/[^0-9]/g, '')
  return normalized ? `https://wa.me/${normalized}` : ''
})

const hasContactOptions = computed(() => Boolean(phoneLink.value || whatsappLink.value))

const phoneActionLabel = computed(() => (phoneLink.value ? 'Jetzt anrufen' : ''))

const whatsappActionLabel = computed(() =>
  whatsappLink.value ? 'Über WhatsApp schreiben' : ''
)

function startContact(action = 'call') {
  pendingAction.value = action
  showReviewModal.value = true
}

function closeReviewModal() {
  showReviewModal.value = false
}

function handleReviewSubmitted() {
  const action = pendingAction.value
  showReviewModal.value = false
  contactCompany(action)
}

function handleReviewSkipped() {
  const action = pendingAction.value
  showReviewModal.value = false
  contactCompany(action)
}

function dayStatus(day) {
  const hours = company.value?.opening_hours?.[day]
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
  (company.value?.lock_types || []).map((t) => ({
    icon: LOCK_TYPE_ICONS[t] || '',
    label: LOCK_TYPE_LABELS[t] || t
  }))
)

function contactCompany(action) {
  if (action === 'call' && phoneLink.value) {
    window.location.href = phoneLink.value
  } else if (action === 'whatsapp' && whatsappLink.value) {
    window.open(whatsappLink.value, '_blank', 'noopener')
  }
}

function extractRating(current) {
  if (!current) return null
  const candidates = [
    current.verification?.google_rating,
    current.google_rating,
    current.rating,
    current.average_rating,
    current.avg_rating,
    current.magikey_rating,
  ]
  for (const value of candidates) {
    const cleaned = typeof value === 'string' ? value.replace(',', '.').trim() : value
    const number = Number.parseFloat(cleaned)
    if (Number.isFinite(number)) {
      return Math.max(0, Math.min(5, number))
    }
  }
  return null
}

function extractReviewCount(current) {
  if (!current) return null
  const candidates = [
    current.verification?.google_review_count,
    current.google_review_count,
    current.review_count,
    current.rating_count,
    current.reviews_count,
  ]
  for (const value of candidates) {
    let normalizedValue = value
    if (typeof normalizedValue === 'string') {
      normalizedValue = normalizedValue.replace(/[^0-9-]/g, '')
    }
    const number = Number.parseInt(normalizedValue, 10)
    if (Number.isFinite(number) && number >= 0) {
      return number
    }
  }
  return null
}
</script>
