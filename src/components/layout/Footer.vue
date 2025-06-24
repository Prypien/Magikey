<!-- src/components/layout/Footer.vue -->
<template>
  <footer class="bg-black text-white py-4 px-6 text-sm text-center mt-auto">
    <div class="flex justify-center items-center gap-4 text-white/70">
      <span class="cursor-pointer hover:underline" @click="openLink('impressum')">Impressum</span>
      <span class="opacity-40">|</span>
      <span class="cursor-pointer hover:underline" @click="openLink('datenschutz')">Datenschutz</span>
      <span class="opacity-40">|</span>
      <span class="cursor-pointer hover:underline" @click="openLink('blog')">Blog</span>
    </div>
  </footer>
</template>

<script setup>
function openLink(page) {
  const map = {
    impressum: '/impressum',
    datenschutz: '/datenschutz',
    blog: '/blog'
  }
  window.open(map[page], '_blank')
}
</script>
