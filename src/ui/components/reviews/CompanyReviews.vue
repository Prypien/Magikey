<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <h2 class="text-xl font-semibold text-slate-900">Bewertungen</h2>
      <p class="text-sm text-slate-600">
        Ein Blick auf das Feedback anderer Kundinnen und Kunden – direkt von Google und aus dem Magikey-Netzwerk.
      </p>
    </header>

    <div class="grid gap-6 md:grid-cols-2">
      <article class="space-y-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-inner">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-slate-900">Google Bewertungen</h3>
            <div v-if="hasGoogleSummary" class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <template v-if="googleRatingLabel">
                <div v-if="googleRatingStars.length" class="flex items-center gap-1 text-amber-500" aria-hidden="true">
                  <i
                    v-for="(icon, index) in googleRatingStars"
                    :key="index"
                    class="fa"
                    :class="icon"
                  ></i>
                </div>
                <span class="font-semibold text-slate-900">{{ googleRatingLabel }}</span>
              </template>
              <span v-if="googleReviewCountLabel">({{ googleReviewCountLabel }})</span>
            </div>
          </div>
          <a
            v-if="googleExternalUrl"
            :href="googleExternalUrl"
            target="_blank"
            rel="noopener"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Auf Google ansehen
          </a>
        </div>
        <div class="overflow-hidden rounded-2xl border border-white/60 bg-white/60">
          <iframe
            v-if="googleEmbedUrl"
            :src="googleEmbedUrl"
            class="h-[420px] w-full"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Google Bewertungen"
          ></iframe>
          <p v-else class="p-6 text-sm text-slate-600">
            Die Google-Bewertungen können hier aktuell nicht angezeigt werden. Öffne sie direkt bei Google.
          </p>
        </div>
      </article>

      <article class="space-y-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-inner">
        <div class="flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">Magikey Community</h3>
          <span v-if="magikeyReviews.length" class="text-sm text-slate-500">
            {{ magikeyReviews.length }} Bewertung{{ magikeyReviews.length === 1 ? '' : 'en' }}
          </span>
        </div>
        <div v-if="magikeyReviews.length" class="space-y-4">
          <div
            v-for="review in formattedMagikeyReviews"
            :key="review.id"
            class="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="font-semibold text-slate-900">{{ review.author }}</p>
              <p v-if="review.createdAt" class="text-xs text-slate-500">{{ review.createdAt }}</p>
            </div>
            <div class="flex items-center gap-2 text-amber-500" aria-hidden="true">
              <i
                v-for="star in 5"
                :key="star"
                class="fa"
                :class="star <= review.rating ? 'fa-star' : 'fa-star-o'"
              ></i>
            </div>
            <p class="text-sm text-slate-700">{{ review.comment }}</p>
          </div>
        </div>
        <p v-else class="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Noch keine Magikey-Bewertungen vorhanden – teile als Erste:r deine Erfahrung über das Feedback-Formular.
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  googleReviewsUrl: {
    type: String,
    default: '',
  },
  googlePlaceUrl: {
    type: String,
    default: '',
  },
  googleRating: {
    type: [Number, String],
    default: null,
  },
  googleReviewCount: {
    type: [Number, String],
    default: null,
  },
  magikeyReviews: {
    type: Array,
    default: () => [],
  },
})

const googleEmbedUrl = computed(() => resolveGoogleEmbedUrl(props.googleReviewsUrl, props.googlePlaceUrl))
const googleExternalUrl = computed(() => normalizeExternalGoogleUrl(props.googleReviewsUrl, props.googlePlaceUrl))

const normalizedGoogleRating = computed(() => normalizeRating(props.googleRating))
const googleRatingLabel = computed(() => formatRatingLabel(normalizedGoogleRating.value))

const normalizedGoogleReviewCount = computed(() => normalizeReviewCount(props.googleReviewCount))
const googleReviewCountLabel = computed(() => formatReviewCountLabel(normalizedGoogleReviewCount.value))

