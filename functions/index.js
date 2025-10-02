// Diese Datei stellt eine Cloud Function bereit, um aus Koordinaten die Postleitzahl zu holen.
/* eslint-env node */
/* global fetch */
const functions = require('./firebaseFunctions')
const admin = require('./firebaseAdmin')
const cors = require('./cors')({ origin: true })
const { sendReviewEmail } = require('./reviewMailer')

admin.initializeApp()

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
