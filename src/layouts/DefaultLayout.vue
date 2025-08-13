<template>
  <!-- Allgemeines Seitenlayout mit Header und optionalem Footer -->
  <div class="flex flex-col min-h-screen text-black">
    <Header @update-height="headerHeight = $event" />
    <main class="flex-1 flex justify-center items-start" :style="{ paddingTop: headerHeight + 'px' }">
      <div class="w-full max-w-4xl px-6 py-8">
        <!-- Hier werden die Seiteninhalte eingeblendet -->
        <router-view />
      </div>
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'
// Optionale Anzeige des Footers steuern

const headerHeight = ref(0)

defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
