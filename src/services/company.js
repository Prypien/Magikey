// Diese Datei lädt Firmendaten aus Firestore.
import { db } from '@/firebase'
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore'

// Holt alle verifizierten Unternehmen aus der Datenbank.
export async function getCompanies() {
  try {
    // Nur Unternehmen berücksichtigen, die als "verified" markiert sind.
    const q = query(collection(db, 'companies'), where('verified', '==', true))
    const snap = await getDocs(q)
    // Wandelt die Ergebnisse in einfache JS-Objekte um.
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    // Im Fehlerfall leere Liste zurückgeben, damit die App stabil bleibt.
    console.error('Fehler beim Abrufen der Firmen:', err)
    return []
  }
}

// Holt ein einzelnes Unternehmen anhand seiner ID.
export async function getCompany(id) {
  try {
    const snap = await getDoc(doc(db, 'companies', id))
    // Existiert die Firma nicht, geben wir null zurück.
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error('Fehler beim Abrufen der Firma:', err)
    return null
  }
}
