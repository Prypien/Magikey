<!-- Diese Datei blendet die Begrüßungsbox mit kurzer Erklärung ein. -->
<template>
  <section
    class="relative w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-lg sm:p-8"
  >
    <button
      class="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
      @click="$emit('close')"
      aria-label="Schließen"
    >
      <i class="fa fa-times"></i>
    </button>

    <h1 class="mb-4 flex items-center gap-2 text-lg font-semibold sm:text-xl">
      <span class="text-gold">
        <i class="fa fa-key"></i>
      </span>
      Schnell den passenden Schlüsseldienst finden
    </h1>

    <ul class="space-y-1 text-sm sm:text-base">
      <li class="flex items-start gap-2">
        <span>✅</span>
        <span>Vergleiche Preis, Öffnungszeiten und Bewertungen</span>
      </li>
      <li class="flex items-start gap-2">
        <span>📍</span>
        <span>Für alle Schlosstypen: Haus, Auto, Fahrrad & mehr</span>
      </li>
    </ul>

    <div v-if="!filters.location" class="mt-6">
      <label for="plz" class="label">PLZ eingeben</label>
      <input
        id="plz"
        v-model="postal"
        type="text"
        maxlength="5"
        placeholder="z. B. 10115"
        class="input"
      />
      <button class="btn mt-4 w-full" @click="applyPostal">Suchen</button>
    </div>

    <i
      class="fa fa-unlock-alt pointer-events-none absolute bottom-4 right-4 hidden text-6xl text-gray-300 opacity-20 md:block"
    ></i>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { filters } from '@/stores/filters'

const postal = ref('')
const emit = defineEmits(['close'])

function applyPostal() {
  if (postal.value.trim()) {
    const label = postal.value.trim()
    filters.location = label
    filters.locationMeta = {
      label,
      postalCode: label,
      city: '',
      lat: null,
      lng: null,
      source: 'intro'
    }
    emit('close')
  }
}
</script>

