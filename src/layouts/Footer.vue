<template>
  <footer class="bg-black text-white py-4 px-6 text-sm text-center mt-auto">
    <div class="flex justify-center items-center gap-4 text-white/70">
      <router-link to="/impressum" class="hover:underline">{{ t('footer.impressum') }}</router-link>
      <span class="opacity-40">|</span>
      <router-link to="/datenschutz" class="hover:underline">{{ t('footer.datenschutz') }}</router-link>
      <span class="opacity-40">|</span>
      <a href="/blog" target="_blank" class="hover:underline">{{ t('footer.blog') }}</a>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue'
const t = inject('t')
</script>


