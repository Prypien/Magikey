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

    <h1 class="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

    <p class="mb-4">
      Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie
      diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Verantwortlicher</h2>
    <p class="mb-4">
      Magikey GmbH<br />
      Musterstraße 1<br />
      12345 Musterstadt<br />
      E-Mail: info@magikey.de
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Erhebung und Speicherung personenbezogener Daten</h2>
    <p class="mb-4">
      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie
      in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
      Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Google Maps</h2>
    <p class="mb-4">
      Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited ("Google"), Gordon House,
      Barrow Street, Dublin 4, Irland. Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese
      Informationen werden in der Regel an einen Server von Google in den USA übertragen. Der Anbieter dieser Seite hat keinen
      Einfluss auf diese Datenübertragung.
    </p>
    <p class="mb-4">
      Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und an einer leichten
      Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1
      lit. f DSGVO dar. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage
      von Art. 6 Abs. 1 lit. a DSGVO; die Einwilligung ist jederzeit widerrufbar.
    </p>
    <p class="mb-4">
      Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google:
      <a href="https://policies.google.com/privacy" class="underline" target="_blank" rel="noopener">https://policies.google.com/privacy</a>.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Rechte der betroffenen Personen</h2>
    <p class="mb-4">
      Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen
      Daten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen sowie die Einschränkung der
      Verarbeitung zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
    </p>

    <p class="text-sm text-gray-600">
      Diese Datenschutzerklärung dient als Beispiel und ersetzt keine rechtliche Beratung. Bitte lassen Sie den Text durch eine
      fachkundige Stelle prüfen.
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
