<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">{{ t('impressum.title') }}</h1>
    <p>Diese Seite dient nur als Demo. Trage hier deine Impressumsangaben ein.</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const t = inject('t')
</script>

