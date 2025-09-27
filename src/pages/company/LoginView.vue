<!-- Diese Datei zeigt die Login-Seite für Firmen. -->
<template>
  <section class="page-wrapper">
    <div class="grid items-start gap-8 lg:grid-cols-[1.05fr,0.95fr]">
      <div class="glass-card p-8 sm:p-10">
        <div class="space-y-6">
          <span class="badge-neutral">Für Partnerbetriebe</span>
          <h1 class="section-heading">Melde dich bei deinem Magikey-Konto an</h1>
          <p class="section-subtitle">
            Verwalte dein Profil, halte Preise & Leistungen aktuell und bleibe für Kund:innen sichtbar – alles in einer Oberfläche.
          </p>
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <i class="fa fa-bolt text-[0.65rem]"></i>
              </span>
              <span>Aktualisiere Öffnungszeiten und Notdienst-Einsatzzeiten in Echtzeit.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <i class="fa fa-star text-[0.65rem]"></i>
              </span>
              <span>Heb dich mit verifizierten Angaben von der Konkurrenz ab.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold">
                <i class="fa fa-rocket text-[0.65rem]"></i>
              </span>
              <span>Nutze das Dashboard für schnelle Einblicke in dein Profil.</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="glass-card p-8 sm:p-10">
        <div class="space-y-6 text-center">
          <h2 class="section-heading">Login für Unternehmen</h2>
          <p class="section-subtitle">
            Gib deine Zugangsdaten ein, um dein Profil zu bearbeiten und neue Kund:innen zu gewinnen.
          </p>
        </div>
        <div class="mt-8">
          <Login />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import Login from '@/components/company/Login.vue'
</script>
