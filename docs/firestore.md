# Firestore Struktur
# Dokumentiert die Collections der App

Die Anwendung nutzt Firebase Firestore. Die Sammlung `companies` speichert Unternehmensprofile.

```text
companies (Collection)
  <uid> (Document)
    company_name: string
    email: string
    phone: string
    address: map
      volltext: string
      straße: string
      plz: string
      ort: string
      geo: map
        lat: number
        lng: number
      placeId: string
    price: number
    emergency_price: number
    is_247: boolean
    opening_hours: map
    created_at: timestamp
```

Die Authentifizierung erfolgt über Firebase Auth.
