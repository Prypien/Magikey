<template>
  <div class="space-y-20 pb-24">
    <section
      class="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-16 text-white shadow-2xl sm:px-12"
    >
      <div class="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" aria-hidden="true"></div>
      <div class="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true"></div>
      <div class="relative grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center">
        <div class="space-y-6">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/80">Reutlingen · Schlüsselnotdienst</p>
          <h1 class="text-3xl font-semibold leading-tight sm:text-4xl">
            Schlüsseldienst in Reutlingen – geprüfte Profis in wenigen Klicks
          </h1>
          <p class="max-w-2xl text-base text-slate-200 sm:text-lg">
            Magikey vergleicht verifizierte Schlüsseldienste aus Reutlingen: transparente Preise, echte Bewertungen und seriöse
            Notdienste für Tag &amp; Nacht. Mit einem Klick gelangst du zur Suche – bereits vorgefiltert auf Reutlingen und 24/7
            einsatzbereit.
          </p>
          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-200">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
              <i class="fa fa-shield"></i>
              Verifizierte Anbieter &amp; Dokumente
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
              <i class="fa fa-star"></i>
              Bewertungen aus echten Einsätzen
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
              <i class="fa fa-clock-o"></i>
              Notdienst in <span class="font-semibold text-white">Ø 30 Min</span> vor Ort
            </span>
          </div>
          <div class="flex flex-wrap gap-4 pt-4">
            <a
              class="inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/80"
              href="/suche"
            >
              Zur Magikey-Suche
              <i class="fa fa-long-arrow-right"></i>
            </a>
            <a
              class="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold/80 hover:text-gold"
              href="#angebote"
            >
              Angebote vergleichen
              <i class="fa fa-angle-down"></i>
            </a>
          </div>
        </div>
        <div class="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg backdrop-blur">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70">Warum Reutlingen Magikey nutzt</p>
          <ul class="space-y-3 text-sm leading-relaxed text-slate-100">
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/90 text-xs font-semibold text-slate-900">1</span>
              <span>Direkter Draht zum besten Notdienst in deiner Nähe – ohne versteckte Zuschläge.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/90 text-xs font-semibold text-slate-900">2</span>
              <span>Transparente Preise für Türöffnungen, Zylinderwechsel und Sicherheitscheck.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/90 text-xs font-semibold text-slate-900">3</span>
              <span>Überwachte Qualitätsstandards: Wir prüfen Lizenzen, Verfügbarkeit und Bewertungen.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="grid gap-6 rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-sm lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div class="space-y-5">
        <header class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Kontakt &amp; Notfall</p>
          <h2 class="text-2xl font-semibold text-slate-900">Magikey Vermittlung Reutlingen</h2>
          <p class="text-sm leading-relaxed text-slate-600">
            NAP-konforme Angaben wie im Google Business Profile: Wir koordinieren geprüfte Schlüsselnotdienste direkt aus der
            Innenstadt. Speichere die Daten für Hausverwaltungen, Sicherheitsdienste oder deinen privaten Notfallplan.
          </p>
        </header>
        <address class="not-italic space-y-2 text-sm text-slate-700">
          <p class="font-semibold text-slate-900">Karlstraße&nbsp;18, 72764 Reutlingen</p>
          <p>
            <a class="text-gold transition hover:text-gold/80" href="tel:+4971215099900">Telefon: +49&nbsp;7121&nbsp;5099900</a>
          </p>
          <p>
            E-Mail:
            <a class="text-gold transition hover:text-gold/80" href="mailto:hilfe@magikey.de">hilfe@magikey.de</a>
          </p>
        </address>
        <div class="flex flex-wrap gap-3 text-xs text-slate-500">
          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <i class="fa fa-clock-o text-gold"></i>
            24/7 erreichbar
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <i class="fa fa-map-marker text-gold"></i>
            Innenstadt, Betzingen, Rommelsbach, Sondelfingen
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <i class="fa fa-shield text-gold"></i>
            Verifizierte Notdienste &amp; Rechnungsnachweis
          </span>
        </div>
      </div>
      <div class="space-y-4 rounded-3xl border border-dashed border-gold/60 bg-gold/10 p-6 text-sm text-slate-700">
        <h3 class="text-base font-semibold text-slate-900">Servicezeiten &amp; Dokumente</h3>
        <ul class="space-y-2">
          <li class="flex items-start gap-2">
            <i class="fa fa-calendar text-gold"></i>
            <span>Öffnungszeiten: Montag–Sonntag <strong>00:00–24:00&nbsp;Uhr</strong></span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa fa-file-text-o text-gold"></i>
            <span>Transparente Preislisten &amp; Einsatzprotokolle vor Buchung einsehbar.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa fa-external-link text-gold"></i>
            <a
              class="text-slate-900 underline decoration-gold/60 decoration-2 underline-offset-4 transition hover:text-gold"
              href="https://maps.app.goo.gl/DkbhmP7zYbX8JEtp9"
              rel="noopener"
              target="_blank"
            >
              Standort in Google Maps öffnen
            </a>
          </li>
        </ul>
        <p class="text-xs text-slate-500">
          Hinweis: Die Magikey-Vermittlung ist kein eigener Aufsperrdienst, sondern stellt geprüfte Betriebe mit lokalen Teams
          zusammen.
        </p>
      </div>
    </section>

    <section id="angebote" class="space-y-12">
      <header class="space-y-3 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold/70">Direkte Hilfe</p>
        <h2 class="text-2xl font-semibold text-slate-900 sm:text-3xl">Leistungen der Schlüsseldienste in Reutlingen</h2>
        <p class="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Alle aufgeführten Partner werden regelmäßig geprüft. Filtere in der Magikey-Suche nach Stadtteilen, Tageszeit oder
          Spezialleistungen wie Sicherheitstechnik, Fahrzeugöffnung oder Smart-Lock-Installation.
        </p>
      </header>
      <div class="grid gap-6 lg:grid-cols-3">
        <article class="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm transition hover:border-gold/50 hover:shadow-lg">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Türöffnung</p>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">Schnell &amp; zerstörungsfrei</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            Durchschnittlich <strong>89&nbsp;€</strong> tagsüber, inklusive Anfahrt im Stadtgebiet. Notdienstaufschläge werden vor
            Auftrag transparent bestätigt.
          </p>
          <ul class="mt-4 space-y-2 text-sm text-slate-600">
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Anfahrt aus Reutlingen und Umgebung</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Dokumentierte Öffnungsmethoden</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>24/7 Hotlines &amp; WhatsApp-Service</span></li>
          </ul>
        </article>
        <article class="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm transition hover:border-gold/50 hover:shadow-lg">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Sicherheit</p>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">Zylinder &amp; Einbruchschutz</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            Von Profilzylindern bis Mehrfachverriegelung: Fachpartner beraten zu VdS-zertifizierten Produkten und koordinieren die
            Montage – auch für Eigentümergemeinschaften.
          </p>
          <ul class="mt-4 space-y-2 text-sm text-slate-600">
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Mobile Ausstellung &amp; Vergleich vor Ort</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Aufmaß &amp; Einbau aus einer Hand</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Dokumentation für Versicherer inklusive</span></li>
          </ul>
        </article>
        <article class="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm transition hover:border-gold/50 hover:shadow-lg">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Digitalisierung</p>
          <h3 class="mt-3 text-lg font-semibold text-slate-900">Smart Locks &amp; Zutrittskontrolle</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            Planung, Installation und Wartung smarter Zutrittssysteme – von Ferienwohnungen über Büros bis hin zu Gewerbehallen.
            Partner begleiten die Auswahl von Hardware, die Integration in bestehende Systeme und Firmware-Updates.
          </p>
          <ul class="mt-4 space-y-2 text-sm text-slate-600">
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Planung für Mehrfamilienhäuser</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Integration in bestehende Systeme</span></li>
            <li class="flex items-start gap-2"><i class="fa fa-check text-gold"></i><span>Digitale Dokumentation &amp; Support</span></li>
          </ul>
        </article>
      </div>
    </section>

    <section class="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <article class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Qualitätsversprechen</p>
        <h2 class="mt-3 text-2xl font-semibold text-slate-900">Wie Magikey Anbieter in Reutlingen auswählt</h2>
        <ul class="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
          <li class="flex items-start gap-3">
            <span class="mt-1 h-2.5 w-2.5 rounded-full bg-gold"></span>
            <span><strong>Verifikation:</strong> Gewerbeanmeldung, Versicherungen und Identität werden einmalig geprüft und laufend überwacht.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 h-2.5 w-2.5 rounded-full bg-gold"></span>
            <span><strong>Service-Level:</strong> Reaktionszeit, Transparenz und Kundenfeedback fließen in das Ranking der Trefferliste ein.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 h-2.5 w-2.5 rounded-full bg-gold"></span>
            <span><strong>Nachweise:</strong> Eingestellte Preise, Rechnungsbeispiele und Einsatzberichte sind jederzeit abrufbar.</span>
          </li>
        </ul>
        <div class="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-600">
          <p>
            Tipp: Speichere deine Favoriten direkt in Magikey. Bei einem Notfall kannst du sie mit einem Klick kontaktieren oder an Nachbar:innen weiterleiten.
          </p>
        </div>
      </article>
      <aside class="flex flex-col gap-6 rounded-3xl border border-white/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <header>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">FAQ &amp; Beratung</p>
          <h2 class="mt-2 text-xl font-semibold">Fragen zum Schlüsseldienst in Reutlingen</h2>
        </header>
        <dl class="space-y-5 text-sm text-slate-200">
          <div>
            <dt class="font-semibold text-white">Wie schnell ist der Notdienst bei mir?</dt>
            <dd class="mt-1 leading-relaxed">
              In der Regel innerhalb von 20–40 Minuten. Bei hoher Auslastung informieren wir dich über Alternativen aus Nachbarorten.
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-white">Welche Kosten muss ich einkalkulieren?</dt>
            <dd class="mt-1 leading-relaxed">
              Türöffnungen starten tagsüber bei ca. 89&nbsp;€. Zuschläge für Nacht, Wochenende oder Material werden vor Bestätigung transparent ausgewiesen.
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-white">Kann ich einen Termin planen?</dt>
            <dd class="mt-1 leading-relaxed">
              Ja. Wähle in der Magikey-Suche ein Zeitfenster und hinterlasse Notizen – der Betrieb bestätigt den Termin digital.
            </dd>
          </div>
        </dl>
        <a
          class="inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-gold/90"
          href="/suche"
        >
          Jetzt verifizierte Anbieter anzeigen
          <i class="fa fa-long-arrow-right"></i>
        </a>
      </aside>
    </section>

    <section id="bewertungen" class="rounded-[2.5rem] border border-slate-200 bg-white/90 p-10 shadow-sm">
      <header class="space-y-2 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Kundenerfahrungen</p>
        <h2 class="text-2xl font-semibold text-slate-900 sm:text-3xl">Echte Bewertungen aus Reutlingen</h2>
        <p class="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600">
          Unser Bewertungsmonitor aggregiert Rückmeldungen aus Einsätzen, Rechnungsuploads und Follow-up-Calls. Der aktuelle Score
          liegt bei <strong>4,9&nbsp;/&nbsp;5</strong> aus 128 verifizierten Einsätzen.
        </p>
      </header>
      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <article class="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3 text-gold">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star-half-o"></i>
            <span class="text-sm font-semibold text-slate-900">4,8 / 5</span>
          </div>
          <p class="text-sm leading-relaxed text-slate-600">
            „Innerhalb von 25 Minuten stand der Techniker vor Ort in Betzingen. Kosten wurden vorab bestätigt, Rechnung kam digital
            inklusive Fotos vom Zylinderwechsel.“
          </p>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nadine K., Hausverwaltung Südtor</p>
        </article>
        <article class="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3 text-gold">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <span class="text-sm font-semibold text-slate-900">5,0 / 5</span>
          </div>
          <p class="text-sm leading-relaxed text-slate-600">
            „Notöffnung in Rommelsbach nachts um halb eins – der Betrieb hat zusätzlich den defekten Beschlag gesichert und Tipps
            für ein Smart-Lock-Upgrade gegeben. Super Service!“
          </p>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Thomas W., Eigentümergemeinschaft Lichtenwald</p>
        </article>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <article class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Reutlingen im Blick</p>
        <h2 class="mt-3 text-2xl font-semibold text-slate-900">Stadtteile &amp; Einsatzgebiet</h2>
        <p class="mt-4 text-sm leading-relaxed text-slate-600">
          Unsere Partner decken alle 12 Stadtbezirke ab – von der Altstadt über Betzingen bis Orschel-Hagen. Für Randlagen wie
          Degerschlacht oder Gönningen prüfen wir parallel Betriebe aus Eningen unter Achalm und Tübingen.
        </p>
        <ul class="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <li class="flex items-start gap-2"><i class="fa fa-map-marker text-gold"></i><span>Altstadt &amp; Oststadt: schnelle Türöffnungen und Schlüsselverwaltung für Wohnblöcke.</span></li>
          <li class="flex items-start gap-2"><i class="fa fa-map-marker text-gold"></i><span>Betzingen &amp; Sondelfingen: 24/7 Notdienst mit Fahrzeugöffnung.</span></li>
          <li class="flex items-start gap-2"><i class="fa fa-map-marker text-gold"></i><span>Rommelsbach &amp; Mittelstadt: Smart-Lock-Betreuung und Mehrfamilienhäuser.</span></li>
          <li class="flex items-start gap-2"><i class="fa fa-map-marker text-gold"></i><span>Pliezhausen &amp; Umgebung: Kooperationen mit Nachbarstädten für Spitzenzeiten.</span></li>
        </ul>
      </article>
      <aside class="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div class="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200">
          <iframe
            class="h-full w-full"
            loading="lazy"
            referrerpolicy="no-referrer"
            src="https://www.openstreetmap.org/export/embed.html?bbox=9.1500%2C48.4500%2C9.2600%2C48.5400&amp;layer=mapnik&amp;marker=48.4914%2C9.2043"
            title="Karte von Reutlingen"
          ></iframe>
        </div>
        <p class="mt-3 text-xs text-slate-500">
          Karte: Einsatzgebiet rund um Karlstraße 18. Für Einsätze außerhalb des BBOX-Bereichs vermitteln wir Partner aus dem Landkreis Reutlingen.
        </p>
      </aside>
    </section>

    <section class="rounded-[2.5rem] border border-slate-200 bg-white/90 p-10 shadow-sm">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
        <div class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Nächste Schritte</p>
          <h2 class="text-2xl font-semibold text-slate-900">So funktioniert die Reutlingen-Suche</h2>
          <ol class="space-y-4 text-sm leading-relaxed text-slate-600">
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/90 text-sm font-semibold text-slate-900">1</span>
              <span>Auf „Zur Magikey-Suche“ tippen – wir zeigen geprüfte Schlüsseldienste auf einen Blick.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/90 text-sm font-semibold text-slate-900">2</span>
              <span>Vergleiche Trefferliste, Notdienst-Status und Preise. Filtere bei Bedarf nach 24/7 oder Spezialleistungen.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/90 text-sm font-semibold text-slate-900">3</span>
              <span>Direkt anrufen, WhatsApp schreiben oder den Rückruf in Magikey buchen.</span>
            </li>
          </ol>
        </div>
        <div class="space-y-4 rounded-3xl border border-dashed border-gold/60 bg-gold/10 p-8 text-sm text-slate-700">
          <h3 class="text-lg font-semibold text-slate-900">Bonus für Reutlingen</h3>
          <p>
            Registriere kostenlos dein Unternehmen in Magikey und erscheine in regionalen Rankings, Landing Pages und Notdienst-Alerts – inklusive Statistik über Anfragen aus Reutlingen.
          </p>
          <a
            class="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-gold/90"
            href="/register"
          >
            Unternehmen anmelden
            <i class="fa fa-long-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <section class="rounded-[2.5rem] border border-slate-200 bg-white/90 p-10 shadow-sm">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Ratgeber &amp; Prävention</p>
          <h2 class="text-2xl font-semibold text-slate-900">Smart-Lock-Sicherheit mitdenken</h2>
          <p class="text-sm leading-relaxed text-slate-600">
            Du planst ein Upgrade auf digitale Zutrittssysteme? Unser Blogartikel
            <a class="text-gold underline-offset-4 hover:underline" href="/blog/smart-lock-sicherheit-trends-2026">„Smart Locks 2026: Sicherheits-Blueprint für dein Zuhause“</a>
            zeigt, wie du Audit-Checklisten, Firmware-Fenster und Notdienste kombinierst. Ergänze den Leitfaden direkt mit deinen Reutlingen-Kontakten in Magikey.
          </p>
        </div>
        <div class="space-y-4 rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-gold/70">Empfohlene Aktion</p>
          <h3 class="text-xl font-semibold">Checklisten downloaden &amp; verlinken</h3>
          <p class="text-sm text-slate-200">
            Sichere dir die Smart-Lock-Vorlage, ergänze lokale Ansprechpartner und lade die Datei im Magikey-Dashboard hoch. So greifen Team und Bewohner:innen auf geprüfte Abläufe zurück.
          </p>
          <a
            class="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-gold/90"
            href="https://magikey.de/resources/smart-lock-audit.pdf"
            rel="noopener"
          >
            PDF-Blueprint öffnen
            <i class="fa fa-long-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>

    <footer class="rounded-[2rem] border border-slate-200 bg-slate-900 px-6 py-10 text-sm text-slate-300">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {{ currentYear }} Magikey. Alle Rechte vorbehalten.</p>
        <div class="flex flex-wrap gap-6">
          <a class="transition hover:text-white" href="/impressum">Impressum</a>
          <a class="transition hover:text-white" href="/datenschutz">Datenschutz</a>
          <a class="transition hover:text-white" href="/blog">Magikey Blog</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'

