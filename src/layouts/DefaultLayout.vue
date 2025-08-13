<template>
  <!-- Allgemeines Seitenlayout mit Header und optionalem Footer -->
  <div class="flex flex-col min-h-screen text-black">
    <Header />
    <main class="flex-1 flex justify-center items-start pt-24">
      <div class="w-full max-w-4xl px-6 py-8">
        <!-- Hier werden die Seiteninhalte eingeblendet -->
        <router-view />
      </div>
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'
// Optionale Anzeige des Footers steuern

defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
