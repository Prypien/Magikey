// Hilfsfunktionen für das Bewertungs- und Rezensionssystem.
// Alle Bewertungen laufen zentral über diese Datei, sodass die
// Plattform die volle Kontrolle über eingehende Feedbacks behält.

import { db, isFirebaseConfigured } from '@/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

const LOCAL_REVIEW_REQUESTS = new Map()
const LOCAL_REVIEWS = new Map()

function generateId() {
  const globalCrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : null
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID()
  }
  return `req-${Math.random().toString(36).slice(2, 10)}`
}

function createLocalRequest(data) {
  const id = generateId()
  const request = {
    id,
    created_at: new Date().toISOString(),
    status: 'pending',
    ...data,
  }
  LOCAL_REVIEW_REQUESTS.set(id, request)
  return request
}

function storeLocalReview(requestId, review) {
  const reviewList = LOCAL_REVIEWS.get(review.company_id) || []
  LOCAL_REVIEWS.set(review.company_id, [...reviewList, review])
  const request = LOCAL_REVIEW_REQUESTS.get(requestId)
  if (request) {
    LOCAL_REVIEW_REQUESTS.set(requestId, { ...request, status: 'completed', completed_at: new Date().toISOString() })
  }
}

export async function createReviewRequest({ companyId, companyName, customerEmail, channel }) {
  if (!customerEmail) throw new Error('E-Mail-Adresse erforderlich')

  const requestPayload = {
    company_id: companyId,
    company_name: companyName,
    customer_email: customerEmail,
    channel,
    status: 'pending',
    created_at: serverTimestamp(),
  }

  if (!isFirebaseConfigured || !db) {
    return createLocalRequest({
      company_id: companyId,
      company_name: companyName,
      customer_email: customerEmail,
      channel,
    })
  }

  const requestId = generateId()
  const requestRef = doc(collection(db, 'review_requests'), requestId)
  await setDoc(requestRef, requestPayload)
  const snap = await getDoc(requestRef)
  return snap.exists() ? { id: snap.id, ...snap.data() } : { id: requestId, ...requestPayload }
}

export async function getReviewRequest(requestId) {
  if (!requestId) return null

  if (!isFirebaseConfigured || !db) {
    return LOCAL_REVIEW_REQUESTS.get(requestId) || null
  }

  const requestRef = doc(db, 'review_requests', requestId)
  const snap = await getDoc(requestRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function submitReview(requestId, { rating, comment }) {
  if (!rating) throw new Error('Bewertung erforderlich')

  if (!isFirebaseConfigured || !db) {
    const localRequest = LOCAL_REVIEW_REQUESTS.get(requestId)
    if (!localRequest) throw new Error('Rezensionslink ungültig')
    const review = {
      id: generateId(),
      request_id: requestId,
      rating,
      comment: comment || '',
      company_id: localRequest.company_id,
      company_name: localRequest.company_name,
      created_at: new Date().toISOString(),
    }
    storeLocalReview(requestId, review)
    return review
  }

  const requestRef = doc(db, 'review_requests', requestId)
  const requestSnap = await getDoc(requestRef)
  if (!requestSnap.exists()) throw new Error('Rezensionslink ist nicht mehr gültig')
  const requestData = requestSnap.data()

  const reviewRef = doc(collection(db, 'reviews'))
  await setDoc(reviewRef, {
    request_id: requestId,
    rating,
    comment: comment || '',
    company_id: requestData.company_id,
    company_name: requestData.company_name,
    customer_email: requestData.customer_email,
    channel: requestData.channel,
    created_at: serverTimestamp(),
  })

  await updateDoc(requestRef, {
    status: 'completed',
    completed_at: serverTimestamp(),
  })

  const reviewSnap = await getDoc(reviewRef)
  return reviewSnap.exists() ? { id: reviewSnap.id, ...reviewSnap.data() } : null
}

export async function getCompanyReviews(companyId) {
  if (!companyId) return []

  if (!isFirebaseConfigured || !db) {
    return LOCAL_REVIEWS.get(companyId) || []
  }

  const q = query(
    collection(db, 'reviews'),
    where('company_id', '==', companyId),
    orderBy('created_at', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
