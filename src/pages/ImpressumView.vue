<template>
  <div class="max-w-3xl mx-auto p-6">
    <nav class="mb-6 flex gap-4 text-sm">
      <router-link
        to="/impressum"
        class="hover:underline"
        :class="{ 'font-semibold text-gold': route.name === 'impressum' }"
        >Impressum</router-link
      >
      <router-link
        to="/datenschutz"
        class="hover:underline"
        :class="{ 'font-semibold text-gold': route.name === 'datenschutz' }"
        >Datenschutz</router-link
      >
    </nav>

    <h1 class="text-2xl font-bold mb-4">Impressum</h1>

    <p class="mb-4">Angaben gemäß § 5 TMG</p>
    <p class="mb-4">
      Magikey GmbH<br />
      Musterstraße 1<br />
      12345 Musterstadt
    </p>

    <p class="mb-4"><strong>Vertreten durch:</strong> Max Mustermann</p>

    <p class="mb-4">
      <strong>Kontakt:</strong><br />
      Telefon: +49 (0)123 456789<br />
      E-Mail: info@magikey.de
    </p>

    <p class="mb-4"><strong>Umsatzsteuer-ID:</strong> DE123456789</p>

    <p class="mb-4">
      <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
      Max Mustermann<br />
      Musterstraße 1<br />
      12345 Musterstadt
    </p>

    <p class="mb-4">
      <strong>Streitschlichtung</strong><br />
      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
      <a href="https://ec.europa.eu/consumers/odr" class="underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.
      Unsere E-Mail-Adresse finden Sie oben im Impressum.
    </p>

    <p class="mb-4">
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <p class="text-sm text-gray-600">
      Hinweis: Die oben genannten Angaben dienen nur als Beispiel und müssen durch die tatsächlichen
      Unternehmensdaten ersetzt werden.
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
