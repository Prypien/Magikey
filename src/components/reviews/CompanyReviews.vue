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
        <div class="flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">Google Bewertungen</h3>
          <a
            v-if="googleReviewsUrl"
            :href="googleReviewsUrl"
            target="_blank"
            rel="noopener"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Auf Google ansehen
          </a>
        </div>
        <div class="overflow-hidden rounded-2xl border border-white/60 bg-white/60">
          <iframe
            v-if="googleReviewsUrl"
            :src="googleReviewsUrl"
            class="h-[420px] w-full"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Google Bewertungen"
          ></iframe>
          <p v-else class="p-6 text-sm text-slate-600">
            Für dieses Unternehmen sind aktuell keine Google-Bewertungen hinterlegt.
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
  magikeyReviews: {
    type: Array,
    default: () => [],
  },
})

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
</script>

<style scoped>
.fa-star,
.fa-star-o {
  color: rgb(245 158 11 / 1);
}

.fa-star-o {
  opacity: 0.25;
}
</style>
