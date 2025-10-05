<!-- Diese Datei zeigt die Datenschutzerklärung an. -->
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
          <h1 class="section-heading">Datenschutzerklärung</h1>
          <p class="section-subtitle">Transparente Informationen zum Umgang mit deinen Daten</p>
        </header>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">1. Allgemeine Hinweise</h2>
          <p>
            Der Schutz deiner persönlichen Daten ist mir, Jen Preißer, wichtig. Ich behandle deine personenbezogenen Daten
            vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">2. Verantwortliche Stelle</h2>
          <p>
            Jen Preißer<br />
            Schellingstraße 18/1<br />
            72622 Nürtingen<br />
            E-Mail:
            <a href="mailto:jen@preisser.de" class="text-gold underline-offset-4 hover:underline">jen@preisser.de</a>
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">3. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>
            Diese Website kann ohne Angabe personenbezogener Daten genutzt werden. Es werden jedoch automatisch Daten durch den
            Webhost (Firebase) gespeichert, z. B.:
          </p>
          <ul class="list-disc space-y-1 pl-6">
            <li>IP-Adresse</li>
            <li>Browsertyp und Version</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>aufgerufene Seiten</li>
          </ul>
          <p>Diese Daten dienen der technischen Bereitstellung der Seite und werden nicht dauerhaft gespeichert oder ausgewertet.</p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">4. Standortfunktion (optional)</h2>
          <p>
            Wenn du zustimmst, kann die Website auf deinen Standort zugreifen, um Schlüsseldienste in deiner Nähe anzuzeigen. Diese
            Daten werden <strong>nicht gespeichert</strong> und nur temporär genutzt.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">5. Hosting &amp; Infrastruktur</h2>
          <p>Die Website wird technisch bereitgestellt über:</p>
          <ul class="list-disc space-y-1 pl-6">
            <li>
              <strong>Firebase Hosting</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)
            </li>
            <li>
              <strong>Domainverwaltung via Squarespace Domains</strong> (Squarespace Inc., 225 Varick Street, 12th Floor, New York,
              NY 10014, USA)
            </li>
          </ul>
          <p>Weitere Informationen findest du hier:</p>
          <ul class="list-disc space-y-1 pl-6">
            <li>
              <a
                href="https://firebase.google.com/support/privacy"
                class="text-gold underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener"
                >https://firebase.google.com/support/privacy</a
              >
            </li>
            <li>
              <a
                href="https://www.squarespace.com/privacy"
                class="text-gold underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener"
                >https://www.squarespace.com/privacy</a
              >
            </li>
          </ul>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">6. Deine Rechte</h2>
          <p>Du hast das Recht auf:</p>
          <ul class="list-disc space-y-1 pl-6">
            <li>Auskunft über gespeicherte Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung („Recht auf Vergessenwerden“)</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Widerspruch</li>
          </ul>
          <p>
            Anfragen richtest du bitte formlos per E-Mail an:
            <a href="mailto:jen@preisser.de" class="text-gold underline-offset-4 hover:underline">jen@preisser.de</a>
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">7. Cookies &amp; Tracking</h2>
          <p>Diese Website verwendet <strong>keine</strong> Cookies, Analyse- oder Werbetracker.</p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">8. Änderungen</h2>
          <p>
            Ich behalte mir vor, diese Datenschutzerklärung jederzeit anzupassen. Die aktuelle Version ist immer auf dieser Seite
            einsehbar.
          </p>
        </section>

        <p class="text-xs text-slate-500">Stand: August 2025</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
