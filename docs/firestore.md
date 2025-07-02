# Firestore Struktur
# Dokumentiert die Collections der App

Die Anwendung nutzt Firebase Firestore. Die Sammlung `companies` speichert Unternehmensprofile.

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
    created_at: timestamp
```

Die Authentifizierung erfolgt über Firebase Auth.
