<!-- Diese Datei zeigt eine einzelne Firma in der Ergebnisliste. -->
<template>
  <li
    class="result-tile group relative flex h-full flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl sm:p-6"
    :class="borderColor"
    @click="navigateToDetails"
  >
    <div class="flex flex-1 flex-col gap-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <div
            class="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80 transition group-hover:ring-gold/40"
          >
            <img
              class="h-full w-full object-cover"
              :src="company.logo_url || '/logo.png'"
              :alt="company.company_name ? `Logo von ${company.company_name}` : 'Logo'"
            />
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-slate-900">{{ company.company_name }}</h3>
            <p class="text-sm text-slate-500">PLZ {{ company.postal_code }}</p>
          </div>
        </div>
        <span
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition"
          :class="statusClass"
        >
          <span class="inline-flex h-2 w-2 rounded-full bg-current opacity-60"></span>
          {{ openStatus }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 sm:text-sm">
        <span
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700"
        >
          <i class="fa fa-euro-sign text-[0.8rem] text-gold/70"></i>
          {{ basePrice }}
        </span>
        <span
          v-if="emergencyPrice"
          class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-600"
        >
          <i class="fa fa-bolt text-[0.8rem]"></i>
          {{ emergencyPrice }}
        </span>
        <span
          v-if="company.is_247"
          class="inline-flex items-center gap-1 rounded-full border border-slate-900/20 bg-slate-900/90 px-3 py-1 font-medium text-white"
        >
          <i class="fa fa-moon"></i>
          24/7 Notdienst
        </span>
        <span
          v-if="company.verified"
          class="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-600"
        >
          <i class="fa fa-check-circle"></i>
          Verifiziert
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-400"
        >
          <i class="fa fa-shield-alt"></i>
          Prüfung läuft
        </span>
      </div>

      <div v-if="lockTypes.length" class="flex flex-wrap gap-2 text-xs text-slate-500">
        <span
          v-for="lock in lockTypes"
          :key="lock.label"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-1 font-medium text-slate-600"
        >
          <span>{{ lock.icon }}</span>
          <span>{{ lock.label }}</span>
        </span>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 text-sm font-medium text-gold/80 opacity-0 transition group-hover:opacity-100">
      <span>Details ansehen</span>
      <i class="fa fa-arrow-right"></i>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LOCK_TYPE_LABELS, LOCK_TYPE_ICONS } from '@/constants/lockTypes'
import { DAYS } from '@/constants/days'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const euroFormatter = new Intl.NumberFormat('de-DE')

const isOpen = computed(() => {
  const now = new Date()
  const dayIndex = now.getDay() - 1
  const today = DAYS[dayIndex < 0 ? 6 : dayIndex]
  const hours = props.company?.opening_hours?.[today]

  if (!hours || !hours.open || !hours.close) return false

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const nowM = now.getHours() * 60 + now.getMinutes()
  return nowM >= toMinutes(hours.open) && nowM <= toMinutes(hours.close)
})

const openStatus = computed(() => {
  if (isOpen.value) return 'Jetzt geöffnet'
  if (props.company.is_247) return 'Notdienst erreichbar'
  return 'Derzeit geschlossen'
})

const statusClass = computed(() =>
  isOpen.value
    ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60'
    : props.company.is_247
      ? 'bg-red-50 text-red-600 ring-1 ring-red-200/60'
      : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60'
)

const borderColor = computed(() =>
  isOpen.value
    ? 'border-emerald-200/70 shadow-lg'
    : props.company.is_247
      ? 'border-red-200/70 shadow-md'
      : 'border-slate-200/70 shadow-sm'
)

const lockTypes = computed(() =>
  (props.company.lock_types || []).map((t) => ({
    icon: LOCK_TYPE_ICONS[t] || '',
    label: LOCK_TYPE_LABELS[t] || t
  }))
)

const basePrice = computed(() => {
  const value = Number.parseInt(props.company.price, 10)
  if (Number.isFinite(value) && value > 0) return `ab ${euroFormatter.format(value)} €`
  return 'Preis auf Anfrage'
})

const emergencyPrice = computed(() => {
  const value = Number.parseInt(props.company.emergency_price, 10)
  if (Number.isFinite(value) && value > 0) return `Notdienst ${euroFormatter.format(value)} €`
  return ''
})

function navigateToDetails() {
  router.push({ name: 'details', params: { id: props.company.id } })
}
</script>

<style scoped>
.result-tile {
  position: relative;
  overflow: hidden;
}

.result-tile::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 85% 20%, rgba(217, 169, 8, 0.12), transparent 55%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.result-tile:hover::before {
  opacity: 1;
}
</style>
