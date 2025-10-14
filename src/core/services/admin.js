import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions, isFirebaseConfigured } from '@/core/firebase'

export async function requestRegistrationEmail({ companyId, companyName, email, triggeredBy = 'admin-dashboard' }) {
  if (!companyId) throw new Error('companyId ist erforderlich')
  if (!email) throw new Error('E-Mail-Adresse fehlt')

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase nicht konfiguriert. Registrierungsmail wird nicht ausgelöst.')
    return { id: null, simulated: true }
  }

  const docRef = await addDoc(collection(db, 'registration_email_requests'), {
    company_id: companyId,
    company_name: companyName || '',
    email,
    requested_at: serverTimestamp(),
    triggered_by: triggeredBy,
    status: 'pending',
  })

  return { id: docRef.id, simulated: false }
}

let deleteUserCallable

function ensureDeleteCallable() {
  if (!deleteUserCallable) {
    if (!isFirebaseConfigured || !functions) {
      throw new Error('Firebase ist nicht konfiguriert. Löschaktionen sind nicht verfügbar.')
    }
    deleteUserCallable = httpsCallable(functions, 'adminDeleteUserByEmail')
  }
  return deleteUserCallable
}

export async function deleteUserDataByEmail(email) {
  const normalizedEmail = typeof email === 'string' ? email.trim() : ''
  if (!normalizedEmail) {
    throw new Error('E-Mail-Adresse fehlt')
  }

  if (!isFirebaseConfigured || !functions) {
    console.warn('Firebase nicht konfiguriert. Löschanfrage wird nicht ausgeführt.')
    return { simulated: true }
  }

  const callable = ensureDeleteCallable()
  const result = await callable({ email: normalizedEmail })
  return result?.data ?? null
}

export const __test__ = {
  __resetDeleteCallable() {
    deleteUserCallable = null
  },
}
