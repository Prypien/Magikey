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
            Der Schutz deiner persönlichen Daten ist mir, Jen Preißer, wichtig. Ich verarbeite deine personenbezogenen Daten
            ausschließlich im Rahmen der gesetzlichen Bestimmungen (insbesondere DSGVO und BDSG). Nachfolgend erhältst du einen
            Überblick darüber, welche Daten auf <strong>magikey.de</strong> verarbeitet werden, zu welchen Zwecken und auf welcher
            Rechtsgrundlage dies geschieht.
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
          <h2 class="text-lg font-semibold text-slate-900">3. Hosting &amp; technische Bereitstellung</h2>
          <p>
            Die Website wird über <strong>Firebase Hosting</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043,
            USA) ausgeliefert. Beim Aufruf der Seite werden serverseitig temporär folgende Daten verarbeitet:
          </p>
          <ul class="list-disc space-y-1 pl-6">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>abgerufene Datei/URL</li>
            <li>Browsertyp und Betriebssystem</li>
          </ul>
          <p>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabiler und sicherer
            Bereitstellung). Die Protokolle werden von Firebase nach wenigen Tagen automatisch gelöscht. Für den Domainbetrieb wird
            zusätzlich <strong>Squarespace Domains</strong> (Squarespace Inc., 225 Varick Street, 12th Floor, New York, NY 10014,
            USA) eingesetzt.
          </p>
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
          <p>
            Mit Google bestehen die von der DSGVO vorgesehenen Standardvertragsklauseln. Die Daten werden überwiegend in europäischen
            Rechenzentren verarbeitet; ein Zugriff aus den USA kann jedoch nicht ausgeschlossen werden.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">4. Kommunikation</h2>
          <p>
            Wenn du mir eine E-Mail sendest oder telefonisch Kontakt aufnimmst, werden die mitgeteilten Daten (z. B. Name,
            Kontaktdaten, Inhalt der Anfrage) ausschließlich zur Bearbeitung deines Anliegens verarbeitet (Art. 6 Abs. 1 lit. b
            bzw. lit. f DSGVO). Die Angaben werden gelöscht, sobald deine Anfrage abgeschlossen ist und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
          <p>
            Rufst du über den Button „Jetzt anrufen“ an oder nutzt den „WhatsApp“-Button, werden ausschließlich beim jeweiligen
            Telekommunikationsanbieter Daten verarbeitet. Auf diese Verarbeitung habe ich keinen Einfluss; es gelten die
            Datenschutzbestimmungen des jeweiligen Dienstes.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">5. Magikey-Konten &amp; Unternehmensverwaltung</h2>
          <p>
            Regionale Schlüsseldienste können ein Konto anlegen, um ihre Daten zu pflegen. Für Registrierung und Login wird
            <strong>Firebase Authentication</strong> eingesetzt. Dabei werden E-Mail-Adresse, Passwort (verschlüsselt) sowie
            Verifizierungsstatus verarbeitet. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen bzw.
            Vertragserfüllung).
          </p>
          <p>
            Unternehmensdaten (z. B. Adresse, Preise, Leistungsbeschreibung, Öffnungszeiten) werden in <strong>Firebase
            Firestore</strong> gespeichert. Logos werden in <strong>Firebase Storage</strong> abgelegt. Die Daten sind nur für das
            Magikey-Team einsehbar und werden genutzt, um den öffentlichen Firmeneintrag bereitzustellen. Änderungen protokolliere
            ich zur Nachvollziehbarkeit.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">6. Benachrichtigungen &amp; Bewertungsanfragen</h2>
          <p>
            <strong>Benachrichtigen-Formular:</strong> Wenn du dich über das Formular „Benachrichtigen“ für Updates anmeldest,
            speichere ich deine E-Mail-Adresse in Firebase Firestore, um dir Informationen zum Launch zu schicken. Die Verarbeitung
            erfolgt ausschließlich auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit per
            E-Mail an <a href="mailto:jen@preisser.de" class="text-gold underline-offset-4 hover:underline">jen@preisser.de</a>
            widerrufen. Die Adresse wird dann gelöscht.
          </p>
          <p>
            <strong>Bewertungsbogen:</strong> Wenn du bei einem Schlüsseldienst einen Bewertungsbogen anforderst, speichere ich die
            von dir angegebene E-Mail-Adresse zusammen mit der Unternehmens-ID in Firebase Firestore, um den Bewertungslink zu
            versenden und Missbrauch zu verhindern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            glaubwürdigen Rezensionen). Die Daten werden gelöscht, sobald der Bewertungsprozess abgeschlossen ist.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">7. Standort- &amp; Kartenfunktionen</h2>
          <p>
            Die Standortbestimmung ist freiwillig. Erst wenn du auf „Standort ermitteln“ klickst, fragt dein Browser über die
            Geolocation-Schnittstelle deine ungefähre Position ab. Ich speichere diese Daten nicht dauerhaft.
          </p>
          <p>
            Zur Verbesserung der Treffergenauigkeit wird die Position an eine eigene Firebase Cloud Function übermittelt, die den
            Postleitzahlenbereich bestimmt. Außerdem werden Anfragen an den Dienst <strong>Nominatim</strong> von
            OpenStreetMap (OpenStreetMap Foundation, UK) gestellt, um Ortsvorschläge zu erhalten. Beide Dienste erhalten dafür die
            übermittelten Koordinaten. Rechtsgrundlage ist deine Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Du kannst den
            Zugriff jederzeit verweigern oder in den Browsereinstellungen widerrufen.
          </p>
          <p>
            In Unternehmensprofilen werden Kartenausschnitte von <strong>Google Maps</strong> (Google Ireland Limited) über ein
            eingebettetes iFrame geladen. Erst beim Aufruf des betreffenden Seitenabschnitts wird eine Verbindung zu Google
            hergestellt, wobei Nutzungs- und ggf. Standortdaten übermittelt werden können. Die Einbindung erfolgt auf Grundlage von
            Art. 6 Abs. 1 lit. f DSGVO (anschauliche Darstellung der Standorte). Wenn du dies nicht möchtest, vermeide das Laden der
            Karte.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">8. Externe Inhalte &amp; Spendenlinks</h2>
          <p>
            Für Icons wird <strong>Font Awesome</strong> über das CDN von Cloudflare eingebunden und Animationen stammen von
            <strong>LottieFiles</strong> (unpkg CDN). Beim Laden der entsprechenden Ressourcen werden technische Zugriffsdaten (z. B.
            IP-Adresse) an die jeweiligen Anbieter übertragen. Dies erfolgt auf Grundlage meines berechtigten Interesses an einer
            attraktiven Darstellung (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <p>
            Auf der Support-Seite verlinke ich auf <strong>PayPal</strong>. Erst beim Anklicken des Buttons wirst du zu PayPal
            weitergeleitet. Dort gelten die Datenschutzbestimmungen von PayPal.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">9. Keine Analyse- oder Marketing-Cookies</h2>
          <p>
            Magikey setzt keine Tracking-, Analyse- oder Werbecookies ein. Es werden nur technisch erforderliche Cookies von
            Firebase für den Authentifizierungsprozess gesetzt, sobald du dich einloggst.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">10. Deine Rechte</h2>
          <p>Du hast jederzeit das Recht auf:</p>
          <ul class="list-disc space-y-1 pl-6">
            <li>Auskunft über die verarbeiteten personenbezogenen Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>
            Wende dich dazu jederzeit per E-Mail an
            <a href="mailto:jen@preisser.de" class="text-gold underline-offset-4 hover:underline">jen@preisser.de</a>. Darüber
            hinaus hast du das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.
          </p>
        </section>

        <section class="space-y-3 text-sm text-slate-600">
          <h2 class="text-lg font-semibold text-slate-900">11. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Ich passe diese Datenschutzerklärung an, sobald neue Funktionen hinzukommen oder sich rechtliche Rahmenbedingungen
            ändern. Die jeweils aktuelle Version findest du jederzeit auf dieser Seite.
          </p>
        </section>

        <p class="text-xs text-slate-500">Stand: März 2025</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
