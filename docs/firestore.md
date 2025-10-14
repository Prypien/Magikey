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
    email_lowercase: string
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
      status: string ('pending' | 'in_review' | 'verified' | 'rejected')
      google_place_url: string
      google_reviews_url: string
      website_url: string
      price_statement: string
      association_member: boolean
      register_number: string
      assigned_admin: string
      admin_notes: string
      last_update: timestamp
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
    email_lowercase: string
    role: string
    created_at: timestamp
    updated_at: timestamp
```

Die Authentifizierung erfolgt über Firebase Auth und die Firestore-Regeln prüfen das `role`-Feld, um Admin-Zugriff freizuschalten.

## registration_email_requests

Speichert interne Requests, eine erneute Registrierungsmail an Unternehmen zu senden. Wird ausschließlich vom Admin-Dashboard geschrieben.

```text
registration_email_requests (Collection)
  <auto-id> (Document)
    company_id: string
    company_name: string
    email: string
    requested_at: timestamp
    triggered_by: string
    status: string
```

## review_requests

Erfasst Kund:innen, die aktiv um eine Bewertung gebeten werden möchten. Einträge können nur durch verifizierte Formulare erstellt werden und enthalten keine personenbezogenen Daten außer der Kontakt-E-Mail.

```text
review_requests (Collection)
  <auto-id> (Document)
    company_id: string
    company_name: string
    contact_type: string
    customer_email: string
    created_at: timestamp
    status: string
```

## tracking_requests

Hält Tracking-Anfragen fest, die Kund:innen anfordern, wenn ein Unternehmen unterwegs ist. Der Datensatz dient als Grundlage für Echtzeitstatus-Updates via Client-Secret.

```text
tracking_requests (Collection)
  <auto-id> (Document)
    companyId: string
    companyName: string
    companyLocation: map { lat: number, lng: number }
    userLocation: map { lat: number, lng: number }
    distanceKm: number
    durationMinutes: number
    requestedAt: timestamp
    eta: timestamp
    status: string ('en_route' | 'arrived' | 'cancelled')
    clientSecret: string
    createdAt: timestamp
    updatedAt: timestamp
    endedAt: timestamp | null
```
