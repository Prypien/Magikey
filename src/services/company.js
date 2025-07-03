import { db } from '@/firebase/firebase'
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore'

export async function getCompanies() {
  const q = query(collection(db, 'companies'), where('verified', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getCompany(id) {
  const snap = await getDoc(doc(db, 'companies', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
