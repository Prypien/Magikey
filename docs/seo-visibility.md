# SEO-Strategien für Landingpages und Blogartikel

Die bestehenden Landingpages (`public/schluesseldienst/<stadt>/index.html`) und Blogartikel (`content/blog/`) sind bereits als eigenständige HTML-Dokumente aufgebaut. Für bessere Sichtbarkeit in Suchmaschinen sollten neben der reinen HTML-Struktur folgende Optimierungen umgesetzt werden.

## 1. Technische Basis optimieren
- **Meta-Tags vollständig pflegen:** Pro Seite individuelle `<title>`, `meta name="description"` und `meta name="robots"` (falls nötig) hinterlegen.
- **Headings strukturieren:** Nur eine `<h1>` pro Dokument verwenden, Überschriftenhierarchie (`<h2>`, `<h3>`) logisch gliedern.
- **Canonical URLs setzen:** Doppelte Inhalte über `<link rel="canonical">` vermeiden.
- **Open Graph & Twitter Cards:** Social-Meta-Tags für bessere Darstellung bei Shares ergänzen.
- **PageSpeed im Blick behalten:** Bilder mit `loading="lazy"`, responsive Formate (WebP/AVIF) und minimierte CSS/JS verwenden.

## 2. Inhalte stärken
- **Suchintention treffen:** Keyword-Varianten (z. B. „Schlüsseldienst {Stadt}“, „{Stadt} Türöffnung“) natürlich in Titel, H1, Einleitung und Call-to-Action platzieren.
- **Einzigartige Texte:** Jede Landingpage und jeder Blogartikel sollte eigenständige Texte mit lokalen Details, FAQs und Trust-Elementen enthalten.
- **Rich Snippets nutzen:** FAQ-Abschnitte, Anleitungen oder Bewertungen mit strukturierten Daten (Schema.org) markieren.
- **Interne Verlinkung ausbauen:** Relevante Blogartikel auf passende Landingpages verlinken und umgekehrt.

## 3. Lokale Signale verstärken (Landingpages)
- **NAP-Konsistenz sicherstellen:** Name, Adresse, Telefonnummer identisch zu Google Business Profile halten.
- **Geodaten integrieren:** `schema.org/LocalBusiness` oder `EmergencyService` mit `geo`, `areaServed` und Öffnungszeiten auszeichnen.
- **Kundenbewertungen einbinden:** Auszug aus echten Rezensionen inklusive `AggregateRating`-Schema.
- **Lokale Medien:** Stadtteil-Fotos, Karten oder Notfall-Hinweise einbinden, um Relevanz zu zeigen.

## 4. Blogartikel ausbauen
- **Themencluster planen:** Oberthemen (z. B. „Einbruchschutz“, „Schlosswechsel“) definieren und jeweils mehrere Detailartikel verlinken.
- **Content Freshness:** Veröffentlichungsdatum in `content/blog/metadata.json` pflegen und bei Updates aktualisieren.
- **Medienvielfalt:** Schritt-für-Schritt-Bilder, kurze Videos oder Infografiken hinzufügen – idealerweise mit `alt`-Texten.
- **Lead-Magnet einbauen:** Downloadbare Checklisten oder Newsletter-Formulare zur Lead-Generierung.

## 5. Monitoring & Tests
- **Search Console & Analytics:** Indexierung, Core Web Vitals und Klickpfade überwachen.
- **A/B-Tests:** Varianten von Hero-Absätzen, CTA-Buttons oder FAQ-Blöcken testen (z. B. via Firebase Hosting Rewrites).
- **Broken Links prüfen:** Regelmäßig mit automatisierten Tools (z. B. `npm run lint` + Link-Checker) validieren.

## 6. Workflow-Integration
- **Content-Quellen trennen:** HTML in `public/` nur für statische Landingpages, Markdown in `content/blog/` für Blogartikel.
- **Review-Prozess:** Vor Deploy in Pull Requests auf Meta-Daten, Schema-Auszeichnungen und Interlinks achten.
- **Checkliste pflegen:** Diese Empfehlungen als „SEO-Review-Template“ im Team verankern.

Mit diesen Schritten bleiben Landingpages und Blogartikel nicht nur HTML, sondern liefern Suchmaschinen und Nutzer:innen relevante Signale für eine höhere Sichtbarkeit.
