import { db, isFirebaseConfigured } from '@/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export async function createReviewInvite({
  companyId,
  companyName,
  contactType,
  customerEmail,
}) {
  if (!customerEmail) throw new Error('E-Mail-Adresse ist erforderlich')
  if (!companyId) throw new Error('Unternehmens-ID fehlt')

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase nicht konfiguriert. Review-Anfrage wird nicht gespeichert.')
    return { id: null, simulated: true }
  }

  const docRef = await addDoc(collection(db, 'review_requests'), {
    company_id: companyId,
    company_name: companyName,
    contact_type: contactType,
    customer_email: customerEmail,
    status: 'pending',
    created_at: serverTimestamp(),
  })

  return { id: docRef.id, simulated: false }
}
