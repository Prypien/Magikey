<template>
  <section class="page-wrapper">
    <div class="glass-card p-8 sm:p-12 space-y-10">
      <header class="space-y-4 text-center">
        <h1 class="section-heading">Unterstütze Magikey</h1>
        <p class="section-subtitle">
          Magikey ist ein unabhängiges Projekt, das faire und transparente Schlüsseldienste sichtbar macht. Es wurde im Rahmen
          eines Hochschulprojekts von einem Studenten entwickelt und wird seitdem eigenständig weitergeführt. Mit einem
          freiwilligen Beitrag hilfst du uns, Entwicklung, Infrastruktur und Support langfristig zu sichern.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article class="muted-panel space-y-3">
          <h2 class="text-lg font-semibold text-slate-900">Warum spenden?</h2>
          <p class="text-sm text-slate-600">
            Wir finanzieren uns nicht über versteckte Provisionen. Deine Unterstützung ermöglicht es uns, neutrale Informationen bereitzustellen und regionale Betriebe sichtbar zu machen – und gibt dem studentischen Entwickler die Möglichkeit, Magikey auch nach dem Projekt eigenständig weiterzuentwickeln.
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

      <div class="grid gap-6 md:grid-cols-2">
        <div
          class="flip-card"
          :class="{ 'is-flipped': paypalFlipped }"
          @click="paypalFlipped = !paypalFlipped"
          role="button"
          tabindex="0"
          :aria-pressed="paypalFlipped ? 'true' : 'false'"
          @keyup.enter.prevent="paypalFlipped = !paypalFlipped"
          @keyup.space.prevent="paypalFlipped = !paypalFlipped"
        >
          <div class="flip-card-inner">
            <article class="flip-card-face flip-card-front muted-panel space-y-4 text-center">
              <h2 class="text-lg font-semibold text-slate-900">Unterstützen via PayPal</h2>
              <p class="text-sm text-slate-600">
                Tippe oder klicke, um unseren PayPal-Link aufzurufen und Magikey direkt mit einer Spende zu fördern.
              </p>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                Details anzeigen
              </button>
            </article>

            <article class="flip-card-face flip-card-back muted-panel space-y-4 text-center">
              <h2 class="text-lg font-semibold text-slate-900">PayPal-Spende</h2>
              <p class="text-sm text-slate-600" v-if="hasPaypalLink">
                Über den Button gelangst du zu unserem offiziellen PayPal.me-Profil. Vielen Dank für deine Unterstützung!
              </p>
              <p class="text-sm text-slate-500" v-else>
                Aktuell ist kein PayPal-Link hinterlegt. Wende dich bei Interesse an
                <a href="mailto:info@magikey.de" class="text-gold underline-offset-4 hover:underline">info@magikey.de</a>.
              </p>

              <a
                v-if="hasPaypalLink"
                :href="paypalLink"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-[#003087] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#012169] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/60"
                target="_blank"
                rel="noopener"
                @click.stop
              >
                <i class="fa fa-heart"></i>
                Jetzt über PayPal spenden
              </a>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                @click.stop="paypalFlipped = false"
              >
                Zurück
              </button>
            </article>
          </div>
        </div>

        <div
          class="flip-card"
          :class="{ 'is-flipped': bankFlipped }"
          @click="bankFlipped = !bankFlipped"
          role="button"
          tabindex="0"
          :aria-pressed="bankFlipped ? 'true' : 'false'"
          @keyup.enter.prevent="bankFlipped = !bankFlipped"
          @keyup.space.prevent="bankFlipped = !bankFlipped"
        >
          <div class="flip-card-inner">
            <article class="flip-card-face flip-card-front muted-panel space-y-4 text-center">
              <h2 class="text-lg font-semibold text-slate-900">Banküberweisung</h2>
              <p class="text-sm text-slate-600">
                Du spendest lieber per Überweisung? Öffne die Karte, um unsere Bankverbindung zu sehen.
              </p>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                Details anzeigen
              </button>
            </article>

            <article class="flip-card-face flip-card-back muted-panel space-y-4 text-center">
              <h2 class="text-lg font-semibold text-slate-900">Bankverbindung</h2>
              <div class="space-y-2">
                <p class="text-sm font-medium text-slate-700">IBAN</p>
                <p class="text-base font-semibold tracking-wide text-slate-900" aria-live="polite">{{ iban }}</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                @click.stop="copyIban"
              >
                <i class="fa fa-copy"></i>
                IBAN kopieren
              </button>
              <p v-if="copyStatus" class="text-xs text-slate-500">{{ copyStatus }}</p>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                @click.stop="bankFlipped = false"
              >
                Zurück
              </button>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const defaultPaypalLink = 'https://www.paypal.com/paypalme/JenPreisser29012002'
const paypalLink = import.meta.env.VITE_PAYPAL_ME_URL || defaultPaypalLink

const hasPaypalLink = computed(() => Boolean(paypalLink))

const paypalFlipped = ref(false)
const bankFlipped = ref(false)

const iban = '4752110000753995'
const copyStatus = ref('')

const copyIban = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(iban)
      copyStatus.value = 'IBAN kopiert!'
    } else {
      copyStatus.value = 'Kopieren nicht verfügbar. Bitte manuell übernehmen.'
    }
  } catch (error) {
    copyStatus.value = 'Kopieren fehlgeschlagen. Bitte versuche es erneut.'
  }

  if (copyStatus.value) {
    setTimeout(() => {
      copyStatus.value = ''
    }, 4000)
  }
}
</script>

<style scoped>
.flip-card {
  position: relative;
  perspective: 1600px;
  cursor: pointer;
}

.flip-card:focus {
  outline: none;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s;
  transform-style: preserve-3d;
  min-height: 280px;
}

.flip-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}
</style>
