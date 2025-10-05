<!-- Diese Datei zeigt die 404-Fehlerseite. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-2xl">
      <div class="glass-card p-8 sm:p-10 text-center">
        <div class="space-y-4">
          <div class="flex items-center justify-center">
            <span class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/25 text-3xl text-gold">
              <i class="fa fa-compass"></i>
            </span>
          </div>
          <h1 class="section-heading">404 – Seite nicht gefunden</h1>
          <p class="section-subtitle">
            Der gewünschte Inhalt existiert nicht mehr oder wurde verschoben. Kehre zur Startseite zurück und beginne eine neue Suche.
          </p>
          <router-link to="/" class="btn">Zur Startseite</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

