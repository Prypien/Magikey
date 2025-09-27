<!-- Diese Datei stellt das Impressum mit Kontaktdaten dar. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-4xl space-y-8">
      <nav class="flex flex-wrap gap-3">
        <router-link
          to="/impressum"
          :class="[
            'pill-checkbox text-sm',
            route.name === 'impressum'
              ? 'border-gold bg-gold/25 text-slate-900'
              : 'text-slate-600'
          ]"
        >
          Impressum
        </router-link>
        <router-link
          to="/datenschutz"
          :class="[
            'pill-checkbox text-sm',
            route.name === 'datenschutz'
              ? 'border-gold bg-gold/25 text-slate-900'
              : 'text-slate-600'
          ]"
        >
          Datenschutz
        </router-link>
      </nav>

      <div class="glass-card p-8 sm:p-10 space-y-6">
        <header class="space-y-2">
          <h1 class="section-heading">Impressum</h1>
          <p class="section-subtitle">Angaben gemäß § 5 TMG</p>
        </header>

        <section class="space-y-1 text-sm text-slate-600">
          <address class="not-italic leading-relaxed">
            Jen Preißer<br />
            Schellingstraße 18/1<br />
            72622 Nürtingen<br />
            Deutschland
          </address>
        </section>

        <section class="space-y-2 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">Kontakt</h2>
          <p>
            E-Mail:
            <a href="mailto:jen@preisser.de" class="text-gold underline-offset-4 hover:underline">jen@preisser.de</a>
          </p>
        </section>

        <section class="space-y-2 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <address class="not-italic leading-relaxed">
            Jen Preißer<br />
            Schellingstraße 18/1<br />
            72622 Nürtingen
          </address>
        </section>

        <p class="text-sm text-slate-500">
          Hinweis: Diese Website wird als privates, nicht-kommerzielles Projekt betrieben. Eine Haftung für Inhalte Dritter wird
          ausgeschlossen.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
