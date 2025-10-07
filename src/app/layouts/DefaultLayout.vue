<!-- Diese Datei legt das Grundlayout mit Kopfbereich und Footer fest. -->
<template>
  <!-- Allgemeines Seitenlayout mit Header und optionalem Footer -->
  <div class="relative flex min-h-screen flex-col text-black">
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute left-[-18rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-gold/25 blur-3xl sm:left-[-12rem] sm:top-[-12rem]"
      ></div>
      <div
        class="absolute right-[-10rem] top-[30%] h-[26rem] w-[26rem] rounded-full bg-sky-200/40 blur-3xl sm:right-[-6rem]"
      ></div>
      <div
        class="absolute bottom-[-14rem] left-[15%] h-[32rem] w-[32rem] rounded-full bg-slate-200/45 blur-3xl"
      ></div>
    </div>

    <div
      v-if="showNotice"
      class="bg-yellow-100/90 py-2 text-center text-sm text-gray-800 backdrop-blur"
    >
      Seite im Aufbau – Impressum folgt
    </div>
    <Header @update-height="headerHeight = $event" />
    <div
      aria-hidden="true"
      class="header-offset flex-shrink-0"
      :style="{ height: headerOffsetHeight }"
    ></div>
    <main class="relative flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10">
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
import Header from '@/app/layouts/Header.vue'
import Footer from '@/app/layouts/Footer.vue'
// Optionale Anzeige des Footers steuern

const FALLBACK_HEADER_HEIGHT = 88
const headerHeight = ref(FALLBACK_HEADER_HEIGHT)
// Hinweisbanner bei Bedarf aktivieren
const showNotice = false

const headerOffsetHeight = computed(() => `${headerHeight.value}px`)

defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
