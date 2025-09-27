<!-- Diese Datei legt das Grundlayout mit Kopfbereich und Footer fest. -->
<template>
  <!-- Allgemeines Seitenlayout mit Header und optionalem Footer -->
  <div class="flex flex-col min-h-screen text-black">
    <div
      v-if="showNotice"
      class="bg-yellow-100 py-2 text-center text-sm text-gray-800"
    >
      Seite im Aufbau – Impressum folgt
    </div>
    <Header @update-height="headerHeight = $event" />
    <main
      class="relative flex-1 px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24"
      :style="{ paddingTop: contentPaddingTop }"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div
          class="h-64 w-[clamp(24rem,70vw,64rem)] rounded-full bg-gradient-to-b from-gold/35 via-gold/10 to-transparent blur-3xl"
        ></div>
      </div>
      <div class="mx-auto w-full max-w-6xl">
        <!-- Hier werden die Seiteninhalte eingeblendet -->
        <router-view />
      </div>
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'
// Optionale Anzeige des Footers steuern

const headerHeight = ref(0)
// Hinweisbanner bei Bedarf aktivieren
const showNotice = false

const contentPaddingTop = computed(() => `calc(${headerHeight.value}px + 1.5rem)`)

defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
