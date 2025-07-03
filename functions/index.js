/* eslint-env node */
/* global fetch */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

exports.postalCodeFromCoords = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(400).send('Only POST requests allowed')
      return
    }
    const { lat, lng } = req.body || {}
    const key = functions.config().maps && functions.config().maps.key
    if (!key) {
      res.status(500).json({ error: 'API key missing' })
      return
    }
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
      const json = await resp.json()
      const component = json.results[0]?.address_components.find((c) => c.types.includes('postal_code'))
      res.json({ postalCode: component?.long_name || '' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'internal' })
    }
  })
})
