<!-- Diese Datei beschreibt den festen Fußbereich mit Links. -->
<template>
  <footer class="fixed bottom-0 left-0 w-full bg-black text-white py-4 px-6 text-sm text-center z-50">
    <div class="flex justify-center items-center gap-4 text-white/70">
      <router-link to="/impressum" class="hover:underline">Impressum</router-link>
      <span class="opacity-40">|</span>
      <router-link to="/datenschutz" class="hover:underline">Datenschutz</router-link>
      <span class="opacity-40">|</span>
      <a href="/blog" target="_blank" class="hover:underline">Blog</a>
    </div>
  </footer>
</template>

<script setup>
</script>


