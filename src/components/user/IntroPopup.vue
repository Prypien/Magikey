<!-- Exit-Intent-Popup, das nach Feedback zum Schlüsseldienst fragt. -->
<template>
<section class="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
  <div class="absolute -top-32 right-[-40%] h-64 w-64 rounded-full bg-gold opacity-20 blur-3xl"></div>
  <div class="absolute -bottom-24 left-[-30%] h-56 w-56 rounded-full bg-slate-200/40 blur-3xl"></div>

  <div class="relative flex flex-col gap-6 p-6 sm:p-10">
    <button
      class="absolute right-6 top-6 text-slate-300 transition hover:text-slate-500"
      @click="$emit('close')"
      aria-label="Schließen"
    >
      <i class="fa fa-times text-lg"></i>
    </button>

    <div class="flex items-center gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-3xl text-gold bg-opacity-10">
        <i class="fa fa-unlock-alt"></i>
      </div>
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold text-opacity-70">
          Bevor du gehst
        </p>
        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">Alles geklappt?</h1>
      </div>
    </div>

    <p class="text-sm leading-relaxed text-slate-600 sm:text-base">
      Konntest du dein Schloss öffnen oder brauchst du noch Unterstützung? Sag uns kurz Bescheid, damit wir
      dir gegebenenfalls den richtigen Kontakt empfehlen können.
    </p>

    <div class="grid gap-3 sm:grid-cols-2">
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        type="button"
        @click="$emit('close')"
      >
        <i class="fa fa-check-circle"></i>
        Schloss ist offen
      </button>

      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-gold bg-white px-4 py-3 text-sm font-semibold text-gold shadow-sm transition hover:bg-amber-50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        type="button"
        @click="$emit('help')"
      >
        <i class="fa fa-life-ring"></i>
        Brauche noch Hilfe
      </button>
    </div>

    <div class="rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-500">
      <p class="font-semibold text-slate-600">Unser Tipp</p>
      <p>
        Teile deine Erfahrung nach der Rettung mit anderen – so helfen wir gemeinsam, faire Schlüsseldienste sichtbar zu
        machen.
      </p>
    </div>
  </div>
</section>
</template>

<script setup>
defineEmits(['close', 'help'])
</script>