const currentYear = computed(() => new Date().getFullYear())

const businessStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EmergencyService',
  '@id': 'https://www.magikey.de/schluesseldienst/reutlingen#business',
  name: 'Magikey Schlüsseldienst-Vermittlung Reutlingen',
  url: 'https://www.magikey.de/schluesseldienst/reutlingen',
  image: 'https://www.magikey.de/logo.png',
  description:
    'Magikey vergleicht verifizierte Schlüsseldienste in Reutlingen. Transparente Preise, echte Bewertungen und schnelle Notdienste – direkt vorgefiltert für deine Stadt.',
  telephone: '+49 7121 5099900',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Karlstraße 18',
    addressLocality: 'Reutlingen',
    postalCode: '72764',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.4914,
    longitude: 9.2043,
  },
  areaServed: {
    '@type': 'City',
    name: 'Reutlingen',
    alternateName: 'Reutlingen, Baden-Württemberg',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.4914,
      longitude: 9.2043,
    },
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.9,
    reviewCount: 128,
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Nadine K.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 4.8,
        bestRating: 5,
      },
      reviewBody:
        'Türöffnung in Reutlingen-Betzingen mit transparenter Preisbestätigung und digitalem Einsatzprotokoll.',
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Thomas W.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
      },
      reviewBody:
        'Notöffnung und Beschlagsicherung in Rommelsbach – inklusive Empfehlung für Smart-Lock-Upgrade.',
    },
  ],
  serviceType: ['Türöffnung', 'Schlüsselnotdienst', 'Smart-Lock Installation'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Schlüsseldienst Leistungen in Reutlingen',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Türöffnung & Notdienst',
        price: '89.00',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Zylinderwechsel & Sicherheitstechnik',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Smart-Lock Beratung & Montage',
        priceCurrency: 'EUR',
      },
    ],
  },
  sameAs: ['https://www.facebook.com/magikey', 'https://www.instagram.com/magikey_de'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+49 7121 5099900',
    areaServed: 'DE',
    availableLanguage: ['de', 'en'],
  },
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wie schnell ist der Notdienst bei mir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In der Regel sind unsere Partner innerhalb von 20 bis 40 Minuten vor Ort. Bei hoher Auslastung informieren wir über Alternativen aus Nachbarorten.',
      },
    },
    {
      '@type': 'Question',
      name: 'Welche Kosten muss ich einkalkulieren?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Türöffnungen starten tagsüber bei circa 89 Euro. Zuschläge für Nacht, Wochenende oder Material werden vor Bestätigung transparent ausgewiesen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kann ich einen Termin planen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Du kannst in der Magikey-Suche ein Zeitfenster wählen und Notizen hinterlassen – der Betrieb bestätigt den Termin digital.',
      },
    },
  ],
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Magikey',
      item: 'https://www.magikey.de/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Schlüsseldienst',
      item: 'https://www.magikey.de/schluesseldienst',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Reutlingen',
      item: 'https://www.magikey.de/schluesseldienst/reutlingen',
    },
  ],
}

useHead(() => ({
  script: [
    {
      key: 'locksmith-reutlingen-business',
      type: 'application/ld+json',
      children: JSON.stringify(businessStructuredData, null, 2),
    },
    {
      key: 'locksmith-reutlingen-faq',
      type: 'application/ld+json',
      children: JSON.stringify(faqStructuredData, null, 2),
    },
    {
      key: 'locksmith-reutlingen-breadcrumbs',
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbStructuredData, null, 2),
    },
  ],
}))
</script>
