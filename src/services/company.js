import { db } from '@/firebase'
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore'

export async function getCompanies() {
  try {
    const q = query(collection(db, 'companies'), where('verified', '==', true))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Fehler beim Abrufen der Firmen:', err)
    return []
  }
}

export async function getCompany(id) {
  try {
    const snap = await getDoc(doc(db, 'companies', id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error('Fehler beim Abrufen der Firma:', err)
    return null
  }
}
