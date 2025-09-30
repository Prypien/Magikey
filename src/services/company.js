// Diese Datei lädt Firmendaten aus Firestore.
import { db, isFirebaseConfigured } from '@/firebase'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  orderBy,
} from 'firebase/firestore'

const FALLBACK_COMPANIES = [
  {
    id: 'demo-berlin',
    company_name: 'Schlüsselservice Berlin Mitte',
    verified: true,
    is_admin: true,
    logo_url:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=160&h=160&q=80',
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
    verification_status: 'verified',
    google_place_url:
      'https://www.google.com/maps/place/Schl%C3%BCsselservice+Berlin+Mitte/@52.5306432,13.384997,17z',
    website_url: 'https://schluesselservice-mitte.example',
    price_comment: 'Faire Festpreise inklusive Anfahrt – transparent ausgewiesen.',
    association_member: true,
    security_badge: 'Verband Deutscher Schlüsseldienste',
    review_policy_note:
      'Bewertungen werden ausschließlich über die Magikey-Plattform entgegengenommen und geprüft.',
  },
  {
    id: 'demo-hamburg',
    company_name: 'Hansestadt Schlüsselnotdienst',
    verified: true,
    verification_status: 'verified',
    is_admin: false,
    logo_url:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=160&h=160&q=80',
    postal_code: '20095',
    city: 'Hamburg',
    address: 'Spitalerstraße 7',
    price: 59,
    emergency_price: 129,
    is_247: false,
    lock_types: ['house', 'bike', 'padlock'],
    google_place_url:
      'https://www.google.com/maps/place/Hansestadt+Schl%C3%BCsselnotdienst/@53.550341,10.001505,17z',
    website_url: 'https://hansestadt-schluessel.example',
    price_comment:
      'Grundpreis werktags 59 € – Wochenend- und Nachtzuschläge laut Transparenzliste.',
    association_member: false,
    security_badge: 'Magikey geprüft',
    review_policy_note:
      'Kund:innen erhalten nach jedem Auftrag automatisch einen Bewertungsbogen.',
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

// Lädt alle Unternehmen inklusive Pending-Status für die Admin-Ansicht.
export async function getCompaniesForAdmin() {
  if (!isFirebaseConfigured || !db) {
    return FALLBACK_COMPANIES.map((company) => ({ ...company, id: company.id }))
  }

  try {
    const q = query(collection(db, 'companies'), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Fehler beim Abrufen der Firmenliste für Admins:', err)
    return FALLBACK_COMPANIES.map((company) => ({ ...company, id: company.id }))
  }
}

// Filtert Unternehmen, deren Verifizierung noch aussteht.
export async function getPendingCompanies() {
  const companies = await getCompaniesForAdmin()
  return companies.filter((company) => (company.verification_status || (company.verified ? 'verified' : 'pending')) !== 'verified')
}

// Aktualisiert administrative Felder eines Unternehmens.
export async function updateCompanyAdmin(id, payload) {
  if (!id) throw new Error('Ungültige Unternehmens-ID')

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase nicht konfiguriert – lokale Demo-Daten werden aktualisiert.')
    const index = FALLBACK_COMPANIES.findIndex((company) => company.id === id)
    if (index !== -1) {
      FALLBACK_COMPANIES[index] = { ...FALLBACK_COMPANIES[index], ...payload }
      return FALLBACK_COMPANIES[index]
    }
    return null
  }

  try {
    const companyRef = doc(db, 'companies', id)
    await updateDoc(companyRef, payload)
    const snap = await getDoc(companyRef)
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error('Fehler beim Aktualisieren der Firmendaten:', err)
    throw err
  }
}
