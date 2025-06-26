/* eslint-env node */
/* global fetch */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.postalCodeFromCoords = functions.https.onCall(async (data) => {
  const { lat, lng } = data
  const key = functions.config().maps && functions.config().maps.key
  if (!key) {
    throw new functions.https.HttpsError('failed-precondition', 'API key missing')
  }
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
  const json = await res.json()
  const component = json.results[0]?.address_components.find((c) => c.types.includes('postal_code'))
  return { postalCode: component?.long_name || '' }
})
