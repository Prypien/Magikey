// Diese Datei stellt eine Cloud Function bereit, um aus Koordinaten die Postleitzahl zu holen.
/* eslint-env node */
/* global fetch */
const functions = require('./firebaseFunctions')
const admin = require('./firebaseAdmin')
const cors = require('./cors')({ origin: true })
const { sendReviewEmail } = require('./reviewMailer')

admin.initializeApp()

async function deleteDocumentsByCompanyId(db, collectionName, companyId, field = 'company_id') {
  const snapshot = await db.collection(collectionName).where(field, '==', companyId).get()
  if (snapshot.empty) {
    return 0
  }

  const deletions = snapshot.docs.map((docSnap) => docSnap.ref.delete())
  await Promise.all(deletions)
  return deletions.length
}

exports.postalCodeFromCoords = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(400).send('Only POST requests allowed')
      return
    }
    const { lat, lng } = req.body || {}
    const latNum = Number(lat)
    const lngNum = Number(lng)
    if (
      !Number.isFinite(latNum) ||
      !Number.isFinite(lngNum) ||
      Math.abs(latNum) > 90 ||
      Math.abs(lngNum) > 180
    ) {
      res.status(400).json({ error: 'Invalid coordinates' })
      return
    }
    const key = functions.config().maps && functions.config().maps.key
    if (!key) {
      res.status(500).json({ error: 'API key missing' })
      return
    }
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
      url.searchParams.set('latlng', `${latNum},${lngNum}`)
      url.searchParams.set('key', key)
      const resp = await fetch(url)
      const json = await resp.json()
      if (json.status !== 'OK') {
        res.status(502).json({ error: 'Geocoding failed', status: json.status })
        return
      }
      const component = json.results[0]?.address_components.find((c) => c.types.includes('postal_code'))
      res.json({ postalCode: component?.long_name || '' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'internal' })
    }
  })
})

exports._sendReviewEmail = sendReviewEmail

exports.deleteCompanyAccount = functions.https.onCall(async (_data, context) => {
  const uid = context?.auth?.uid
  if (!uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Eine Anmeldung ist erforderlich, um das Firmenkonto zu löschen.',
    )
  }

  const db = admin.firestore()
  let deletedDocuments = 0

  try {
    await db.collection('companies').doc(uid).delete()
    deletedDocuments += 1
  } catch (error) {
    functions.logger.error('Failed to delete company document', { uid, error: error.message })
    throw new functions.https.HttpsError(
      'internal',
      'Das Firmenprofil konnte nicht gelöscht werden. Bitte versuche es später erneut.',
    )
  }

  const collectionsToClean = [
    { name: 'review_requests', field: 'company_id' },
    { name: 'reviews', field: 'company_id' },
    { name: 'registration_email_requests', field: 'company_id' },
  ]

  for (const { name, field } of collectionsToClean) {
    try {
      deletedDocuments += await deleteDocumentsByCompanyId(db, name, uid, field)
    } catch (error) {
      functions.logger.error('Failed to delete related documents', {
        uid,
        collection: name,
        error: error.message,
      })
      throw new functions.https.HttpsError(
        'internal',
        'Verknüpfte Daten konnten nicht vollständig gelöscht werden. Bitte versuche es später erneut.',
      )
    }
  }

  try {
    await admin.auth().deleteUser(uid)
  } catch (error) {
    if (error?.code === 'auth/user-not-found') {
      functions.logger.warn('Auth user missing during deletion', { uid })
    } else {
      functions.logger.error('Failed to delete auth user', { uid, error: error.message })
      throw new functions.https.HttpsError(
        'internal',
        'Das Benutzerkonto konnte nicht gelöscht werden. Bitte versuche es später erneut.',
      )
    }
  }

  functions.logger.info('Company account deleted', { uid, deletedDocuments })

  return { success: true, deletedDocuments }
})

exports.onReviewRequestCreated = functions.firestore
  .document('review_requests/{requestId}')
  .onCreate(async (snap, context) => {
    const data = snap.data()
    const requestId = context.params.requestId

    if (!data) {
      functions.logger.warn('Received empty review request payload', { requestId })
      return null
    }

    if (!data.customer_email) {
      functions.logger.warn('Missing customer_email on review request', { requestId })
      return null
    }

    try {
      const result = await exports._sendReviewEmail({
        ...data,
        requestId,
      })
      functions.logger.info('Review request email processed', {
        requestId,
        provider: result?.provider,
      })
    } catch (error) {
      functions.logger.error('Failed to send review request email', {
        requestId,
        error: error.message,
      })
      throw error
    }

    return null
  })
