<template>
  <div class="flex flex-col min-h-screen text-black">
    <Header />
    <main class="flex-1 flex justify-center items-start pt-20">
      <div class="w-full max-w-4xl px-6 py-8">
        <router-view />
      </div>
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import Header from '@/layouts/Header.vue'
import Footer from '@/layouts/Footer.vue'

defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
})
</script>
