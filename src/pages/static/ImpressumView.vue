<template>
  <div class="max-w-3xl mx-auto p-6">
    <nav class="mb-6 flex gap-4">
      <router-link
        to="/impressum"
        :class="route.name === 'impressum' ? 'btn text-sm' : 'btn-outline text-sm'"
        >Impressum</router-link
      >
      <router-link
        to="/datenschutz"
        :class="route.name === 'datenschutz' ? 'btn text-sm' : 'btn-outline text-sm'"
        >Datenschutz</router-link
      >
    </nav>

    <h1 class="text-2xl font-bold mb-4">Impressum</h1>

    <h2 class="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
    <address class="not-italic mb-4">
      Jen Preißer<br />
      Schellingstraße 18/1<br />
      72622 Nürtingen<br />
      Deutschland
    </address>

    <h2 class="text-xl font-semibold mb-2">Kontakt</h2>
    <p class="mb-4">
      E-Mail:
      <a href="mailto:jen@preisser.de" class="underline">jen@preisser.de</a>
    </p>

    <h2 class="text-xl font-semibold mb-2">
      Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
    </h2>
    <address class="not-italic mb-4">
      Jen Preißer<br />
      Schellingstraße 18/1<br />
      72622 Nürtingen
    </address>

    <p class="mt-6">
      Hinweis: Diese Website wird als privates, nicht-kommerzielles Projekt betrieben. Eine
      Haftung für Inhalte Dritter wird ausgeschlossen.
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
