# Magikey – Vergleichsplattform für Schlüsseldienste

Magikey ist ein webbasiertes Projekt, das auf einem Entwickler‑MacBook entsteht. Ziel ist eine SEO‑optimierte Plattform, auf der Nutzer schnell und transparent den passenden Schlüsseldienst finden können.

## MVP

- **Frontend**: Vue&nbsp;3 und Tailwind CSS
- **Backend / Datenhaltung**: Firebase (Auth, Firestore, Storage)
- **Empfohlene IDE**: Android Studio mit Vue‑Plugin, alternativ VS Code oder WebStorm

### Projektziel

Die Anwendung listet echte Unternehmensprofile mit Preisen und Verfügbarkeiten (z.&nbsp;B. 24/7). Nutzer können Betriebe direkt per Telefon oder ‎Google Maps kontaktieren. Ein verbessertes Design ist geplant.

## Firebase Konfiguration

Kopiere die Datei `.env.example` nach `.env` und fülle deine Firebase‑Credentials ein. Die App liest die Werte zur Laufzeit aus den Umgebungsvariablen.

```bash
VITE_FIREBASE_API_KEY=<dein-key>
VITE_FIREBASE_AUTH_DOMAIN=<deine-domain>
...
```

## Build

```bash
npm run build
```