const hasGoogleSummary = computed(() => normalizedGoogleRating.value !== null || normalizedGoogleReviewCount.value !== null)

const googleRatingStars = computed(() => buildStarIcons(normalizedGoogleRating.value))

const formattedMagikeyReviews = computed(() =>
  props.magikeyReviews.map((review, index) => {
    const rating = Number.parseFloat(review?.rating ?? 0)
    const normalizedRating = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0
    const createdAt = normalizeDate(review?.created_at)

    return {
      id: review?.id ?? `magikey-${index}`,
      author: review?.author || 'Anonyme:r Nutzer:in',
      comment: review?.comment || 'Keine Details vorhanden.',
      rating: normalizedRating,
      createdAt,
    }
  })
)

function normalizeDate(value) {
  if (!value) return ''
  if (value instanceof Date) {
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(value)
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value?.toDate === 'function') {
    try {
      return normalizeDate(value.toDate())
    } catch (err) {
      console.warn('Konnte Datum nicht umwandeln:', err)
    }
  }
  return ''
}

function normalizeRating(value) {
  if (value === null || value === undefined || value === '') return null
  const source = typeof value === 'string' ? value.replace(',', '.').trim() : value
  const number = Number.parseFloat(source)
  if (!Number.isFinite(number)) return null
  const clamped = Math.max(0, Math.min(5, number))
  return clamped
}

function formatRatingLabel(value) {
  if (value === null) return ''
  const decimals = Number.isInteger(value) ? 0 : 1
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 1,
  }).format(value)
}

function normalizeReviewCount(value) {
  if (value === null || value === undefined || value === '') return null
  let source = value
  if (typeof source === 'string') {
    source = source.replace(/[^0-9-]/g, '')
  }
  const number = Number.parseInt(source, 10)
  if (!Number.isFinite(number) || number < 0) return null
  return number
}

function formatReviewCountLabel(value) {
  if (value === null) return ''
  return `${value} Bewertung${value === 1 ? '' : 'en'}`
}

function buildStarIcons(rating) {
  if (rating === null) return []
  const icons = []
  for (let i = 0; i < 5; i += 1) {
    const diff = rating - i
    if (diff >= 0.75) {
      icons.push('fa-star')
    } else if (diff >= 0.25) {
      icons.push('fa-star-half-o')
    } else {
      icons.push('fa-star-o')
    }
  }
  return icons
}

function resolveGoogleEmbedUrl(reviewsUrl, placeUrl) {
  const candidate = (reviewsUrl || '').trim() || (placeUrl || '').trim()
  if (!candidate) return ''

  try {
    const parsed = new URL(candidate)
    const host = parsed.hostname
    const isMapsHost = /(^|\.)maps\.google\./.test(host)

    if (isMapsHost) {
      if (parsed.pathname === '/' && parsed.searchParams.has('cid')) {
        const embed = new URL(`${parsed.protocol}//${parsed.hostname}/maps`)
        embed.searchParams.set('cid', parsed.searchParams.get('cid') || '')
        embed.searchParams.set('output', 'embed')
        return embed.toString()
      }

      if (parsed.pathname === '/maps') {
        const embed = new URL(parsed.toString())
        embed.searchParams.set('output', 'embed')
        return embed.toString()
      }
    }

    if (host === 'www.google.com' && parsed.pathname.startsWith('/maps/embed')) {
      return parsed.toString()
    }
  } catch (err) {
    console.warn('Konnte Google-URL nicht verarbeiten:', err)
  }

  return ''
}

function normalizeExternalGoogleUrl(reviewsUrl, placeUrl) {
  const candidate = (reviewsUrl || '').trim() || (placeUrl || '').trim()
  if (!candidate) return ''
  return candidate
}
</script>

<style scoped>
.fa-star,
.fa-star-o,
.fa-star-half-o {
  color: rgb(245 158 11 / 1);
}

.fa-star-o {
  opacity: 0.25;
}

.fa-star-half-o {
  opacity: 0.75;
}
</style>
