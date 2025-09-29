// Diese Datei lädt Firmendaten aus Firestore.
import { db, isFirebaseConfigured } from '@/firebase'
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
  },
]

function withFallback(result) {
  return result.length ? result : FALLBACK_COMPANIES
}

// Holt alle verifizierten Unternehmen aus der Datenbank.
export async function getCompanies() {
  if (!isFirebaseConfigured || !db) {
    console.warn('Nutze Demo-Daten, da keine Firebase-Konfiguration vorliegt.')
    return FALLBACK_COMPANIES
  }
  try {
    // Nur Unternehmen berücksichtigen, die als "verified" markiert sind.
    const q = query(collection(db, 'companies'), where('verified', '==', true))
    const snap = await getDocs(q)
    // Wandelt die Ergebnisse in einfache JS-Objekte um.
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return withFallback(data)
  } catch (err) {
    // Im Fehlerfall leere Liste zurückgeben, damit die App stabil bleibt.
    console.error('Fehler beim Abrufen der Firmen:', err)
    return FALLBACK_COMPANIES
  }
}

// Holt ein einzelnes Unternehmen anhand seiner ID.
export async function getCompany(id) {
  if (!isFirebaseConfigured || !db) {
    return FALLBACK_COMPANIES.find((company) => company.id === id) || null
  }
  try {
    const snap = await getDoc(doc(db, 'companies', id))
    // Existiert die Firma nicht, geben wir null zurück.
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error('Fehler beim Abrufen der Firma:', err)
    return FALLBACK_COMPANIES.find((company) => company.id === id) || null
  }
}
