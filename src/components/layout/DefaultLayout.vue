<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-white text-black">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 flex justify-center items-start pt-20">
      <div class="w-full max-w-4xl px-6 py-8">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const props = defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
