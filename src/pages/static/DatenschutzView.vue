<!-- Diese Datei zeigt die Datenschutzerklärung an. -->
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

    <h1 class="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

    <h2 class="text-xl font-semibold mt-6 mb-2">1. Allgemeine Hinweise</h2>
    <p class="mb-4">
      Der Schutz Ihrer persönlichen Daten ist mir, Jen Preißer, wichtig. Ich behandle Ihre personenbezogenen Daten vertraulich und
      entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">2. Verantwortliche Stelle</h2>
    <p class="mb-4">
      Jen Preißer<br />
      Schellingstraße 18/1<br />
      72622 Nürtingen<br />
      E-Mail:
      <a href="mailto:jen@preisser.de" class="underline">jen@preisser.de</a>
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      3. Erhebung und Verarbeitung personenbezogener Daten
    </h2>
    <p class="mb-4">
      Diese Website kann ohne Angabe personenbezogener Daten genutzt werden. Es werden jedoch automatisch Daten durch den Webhost
      (Firebase) gespeichert, z. B.:
    </p>
    <ul class="list-disc pl-6 mb-4">
      <li>IP-Adresse</li>
      <li>Browsertyp und Version</li>
      <li>Datum und Uhrzeit des Zugriffs</li>
      <li>aufgerufene Seiten</li>
    </ul>
    <p class="mb-4">
      Diese Daten dienen der technischen Bereitstellung der Seite und werden nicht dauerhaft gespeichert oder ausgewertet.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">4. Standortfunktion (optional)</h2>
    <p class="mb-4">
      Wenn Sie zustimmen, kann die Website auf Ihren Standort zugreifen, um Schlüsseldienste in Ihrer Nähe anzuzeigen. Diese Daten
      werden <strong>nicht gespeichert</strong> und nur temporär genutzt.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">5. Hosting & Infrastruktur</h2>
    <p class="mb-4">Die Website wird technisch bereitgestellt über:</p>
    <ul class="list-disc pl-6 mb-4">
      <li>
        <strong>Firebase Hosting</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)
      </li>
      <li>
        <strong>Domainverwaltung via Squarespace Domains</strong> (Squarespace Inc., 225 Varick Street, 12th Floor, New York, NY
        10014, USA)
      </li>
    </ul>
    <p class="mb-4">Weitere Informationen finden Sie hier:</p>
    <ul class="list-disc pl-6 mb-4">
      <li>
        <a
          href="https://firebase.google.com/support/privacy"
          class="underline"
          target="_blank"
          rel="noopener"
          >https://firebase.google.com/support/privacy</a
        >
      </li>
      <li>
        <a
          href="https://www.squarespace.com/privacy"
          class="underline"
          target="_blank"
          rel="noopener"
          >https://www.squarespace.com/privacy</a
        >
      </li>
    </ul>

    <h2 class="text-xl font-semibold mt-6 mb-2">6. Ihre Rechte</h2>
    <p class="mb-4">Sie haben das Recht auf:</p>
    <ul class="list-disc pl-6 mb-4">
      <li>Auskunft über gespeicherte Daten</li>
      <li>Berichtigung unrichtiger Daten</li>
      <li>Löschung („Recht auf Vergessenwerden“)</li>
      <li>Einschränkung der Verarbeitung</li>
      <li>Widerspruch</li>
    </ul>
    <p class="mb-4">
      Anfragen richten Sie bitte formlos per E-Mail an:
      <a href="mailto:jen@preisser.de" class="underline">jen@preisser.de</a>
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">7. Cookies & Tracking</h2>
    <p class="mb-4">
      Diese Website verwendet <strong>keine</strong> Cookies, Analyse- oder Werbetracker.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">8. Änderungen</h2>
    <p class="mb-4">
      Ich behalte mir vor, diese Datenschutzerklärung jederzeit anzupassen. Die aktuelle Version ist immer auf dieser Seite
      einsehbar.
    </p>

    <p class="text-sm text-gray-600 mt-6">Stand: August 2025</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
