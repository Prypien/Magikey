<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-3xl space-y-8">
      <div class="glass-card p-6 sm:p-8">
        <header class="space-y-4 text-center">
          <p class="badge-neutral inline-flex items-center gap-2 text-emerald-600">
            <i class="fa fa-star-sharp"></i>
            Magikey Vertrauensbewertung
          </p>
          <h1 class="text-3xl font-semibold text-slate-900">Bewerte deinen Auftrag</h1>
          <p class="text-sm text-slate-600">
            Dein Feedback stärkt die Transparenz der Plattform. Jede Bewertung wird verifiziert, bevor sie veröffentlicht
            wird.
          </p>
        </header>

        <div v-if="loading" class="flex justify-center py-12">
          <Loader :size="72" />
        </div>

        <div v-else>
          <div v-if="!request" class="space-y-4 text-center text-sm text-red-500">
            <i class="fa fa-triangle-exclamation text-3xl"></i>
            <p>Dieser Bewertungslink ist nicht mehr gültig oder wurde bereits verwendet.</p>
          </div>

          <div v-else class="space-y-6">
            <div class="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-inner">
              <p class="text-sm font-medium text-slate-600">Auftraggeber</p>
              <h2 class="text-xl font-semibold text-slate-900">{{ request.company_name }}</h2>
              <p class="text-xs text-slate-500">
                Vorgang vom {{ formattedCreatedAt }} · Kanal: {{ channelLabel }}
              </p>
            </div>

            <Transition name="fade" mode="out-in">
              <div v-if="submitted" key="submitted" class="space-y-4 text-center text-emerald-600">
                <i class="fa fa-shield-check text-4xl"></i>
                <p class="text-lg font-semibold">Vielen Dank! Deine Bewertung wurde sicher übermittelt.</p>
                <p class="text-sm text-slate-600">
                  Unser Trust-Team prüft die Angaben und schaltet die Rezension im Unternehmensprofil frei.
                </p>
              </div>
              <form v-else key="form" class="space-y-6" @submit.prevent="submit">
                <div class="space-y-3">
                  <h3 class="text-lg font-semibold text-slate-900">Wie zufrieden warst du?</h3>
                  <div class="flex justify-center gap-2 sm:gap-3">
                    <button
                      v-for="value in ratingOptions"
                      :key="value"
                      type="button"
                      class="flex h-12 w-12 items-center justify-center rounded-full border text-lg transition"
                      :class="value <= rating ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-white/70 bg-white/60 text-slate-400'"
                      @click="setRating(value)"
                      @keydown.enter.prevent="setRating(value)"
                    >
                      {{ value }}
                    </button>
                  </div>
                  <p class="text-center text-xs text-slate-500">1 = sehr unzufrieden · 5 = begeistert</p>
                </div>

                <label class="space-y-2">
                  <span class="label text-slate-700">Was sollen andere Kund:innen wissen?</span>
                  <textarea
                    v-model="comment"
                    class="water-textarea min-h-[130px]"
                    placeholder="Beschreibe deine Erfahrung, Preise, Pünktlichkeit und Professionalität."
                  ></textarea>
                </label>

                <div class="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-700">
                  <p class="font-semibold">Sicherheitsversprechen</p>
                  <p>
                    Wir veröffentlichen nur Bewertungen, die über Magikey eingehen. Deine Angaben werden verschlüsselt
                    übertragen und ausschließlich zur Qualitätsprüfung genutzt.
                  </p>
                </div>

                <div class="space-y-3 text-center">
                  <Button type="submit" class="w-full sm:w-auto" :disabled="submitting">
                    <template v-if="submitting">Übertrage…</template>
                    <template v-else>Bewertung abschicken</template>
                  </Button>
                  <p v-if="errorMessage" class="text-sm text-red-500">
                    <i class="fa fa-circle-exclamation"></i>
                    {{ errorMessage }}
                  </p>
                </div>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Loader from '@/components/common/Loader.vue'
import { getReviewRequest, submitReview } from '@/services/review'

const props = defineProps({
  requestId: {
    type: String,
    required: false,
    default: '',
  },
})

const route = useRoute()

const request = ref(null)
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')
const rating = ref(0)
const comment = ref('')

const ratingOptions = [1, 2, 3, 4, 5]

const currentRequestId = computed(() => props.requestId || route.params.requestId)

const formattedCreatedAt = computed(() => {
  if (!request.value?.created_at) return 'unbekannt'
  try {
    const date = typeof request.value.created_at === 'string'
      ? new Date(request.value.created_at)
      : request.value.created_at.toDate?.() ?? new Date(request.value.created_at)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (error) {
    console.warn('Datum konnte nicht formatiert werden:', error)
    return 'unbekannt'
  }
})

const channelLabel = computed(() => {
  const channel = request.value?.channel
  if (channel === 'call') return 'Telefon'
  if (channel === 'message') return 'Nachricht'
  return 'unbekannt'
})

function setRating(value) {
  rating.value = value
  errorMessage.value = ''
}

async function loadRequest() {
  loading.value = true
  try {
    request.value = await getReviewRequest(currentRequestId.value)
  } catch (error) {
    console.error('Rezensionslink konnte nicht geladen werden:', error)
    request.value = null
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!rating.value) {
    errorMessage.value = 'Bitte wähle eine Bewertung zwischen 1 und 5 Sternen.'
    return
  }
  if (!request.value) {
    errorMessage.value = 'Der Bewertungslink ist nicht mehr aktiv.'
    return
  }

  submitting.value = true
  errorMessage.value = ''
  try {
    await submitReview(currentRequestId.value, {
      rating: rating.value,
      comment: comment.value,
    })
    submitted.value = true
  } catch (error) {
    console.error('Bewertung konnte nicht gespeichert werden:', error)
    errorMessage.value = error.message || 'Speichern fehlgeschlagen. Bitte versuche es erneut.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadRequest()
})
</script>
