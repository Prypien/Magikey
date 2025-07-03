<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">{{ t('datenschutz.title') }}</h1>
    <p>Hier folgt deine Datenschutzerklärung. Diese Inhalte sind Platzhalter.</p>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const t = inject('t')
</script>

