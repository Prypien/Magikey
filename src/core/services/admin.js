import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/core/firebase'

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
