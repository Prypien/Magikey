<!-- src/components/layout/Footer.vue -->
<template>
  <footer class="bg-black text-white py-4 px-6 text-sm text-center mt-auto">
    <div class="flex justify-center items-center gap-4 text-white/70">
      <!-- Interne Links -->
      <router-link to="/impressum" class="hover:underline">Impressum</router-link>
      <span class="opacity-40">|</span>
      <router-link to="/datenschutz" class="hover:underline">Datenschutz</router-link>
      <span class="opacity-40">|</span>
      <!-- Externer Blog -->
      <a href="/blog" target="_blank" class="hover:underline">Blog</a>
    </div>
  </footer>
</template>

<script setup>
// Kein JavaScript notwendig
</script>
