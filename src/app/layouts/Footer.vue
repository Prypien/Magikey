<!-- Diese Datei beschreibt den festen Fußbereich mit Links. -->
<template>
  <footer class="footer-shell">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
      <p class="text-xs text-slate-500 sm:text-sm">
        © {{ currentYear }} Magikey – Transparente Schlüsseldienste in deiner Nähe
      </p>
      <nav class="flex items-center gap-3 text-xs sm:text-sm">
        <router-link to="/impressum" class="footer-link">Impressum</router-link>
        <span class="text-slate-300/60">·</span>
        <router-link to="/datenschutz" class="footer-link">Datenschutz</router-link>
        <span class="text-slate-300/60">·</span>
        <router-link to="/blog" class="footer-link">Blog</router-link>
        <span class="text-slate-300/60">·</span>
        <router-link to="/support" class="footer-link">Support</router-link>
        <span class="text-slate-300/60">·</span>
        <router-link to="/hilfe" class="footer-link">Hilfe</router-link>
      </nav>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-shell {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 40;
  display: flex;
  width: 100%;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.06);
}

.footer-link {
  color: rgba(71, 85, 105, 0.9);
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-link:hover {
  color: #d9a908;
  transform: translateY(-1px);
}
</style>
