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

            <div class="flex flex-wrap justify-center gap-4">
              <a
                v-if="company.phone"
                :href="`tel:${company.phone}`"
                class="btn flex items-center gap-2"
              >
                <i class="fa fa-phone"></i>
                Jetzt anrufen
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCompany } from '@/services/company'
import DataRow from '@/components/common/DataRow.vue'
import { LOCK_TYPE_LABELS, LOCK_TYPE_ICONS } from '@/constants/lockTypes'
import { DAYS, DAY_LABELS } from '@/constants/days'

const route = useRoute()
const companyId = route.params.id
const company = ref({})
const days = DAYS

onMounted(async () => {
  if (companyId) {
    try {
      const data = await getCompany(companyId)
      if (data) {
        company.value = data
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
    }
  }
})

const fullAddress = computed(() => {
  const parts = [company.value.address, company.value.postal_code, company.value.city].filter(Boolean)
  return parts.join(', ')
})
const mapUrl = computed(() => `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`)

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
</script>
