<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold text-slate-900">Bewertungen</h2>
      <a
        v-if="googleReviewsUrl"
        :href="googleReviewsUrl"
        target="_blank"
        rel="noopener"
        class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
      >
        <i class="fa fa-external-link mr-1"></i>
        Auf Google ansehen
      </a>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <h3 class="text-base font-semibold text-slate-800">Google Bewertungen</h3>
        <div
          class="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-inner"
        >
          <iframe
            v-if="googleEmbedUrl"
            :src="googleEmbedUrl"
            class="h-80 w-full"
            style="border: 0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div v-else class="p-6 text-sm text-slate-500">
            Keine Google-Bewertungs-URL hinterlegt.
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-base font-semibold text-slate-800">Magikey Bewertungen</h3>
        <div class="space-y-3 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-inner">
          <p v-if="loading" class="text-sm text-slate-500">
            Bewertungen werden geladen...
          </p>
          <template v-else>
            <ul v-if="magikeyReviews.length" class="space-y-4">
              <li
                v-for="review in magikeyReviews"
                :key="review.id || review.created_at || review.author"
                class="space-y-2 rounded-2xl border border-white/60 bg-white/60 p-4"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-semibold text-slate-800">
                    {{ review.author || 'Anonym' }}
                  </span>
                  <div class="flex items-center gap-1 text-amber-500">
                    <i
                      v-for="index in 5"
                      :key="index"
                      class="fa"
                      :class="index <= normalizedRating(review.rating) ? 'fa-star' : 'fa-star-o'"
                    ></i>
                  </div>
                </div>
                <p class="text-sm text-slate-600">
                  {{ review.comment || 'Keine Bewertung hinterlassen.' }}
                </p>
                <p v-if="formatDate(review.created_at)" class="text-xs text-slate-400">
                  {{ formatDate(review.created_at) }}
                </p>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500">
              Noch keine Magikey-Bewertungen vorhanden.
            </p>
          </template>
        </div>
      </div>
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
  magikeyReviews: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const googleEmbedUrl = computed(() => {
  if (!props.googleReviewsUrl) return ''
  try {
    const url = new URL(props.googleReviewsUrl)
    if (!url.searchParams.get('output')) {
      url.searchParams.set('output', 'embed')
    }
    return url.toString()
  } catch (err) {
    console.warn('Ungültige Google-URL für Bewertungen:', err)
    return props.googleReviewsUrl
  }
})

function normalizedRating(rating) {
  if (rating == null) return 0
  const value = Number(rating)
  if (!Number.isFinite(value)) return 0
  return Math.round(Math.min(Math.max(value, 0), 5))
}

function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof value === 'object') {
    if (value.seconds != null && value.nanoseconds != null) {
      return new Date(value.seconds * 1000 + value.nanoseconds / 1_000_000)
    }
    if (value.toDate instanceof Function) {
      try {
        return value.toDate()
      } catch (_) {
        return null
      }
    }
  }
  return null
}

function formatDate(value) {
  const date = toDate(value)
  if (!date) return ''
  try {
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (err) {
    console.warn('Datum konnte nicht formatiert werden:', err)
    return ''
  }
}
</script>
