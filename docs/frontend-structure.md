# Frontend-Ordnerstruktur

Die Struktur unter `src/` wurde in klar abgegrenzte Bereiche gegliedert, damit sich auch neue Teammitglieder schnell zurechtfinden. Jeder Hauptordner fokussiert sich auf eine bestimmte Ebene der Anwendung und kann bei Bedarf weiter unterteilt werden.

## `src/app`

Zentrale Einstiegspunkte und globale Hüllen der Anwendung:

- `App.vue`: Root-Komponente, die das Layout und den Router einbettet.
- `router/`: Globale Routen-Definitionen, Guards und zugehörige Tests.
- `layouts/`: Layout-Komponenten (z. B. `DefaultLayout`, `Header`, `Footer`).
- `theme/`: Globale Styles, Tailwind-Anpassungen und themenspezifische Assets.

## `src/core`

Framework-unabhängige Logik und Infrastruktur, die in mehreren Features genutzt wird:

- `constants/`: Globale Konstanten wie Rollen, Wochentage oder Preistabellen.
- `firebase/`: Initialisierung von Firebase, Hilfsfunktionen und Tests.
- `services/`: Fachlogik und API-Zugriffe (Auth, Firmen, Bewertungen, Storage, …).
- `stores/`: Pinia-Stores inklusive Tests.
- `composables/`: Wiederverwendbare Vue-Composables (z. B. Standortsuche).
- `utils/`: Allgemeine Hilfsfunktionen und deren Tests.

## `src/features`

Feature-spezifische Oberflächen. Jede Domäne besitzt eigene Unterordner mit einer klaren Trennung zwischen Seiten und ggf. Tests:

- `admin/pages`: Admin-Dashboard.
- `auth/pages`: Passwort-Reset, Verifizierung und verwandte Flows.
- `company/pages`: Firmenportal (Dashboard, Registrierung, Verifikation, …).
- `home/pages` & `home/tests`: Startseite und begleitende Tests.
- `static/pages`: Statische Inhalte wie Impressum, Datenschutz oder Support.
- `user/pages`: Endkunden-Ansichten (z. B. Firmendetails).

Weitere domänenspezifische Unterordner (z. B. `components/`, `services/`, `tests/`) können bei Bedarf pro Feature ergänzt werden, ohne andere Bereiche zu berühren.

## `src/ui`

Präsentationskomponenten, die mehrere Features wiederverwenden können:

- `components/common`: Übergreifende UI-Bausteine (Buttons, Modals, Overlays, …).
- `components/company`, `components/user`, `components/reviews`, `components/tracking`, …: Fachbereichs-spezifische UI-Elemente.
- `components/icons`: Lokale Icon-Komponenten (Alias `lucide-vue-next`).

Die Trennung zwischen `features/` und `ui/` hält Seitenlogik und visuelle Bausteine auseinander: Features orchestrieren UI-Komponenten und greifen auf Logik aus `core/` zu.

## Schnellstart

1. **App erweitern:** Neue Seite anlegen → passende Feature-Unterstruktur wählen → View in `pages/` erstellen.
2. **UI-Baustein teilen:** Wiederverwendbare Komponenten gehören in `src/ui/components`. Feature-spezifische Varianten können innerhalb des Feature-Ordners liegen.
3. **Logik einbinden:** Gemeinsame Services, Stores oder Hilfsfunktionen liegen unter `src/core` und können via `@/core/...` importiert werden.

Durch diese Aufteilung lässt sich der Code wie in einer Bibliothek durchsuchen: Einstieg über `app/`, geteilte Logik unter `core/`, Feature-spezifische Views unter `features/` und wiederverwendbare UI unter `ui/`.

## Inhalte außerhalb der Vue-App

Für SEO-optimierte Einstiegsseiten liegen eigenständige HTML-Dokumente außerhalb des Vue-Quellcodes:

- `public/schluesseldienst/<stadt>/index.html`: Lokale Landing Pages wie `schluesseldienst/reutlingen/index.html`, die komplett ohne Vue gerendert und direkt von Firebase Hosting ausgeliefert werden.
- `content/blog/`: Statisch generierte Blog-Artikel in HTML/Markdown, die per `@blog-content` in der App verfügbar gemacht werden.

So bleiben Marketing-Seiten klar von der SPA getrennt, während die Vue-Anwendung weiterhin über Aliasse auf die Inhalte zugreifen kann.
