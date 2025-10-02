import { db, isFirebaseConfigured } from '@/firebase'
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

const FALLBACK_REVIEWS = [
  {
    id: 'demo-berlin-1',
    company_id: 'demo-berlin',
    author: 'Anna M.',
    rating: 5,
    comment: 'Sehr schneller Service und transparente Preise.',
    created_at: '2024-01-12T09:45:00.000Z',
  },
  {
    id: 'demo-berlin-2',
    company_id: 'demo-berlin',
    author: 'Jens K.',
    rating: 4,
    comment: 'Freundlicher Monteur, leichte Wartezeit.',
    created_at: '2024-03-03T18:20:00.000Z',
  },
  {
    id: 'demo-hamburg-1',
    company_id: 'demo-hamburg',
    author: 'Sophie L.',
    rating: 5,
    comment: 'Top Beratung und schnelle Hilfe.',
    created_at: '2024-02-08T14:05:00.000Z',
  },
]

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

export async function getCompanyReviews(companyId) {
  if (!companyId) return []

  if (!isFirebaseConfigured || !db) {
    return FALLBACK_REVIEWS.filter((review) => review.company_id === companyId)
  }

  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('company_id', '==', companyId),
      orderBy('created_at', 'desc')
    )

    const snapshot = await getDocs(reviewsQuery)
    return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
  } catch (err) {
    console.error('Fehler beim Abrufen der Bewertungen:', err)
    return []
  }
}
