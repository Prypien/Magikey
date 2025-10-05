// Diese Datei lädt Firmendaten aus Firestore.
import { db, isFirebaseConfigured } from '@/core/firebase'
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore'

const FALLBACK_COMPANIES = [
  {
    id: 'demo-berlin',
    company_name: 'Schlüsselservice Berlin Mitte',
    verified: true,
    logo_url:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=160&h=160&q=80',
    phone: '+49 30 1234567',
    whatsapp: '+49 151 2345678',
    postal_code: '10115',
    city: 'Berlin',
    address: 'Invalidenstraße 12',
    coordinates: { lat: 52.53084, lng: 13.3862 },
    service_radius_km: 25,
    price: 69,
    emergency_price: 149,
    is_247: true,
    lock_types: ['house', 'car_mechanical', 'smart'],
    opening_hours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' },
    },
    verification: {
      status: 'verified',
      google_place_url: 'https://maps.google.com/?cid=123',
      google_reviews_url: 'https://maps.google.com/?cid=123#reviews',
      website_url: 'https://schluesselservice-berlin.de',
      price_statement: 'Festpreise telefonisch bestätigt',
      association_member: true,
      register_number: 'HRB 12345',
      assigned_admin: 'Trust Team',
    },
    contact_email: 'kontakt@schluesselservice-berlin.de',
  },
  {
    id: 'demo-hamburg',
    company_name: 'Hansestadt Schlüsselnotdienst',
    verified: true,
    logo_url:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=160&h=160&q=80',
    phone: '+49 40 9876543',
    whatsapp: '+49 160 9876543',
    postal_code: '20095',
    city: 'Hamburg',
    address: 'Spitalerstraße 7',
    coordinates: { lat: 53.55026, lng: 10.00138 },
    service_radius_km: 20,
    price: 59,
    emergency_price: 129,
    is_247: false,
    lock_types: ['house', 'bike', 'padlock'],
    opening_hours: {
      monday: { open: '07:00', close: '19:00' },
      tuesday: { open: '07:00', close: '19:00' },
      wednesday: { open: '07:00', close: '19:00' },
      thursday: { open: '07:00', close: '19:00' },
      friday: { open: '07:00', close: '19:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '00:00', close: '00:00' },
    },
    verification: {
      status: 'verified',
      google_place_url: 'https://maps.google.com/?cid=456',
      google_reviews_url: 'https://maps.google.com/?cid=456#reviews',
      website_url: 'https://hansestadt-schluessel.de',
      price_statement: 'Preise per Zertifikat bestätigt',
      association_member: true,
      register_number: 'HRB 67890',
      assigned_admin: 'Trust Team',
    },
    contact_email: 'service@hansestadt-schluessel.de',
  },
]

function cloneValue(value) {
  if (value === undefined || value === null) return value
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value))
}

function cloneFallbackCompanies() {
  return cloneValue(FALLBACK_COMPANIES)
}

function cloneFallbackCompany(id) {
  const fallback = FALLBACK_COMPANIES.find((company) => company.id === id)
  return fallback ? cloneValue(fallback) : null
}

function withFallback(result) {
  return Array.isArray(result) && result.length ? result : cloneFallbackCompanies()
}

// Holt alle verifizierten Unternehmen aus der Datenbank.
export async function getCompanies() {
  if (!isFirebaseConfigured || !db) {
    console.warn('Nutze Demo-Daten, da keine Firebase-Konfiguration vorliegt.')
    return cloneFallbackCompanies()
  }
  try {
    // Nur Unternehmen berücksichtigen, die als "verified" markiert sind.
    const q = query(collection(db, 'companies'), where('verified', '==', true))
    const snap = await getDocs(q)
    // Wandelt die Ergebnisse in einfache JS-Objekte um.
    const data = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((company) => !company.is_admin)
    return withFallback(data)
  } catch (err) {
    // Im Fehlerfall leere Liste zurückgeben, damit die App stabil bleibt.
    console.error('Fehler beim Abrufen der Firmen:', err)
    return cloneFallbackCompanies()
  }
}

// Holt ein einzelnes Unternehmen anhand seiner ID.
export async function getCompany(id) {
  if (!isFirebaseConfigured || !db) {
    return cloneFallbackCompany(id)
  }
  try {
    const snap = await getDoc(doc(db, 'companies', id))
    // Existiert die Firma nicht, geben wir null zurück.
    if (!snap.exists()) return null
    const data = { id: snap.id, ...snap.data() }
    const verificationStatus = data.verification?.status
    if (data.is_admin || data.verified !== true || verificationStatus !== 'verified') {
      return null
    }
    return data
  } catch (err) {
    console.error('Fehler beim Abrufen der Firma:', err)
    return cloneFallbackCompany(id)
  }
}

function isCompanyVerified(company) {
  if (!company) return false
  if (company.verified === true) return true
  const status = company.verification?.status
  return status === 'verified'
}

export async function resolveCompanyPortalRoute(uid) {
  if (!uid) return 'dashboard'
  if (!isFirebaseConfigured || !db) return 'dashboard'

  try {
    const snap = await getDoc(doc(db, 'companies', uid))
    if (!snap.exists()) {
      return 'verification-hold'
    }

    const data = snap.data()
    return isCompanyVerified(data) ? 'dashboard' : 'verification-hold'
  } catch (err) {
    console.error('Fehler beim Prüfen des Firmenstatus:', err)
    return 'dashboard'
  }
}
