<template>
  <section class="page-wrapper">
    <div class="glass-card p-8 sm:p-12 space-y-10">
      <header class="space-y-4 text-center">
        <h1 class="section-heading">Unterstütze Magikey</h1>
        <p class="section-subtitle">
          Magikey ist ein unabhängiges Projekt, das faire und transparente Schlüsseldienste sichtbar macht. Mit einem freiwilligen Beitrag hilfst du uns, Entwicklung, Infrastruktur und Support langfristig zu sichern.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article class="muted-panel space-y-3">
          <h2 class="text-lg font-semibold text-slate-900">Warum spenden?</h2>
          <p class="text-sm text-slate-600">
            Wir finanzieren uns nicht über versteckte Provisionen. Deine Unterstützung ermöglicht es uns, neutrale Informationen bereitzustellen und regionale Betriebe sichtbar zu machen.
          </p>
        </article>

        <article class="muted-panel space-y-3">
          <h2 class="text-lg font-semibold text-slate-900">Was passiert mit dem Beitrag?</h2>
          <ul class="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Weiterentwicklung der Plattform und neuer Funktionen</li>
            <li>Hosting, Sicherheit und laufende Wartung</li>
            <li>Community-Support und Moderation</li>
          </ul>
        </article>

        <article class="muted-panel space-y-3">
          <h2 class="text-lg font-semibold text-slate-900">Schon jetzt danke!</h2>
          <p class="text-sm text-slate-600">
            Jeder Betrag – einmalig oder regelmäßig – hilft uns, den Dienst ohne Werbung oder Lockangebote zu betreiben. Vielen Dank für dein Vertrauen in Magikey.
          </p>
        </article>
      </div>

      <div class="text-center space-y-3" v-if="hasPaypalLink">
        <p class="text-sm text-slate-600">
          Du möchtest direkt unterstützen? Nutze unseren sicheren PayPal.me-Link.
        </p>
        <a
          :href="paypalLink"
          class="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          target="_blank"
          rel="noopener"
        >
          <i class="fa fa-heart"></i>
          Jetzt unterstützen
        </a>
      </div>

      <p v-else class="text-center text-sm text-slate-500">
        Aktuell ist kein Spendenlink hinterlegt. Wende dich bei Interesse an <a href="mailto:info@magikey.de" class="text-gold underline-offset-4 hover:underline">info@magikey.de</a>.
      </p>
    </div>
  </section>
</template>

<script setup>
const paypalLink = import.meta.env.VITE_PAYPAL_ME_URL || ''
const hasPaypalLink = Boolean(paypalLink)
</script>
