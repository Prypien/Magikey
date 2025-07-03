# Magikey – Vergleichsplattform für Schlüsseldienste

Magikey ist ein webbasiertes Projekt, das auf einem Entwickler‑MacBook entsteht. Ziel ist eine SEO‑optimierte Plattform, auf der Nutzer schnell und transparent den passenden Schlüsseldienst finden können.

## MVP

- **Frontend**: Vue&nbsp;3 und Tailwind CSS
- **Backend / Datenhaltung**: Firebase (Auth, Firestore, Storage)
- **Empfohlene IDE**: Android Studio mit Vue‑Plugin, alternativ VS Code oder WebStorm

### Projektziel

Die Anwendung listet echte Unternehmensprofile mit Preisen und Verfügbarkeiten (z.&nbsp;B. 24/7). Nutzer können Betriebe direkt per Telefon oder ‎Google Maps kontaktieren. Ein verbessertes Design ist geplant.

## Schnellstart

1. Repository klonen und Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. `.env.example` kopieren und mit deinen Firebase-Daten füllen:

   ```bash
   cp .env.example .env
   # anschließend die Platzhalter ausfüllen
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

   Die Anwendung ist danach unter <http://localhost:5173> erreichbar.

## Projektstruktur

Der Code ist in `src` organisiert. Wichtige Unterordner:

- `layouts` – gemeinsame Layout-Komponenten wie Header und Footer
- `components/common` – kleine UI-Bausteine (Button, DataRow)
- `components/company` – Firmen-spezifische Widgets und Login
- `components/user` – Komponenten für die Nutzersuche
- `pages` – sämtliche Seiten der Anwendung
- `services` – Logik für Auth und Storage
- `firebase` – Initialisierung von Firebase
- `theme` – globale Tailwind-Stile

Der Alias `@` verweist auf den `src`-Ordner und erleichtert Importpfade.

## Firebase Konfiguration

Kopiere die Datei `.env.example` zu `.env` und fülle deine Firebase‑Credentials ein. Die App liest die Werte zur Laufzeit aus den Umgebungsvariablen.

```bash
VITE_FIREBASE_API_KEY=<dein-key>
VITE_FIREBASE_AUTH_DOMAIN=<deine-domain>
...
VITE_GOOGLE_MAPS_API_KEY=<maps-key>
```

Weitere Details zur Datenstruktur findest du in [docs/firestore.md](docs/firestore.md).

Die Sicherheitsregeln für Firestore und Storage liegen in den Dateien
`firestore.rules` und `storage.rules`. Sie werden über die
`firebase.json` eingebunden und regeln unter anderem, dass nur
verifizierte Firmenprofile öffentlich lesbar sind und Logos nur vom
Eigentümer hochgeladen werden dürfen.

## Build

```bash
npm run build
```

## Linting mit ESLint

ESLint überprüft den Code auf mögliche Fehler und sorgt für einen einheitlichen
Code-Stil. Du kannst die Prüfung mit `npm run lint` ausführen. Die Regeln
befinden sich in `eslint.config.js`.

## Tests

Zum Ausführen der Vitest-Tests verwende

```bash
npm test
```

## Lizenz

Die MIT-Lizenz erlaubt dir, den Code frei zu nutzen und zu ändern.
