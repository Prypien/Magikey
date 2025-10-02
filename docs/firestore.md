# Firestore Struktur
# Dokumentiert die Collections der App

Die Anwendung nutzt Firebase Firestore mit den folgenden zentralen Collections:

## companies

Speichert Unternehmensprofile inklusive Verifizierungsstatus. Jeder Eintrag entspricht einem registrierten Unternehmen.

```text
companies (Collection)
  <uid> (Document)
    company_name: string
    email: string
    phone: string
    address: string
    postal_code: string
    city: string
    price: number
    emergency_price: number
    is_247: boolean
    opening_hours: map
      monday: map { open: string, close: string }
      ...
    verified: boolean
    verification: map
    created_at: timestamp
    updated_at: timestamp
```

## notify_me

Enthält Anfragen von Nutzer:innen, die benachrichtigt werden möchten, sobald neue Funktionen verfügbar sind.

```text
notify_me (Collection)
  <auto-id> (Document)
    email: string
    created_at: timestamp
```

## reviews

Sammelt eigene Plattform-Bewertungen, die unabhängig von externen Quellen gepflegt werden.

```text
reviews (Collection)
  <auto-id> (Document)
    author: string
    rating: number (1-5)
    comment: string
    created_at: timestamp
    published: boolean
```

## users

Hinterlegt Rollenzuweisungen (admin | company | user) für authentifizierte Accounts.

```text
users (Collection)
  <uid> (Document)
    email: string
    role: string
    created_at: timestamp
    updated_at: timestamp
```

Die Authentifizierung erfolgt über Firebase Auth und die Firestore-Regeln prüfen das `role`-Feld, um Admin-Zugriff freizuschalten.
