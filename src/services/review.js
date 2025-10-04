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

const FALLBACK_REVIEWS = {
  'demo-berlin': [
    {
      id: 'demo-review-berlin-1',
      author: 'Sophie K.',
      rating: 5,
      comment:
        'Sehr freundlich und innerhalb von 20 Minuten vor Ort gewesen. Preis entsprach dem Kostenvoranschlag.',
      created_at: '12. März 2024',
    },
    {
      id: 'demo-review-berlin-2',
      author: 'Daniel M.',
      rating: 4,
      comment: 'Zuverlässig und transparent. Gerne wieder.',
      created_at: '28. Februar 2024',
    },
  ],
  'demo-hamburg': [
    {
      id: 'demo-review-hamburg-1',
      author: 'Laura F.',
      rating: 5,
      comment: 'Schnelle Hilfe am Abend – sehr empfehlenswert.',
      created_at: '02. März 2024',
    },
  ],
}

export async function createReviewInvite({
  companyId,
  companyName,
  contactType,
  customerEmail,
}) {
  if (!customerEmail) throw new Error('E-Mail-Adresse ist erforderlich')
  if (!companyId) throw new Error('Unternehmens-ID fehlt')

  if (import.meta?.env?.DEV) {
    console.info(
      '[DEV] Mock-Mailversand: Review-E-Mail würde gesendet werden an',
      customerEmail,
      {
        companyId,
        companyName,
        contactType,
      },
    )
  }

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
    return cloneFallbackReviews(companyId)
  }

  try {
    const reviewsRef = collection(db, 'reviews')
    const q = query(
      reviewsRef,
      where('company_id', '==', companyId),
      orderBy('created_at', 'desc'),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docSnap) => normalizeReview(docSnap))
  } catch (err) {
    console.error('Fehler beim Laden der Bewertungen:', err)
    return cloneFallbackReviews(companyId)
  }
}

function normalizeReview(docSnap) {
  const data = docSnap.data() || {}
  let createdAt = data.created_at
  if (createdAt && typeof createdAt.toDate === 'function') {
    try {
      createdAt = createdAt.toDate()
    } catch (err) {
      console.warn('Konnte Timestamp nicht umwandeln:', err)
    }
  }

  return {
    id: docSnap.id,
    author: data.author || 'Anonym',
    rating: data.rating ?? null,
    comment: data.comment || '',
    created_at: createdAt,
  }
}

function cloneFallbackReviews(companyId) {
  const reviews = FALLBACK_REVIEWS[companyId]
  return reviews ? reviews.map((review) => ({ ...review })) : []
}
